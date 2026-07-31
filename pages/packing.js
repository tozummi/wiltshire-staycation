(() => {
  "use strict";

  const pageType = document.body.dataset.packingPage;
  const CUSTOM_LISTS_KEY = "wiltshireCustomPackingListsV1";
  const PINNED_LIST_KEY = "wiltshirePinnedPackingListV1";
  const PERSONAL_STATE_PREFIX = "wiltshirePackingState:";
  const MAX_CUSTOM_LISTS = 2;

  const SUPABASE_URL = "https://qoeiqvoaqqfheojaanad.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZWlxdm9hcXFmaGVvamFhbmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODMzODEsImV4cCI6MjEwMDA1OTM4MX0.fAkhkc2m7VpVo5Z59LSAJK-_No0xNnt6eLX3U4oSPvg";

  const toastElement = document.getElementById("toast");
  let toastTimer = null;
  let confirmCallback = null;
  let textModalCallback = null;
  let householdClient = null;
  let householdItems = [];
  let householdChannel = null;
  let currentCustomList = null;

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function makeId(prefix = "item") {
    if (window.crypto?.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function showToast(message, isError = false) {
    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.className = `packing-toast is-visible${isError ? " is-error" : ""}`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElement.className = "packing-toast";
    }, 3000);
  }

  function openModal(modal) {
    if (!modal) return;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      modal.querySelector("input, button, select, textarea")?.focus();
    }, 30);
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.hidden = true;

    if (!document.querySelector(".packing-modal-backdrop:not([hidden])")) {
      document.body.style.overflow = "";
    }
  }

  function setupModalClosers() {
    document.addEventListener("click", event => {
      const closeButton = event.target.closest("[data-close-modal]");

      if (closeButton) {
        closeModal(closeButton.closest(".packing-modal-backdrop"));
        return;
      }

      if (event.target.classList.contains("packing-modal-backdrop")) {
        closeModal(event.target);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;

      document.querySelectorAll(".packing-modal-backdrop:not([hidden])")
        .forEach(closeModal);
    });
  }

  function getCustomLists() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_LISTS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCustomLists(lists) {
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(lists));
  }

  function getPinnedListId() {
    return localStorage.getItem(PINNED_LIST_KEY) || "";
  }

  function setPinnedListId(id) {
    if (id) {
      localStorage.setItem(PINNED_LIST_KEY, id);
    } else {
      localStorage.removeItem(PINNED_LIST_KEY);
    }
  }

  function calculateProgress(categories) {
    const items = categories.flatMap(category => category.items || []);
    const packed = items.filter(item => item.packed).length;
    const total = items.length;
    const percentage = total ? Math.round((packed / total) * 100) : 0;

    return { packed, total, percentage };
  }

  function normaliseTemplate(type) {
    const template = PACKING_TEMPLATES[type];

    if (!template) return null;

    return {
      ...clone(template),
      categories: template.categories.map(category => ({
        ...clone(category),
        items: category.items.map(item => ({
          id: makeId(type),
          name: item,
          packed: false
        }))
      }))
    };
  }

  function findCustomList(id) {
    return getCustomLists().find(list => list.id === id) || null;
  }

  function updateCustomList(updatedList) {
    const lists = getCustomLists();
    const index = lists.findIndex(list => list.id === updatedList.id);

    if (index === -1) return false;

    lists[index] = updatedList;
    saveCustomLists(lists);
    currentCustomList = clone(updatedList);
    return true;
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function showConfirm({ title, message, actionLabel, icon = "⚠️", onConfirm }) {
    const modal = document.getElementById("confirm-modal");
    if (!modal) return;

    const titleElement = document.getElementById("confirm-modal-title");
    const messageElement = document.getElementById("confirm-modal-message");
    const iconElement = document.getElementById("confirm-modal-icon");
    const actionButton = document.getElementById("confirm-action");

    titleElement.textContent = title;
    messageElement.textContent = message;
    actionButton.textContent = actionLabel;

    if (iconElement) {
      iconElement.textContent = icon;
    }

    confirmCallback = onConfirm;
    openModal(modal);
  }

  function setupConfirmModal() {
    const modal = document.getElementById("confirm-modal");
    if (!modal) return;

    document.getElementById("confirm-cancel")?.addEventListener("click", () => {
      confirmCallback = null;
      closeModal(modal);
    });

    document.getElementById("confirm-action")?.addEventListener("click", async () => {
      const callback = confirmCallback;
      confirmCallback = null;
      closeModal(modal);

      if (callback) {
        await callback();
      }
    });
  }

  function createCategoryMarkup(category, options = {}) {
    const packedCount = category.items.filter(item => item.packed).length;
    const total = category.items.length;
    const note = category.note
      ? `<p class="category-note">${escapeHTML(category.note)}</p>`
      : "";

    const itemsMarkup = category.items.map(item => {
      const trailing = options.household
        ? `
          <button
            class="assignment-button"
            type="button"
            data-assign-household="${item.id}"
          >
            ${escapeHTML(item.assignedTo || "Who’s bringing it?")}
          </button>
        `
        : options.custom
          ? `
            <div class="custom-item-actions">
              <button
                class="custom-item-action"
                type="button"
                data-rename-custom-item="${item.id}"
                aria-label="Rename ${escapeHTML(item.name)}"
              >✎</button>

              <button
                class="custom-item-action delete"
                type="button"
                data-delete-custom-item="${item.id}"
                aria-label="Delete ${escapeHTML(item.name)}"
              >×</button>
            </div>
          `
          : "";

      return `
        <div class="packing-item ${item.packed ? "is-packed" : ""}">
          <input
            class="packing-checkbox"
            type="checkbox"
            ${item.packed ? "checked" : ""}
            data-check-item="${item.id}"
            aria-label="Mark ${escapeHTML(item.name)} as packed"
          >

          <span class="packing-item-name">${escapeHTML(item.name)}</span>
          ${trailing}
        </div>
      `;
    }).join("");

    return `
      <article class="packing-category">
        <button
          class="packing-category-toggle"
          type="button"
          aria-expanded="true"
        >
          <span class="packing-category-icon" aria-hidden="true">
            ${escapeHTML(category.icon || "📦")}
          </span>

          <span class="packing-category-heading">
            <strong>${escapeHTML(category.name)}</strong>
            <small>${packedCount} of ${total} packed</small>
          </span>

          <span class="packing-category-chevron" aria-hidden="true">⌄</span>
        </button>

        ${note}

        <div class="packing-items">
          ${itemsMarkup || `<p class="category-note">No items in this category.</p>`}
        </div>
      </article>
    `;
  }

  function createCategoryProgressMarkup(categories) {
    return categories.map(category => {
      const progress = calculateProgress([category]);

      return `
        <div class="category-progress-row">
          <strong>${escapeHTML(category.name)}</strong>
          <span>${progress.packed} / ${progress.total}</span>

          <div class="category-progress-mini-track">
            <div
              class="category-progress-mini-fill"
              style="width: ${progress.percentage}%"
            ></div>
          </div>
        </div>
      `;
    }).join("");
  }

  function setupCategoryToggles(container) {
    container.addEventListener("click", event => {
      const toggle = event.target.closest(".packing-category-toggle");
      if (!toggle) return;

      const category = toggle.closest(".packing-category");
      const collapsed = category.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-expanded", String(!collapsed));
    });
  }

  // =========================================================
  // DIRECTORY
  // =========================================================

  function initialiseDirectoryPage() {
    const customCards = document.getElementById("custom-list-cards");
    const pinnedSection = document.getElementById("pinned-list-section");
    const pinnedCard = document.getElementById("pinned-list-card");
    const createButton = document.getElementById("create-custom-button");
    const importInput = document.getElementById("import-list-input");

    function renderDirectory() {
      const lists = getCustomLists();
      const pinnedId = getPinnedListId();
      const pinned = lists.find(list => list.id === pinnedId);

      pinnedSection.hidden = !pinned;

      if (pinned) {
        const progress = calculateProgress(pinned.categories);

        pinnedCard.innerHTML = `
          <a class="pinned-list-card" href="packing-custom.html?id=${encodeURIComponent(pinned.id)}">
            <span class="custom-list-icon" aria-hidden="true">📌</span>

            <span class="custom-list-copy">
              <strong>${escapeHTML(pinned.name)}</strong>
              <small>${progress.packed} of ${progress.total} packed · ${progress.percentage}%</small>
            </span>

            <span class="directory-arrow" aria-hidden="true">›</span>
          </a>
        `;
      } else {
        pinnedCard.innerHTML = "";
      }

      if (!lists.length) {
        customCards.innerHTML = `
          <p class="custom-limit-note">
            You have not created a custom packing list yet.
          </p>
        `;
      } else {
        customCards.innerHTML = lists.map(list => {
          const progress = calculateProgress(list.categories);
          const isPinned = list.id === pinnedId;

          return `
            <article class="custom-list-card">
              <div class="custom-list-icon" aria-hidden="true">${isPinned ? "📌" : "✨"}</div>

              <div class="custom-list-copy">
                <strong>${escapeHTML(list.name)}</strong>
                <small>${progress.packed} of ${progress.total} packed · ${progress.percentage}%</small>
              </div>

              <div class="custom-list-actions">
                <a class="mini-action" href="packing-custom.html?id=${encodeURIComponent(list.id)}">Open</a>
                <button class="mini-action" type="button" data-pin-list="${list.id}">
                  ${isPinned ? "Unpin" : "Pin"}
                </button>
                <button class="mini-action" type="button" data-export-list="${list.id}">Export</button>
                <button class="mini-action" type="button" data-duplicate-list="${list.id}">Duplicate</button>
                <button class="mini-action danger" type="button" data-delete-list="${list.id}">Delete</button>
              </div>
            </article>
          `;
        }).join("");
      }

      const atLimit = lists.length >= MAX_CUSTOM_LISTS;
      createButton.classList.toggle("is-disabled", atLimit);
      createButton.setAttribute("aria-disabled", String(atLimit));

      if (atLimit) {
        createButton.removeAttribute("href");
      } else {
        createButton.href = "packing-custom.html";
      }
    }

    customCards.addEventListener("click", event => {
      const pinButton = event.target.closest("[data-pin-list]");

      if (pinButton) {
        const id = pinButton.dataset.pinList;
        setPinnedListId(getPinnedListId() === id ? "" : id);
        renderDirectory();
        showToast(getPinnedListId() === id ? "List pinned for quick access." : "List unpinned.");
        return;
      }

      const exportButton = event.target.closest("[data-export-list]");

      if (exportButton) {
        const list = findCustomList(exportButton.dataset.exportList);
        if (!list) return;

        downloadJSON({
          kind: "wiltshire-packing-list",
          version: 1,
          exportedAt: new Date().toISOString(),
          list
        }, `${slugify(list.name) || "packing-list"}.json`);

        showToast("Packing list exported.");
        return;
      }

      const duplicateButton = event.target.closest("[data-duplicate-list]");

      if (duplicateButton) {
        const lists = getCustomLists();

        if (lists.length >= MAX_CUSTOM_LISTS) {
          showToast("You already have two custom lists.", true);
          return;
        }

        const original = findCustomList(duplicateButton.dataset.duplicateList);
        if (!original) return;

        const duplicate = clone(original);
        duplicate.id = makeId("list");
        duplicate.name = `${original.name} Copy`;
        duplicate.createdAt = new Date().toISOString();
        duplicate.updatedAt = duplicate.createdAt;
        duplicate.categories.forEach(category => {
          category.items.forEach(item => {
            item.id = makeId("custom");
          });
        });

        lists.push(duplicate);
        saveCustomLists(lists);
        renderDirectory();
        showToast("Custom list duplicated.");
        return;
      }

      const deleteButton = event.target.closest("[data-delete-list]");

      if (deleteButton) {
        const list = findCustomList(deleteButton.dataset.deleteList);
        if (!list) return;

        showConfirm({
          title: "Delete this custom list?",
          message: `“${list.name}” and all of its ticks and personal items will be removed from this device.`,
          actionLabel: "Delete",
          onConfirm: () => {
            const remaining = getCustomLists().filter(entry => entry.id !== list.id);
            saveCustomLists(remaining);

            if (getPinnedListId() === list.id) {
              setPinnedListId("");
            }

            renderDirectory();
            showToast("Custom list deleted.");
          }
        });
      }
    });

    createButton.addEventListener("click", event => {
      if (getCustomLists().length >= MAX_CUSTOM_LISTS) {
        event.preventDefault();
        showToast("You can save no more than two custom lists.", true);
      }
    });

    importInput.addEventListener("change", async () => {
      const file = importInput.files?.[0];
      importInput.value = "";

      if (!file) return;

      if (getCustomLists().length >= MAX_CUSTOM_LISTS) {
        showToast("Delete a custom list before importing another.", true);
        return;
      }

      try {
        const parsed = JSON.parse(await file.text());
        const imported = parsed?.kind === "wiltshire-packing-list" ? parsed.list : parsed;

        if (!imported?.name || !Array.isArray(imported.categories)) {
          throw new Error("Invalid list");
        }

        const safeList = {
          id: makeId("list"),
          name: String(imported.name).slice(0, 50),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          categories: imported.categories.map(category => ({
            name: String(category.name || "Personal").slice(0, 40),
            icon: category.icon || "📦",
            note: category.note || "",
            items: Array.isArray(category.items)
              ? category.items.map(item => ({
                  id: makeId("custom"),
                  name: String(item.name || item).slice(0, 80),
                  packed: Boolean(item.packed)
                }))
              : []
          }))
        };

        const lists = getCustomLists();
        lists.push(safeList);
        saveCustomLists(lists);
        renderDirectory();
        showToast("Packing list imported.");
      } catch (error) {
        console.error(error);
        showToast("That file is not a valid packing-list backup.", true);
      }
    });

    renderDirectory();
  }

  // =========================================================
  // STANDARD AND HOUSEHOLD LIST PAGE
  // =========================================================

  function initialiseListPage() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "men";

    if (type === "household") {
      initialiseHouseholdList();
    } else {
      initialisePersonalTemplateList(type);
    }
  }

  function initialisePersonalTemplateList(type) {
    const template = normaliseTemplate(type) || normaliseTemplate("men");
    const storageKey = `${PERSONAL_STATE_PREFIX}${type}`;
    let categories = template.categories;

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

      if (Array.isArray(saved)) {
        const packedByName = new Map(
          saved.flatMap(category =>
            (category.items || []).map(item => [`${category.name}::${item.name}`, Boolean(item.packed)])
          )
        );

        categories.forEach(category => {
          category.items.forEach(item => {
            item.packed = packedByName.get(`${category.name}::${item.name}`) || false;
          });
        });
      }
    } catch {
      // Use fresh template.
    }

    document.title = `${template.title} | Wiltshire Family Staycation`;
    document.getElementById("list-page-icon").textContent = template.icon;
    document.getElementById("list-page-label").textContent = template.label;
    document.getElementById("list-page-title").textContent = template.title;
    document.getElementById("list-page-introduction").textContent = template.introduction;

    const categoryContainer = document.getElementById("packing-categories");
    const progressGrid = document.getElementById("category-progress-grid");

    function saveAndRender() {
      localStorage.setItem(storageKey, JSON.stringify(categories));
      render();
    }

    function render() {
      const progress = calculateProgress(categories);

      document.getElementById("overall-progress-percent").textContent = `${progress.percentage}%`;
      document.getElementById("overall-progress-fill").style.width = `${progress.percentage}%`;
      document.getElementById("overall-progress-copy").textContent = `${progress.packed} of ${progress.total} packed`;
      document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress.percentage));

      progressGrid.innerHTML = createCategoryProgressMarkup(categories);
      categoryContainer.innerHTML = categories.map(category => createCategoryMarkup(category)).join("");
    }

    categoryContainer.addEventListener("change", event => {
      const checkbox = event.target.closest("[data-check-item]");
      if (!checkbox) return;

      categories.forEach(category => {
        const item = category.items.find(entry => entry.id === checkbox.dataset.checkItem);

        if (item) {
          item.packed = checkbox.checked;
        }
      });

      saveAndRender();
    });

    setupCategoryToggles(categoryContainer);

    document.getElementById("reset-list-button").addEventListener("click", () => {
      showConfirm({
        title: "Reset this checklist?",
        message: "This will untick every item in this list. Your other packing lists will not be affected.",
        actionLabel: "Reset",
        icon: "↺",
        onConfirm: () => {
          categories.forEach(category => {
            category.items.forEach(item => {
              item.packed = false;
            });
          });

          saveAndRender();
          showToast("Checklist reset.");
        }
      });
    });

    render();
  }

  async function initialiseHouseholdList() {
    document.title = `${HOUSEHOLD_TEMPLATE.title} | Wiltshire Family Staycation`;
    document.getElementById("list-page-icon").textContent = HOUSEHOLD_TEMPLATE.icon;
    document.getElementById("list-page-label").textContent = HOUSEHOLD_TEMPLATE.label;
    document.getElementById("list-page-title").textContent = HOUSEHOLD_TEMPLATE.title;
    document.getElementById("list-page-introduction").textContent = HOUSEHOLD_TEMPLATE.introduction;
    document.getElementById("household-note").hidden = false;

    householdClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const categoryContainer = document.getElementById("packing-categories");
    const progressGrid = document.getElementById("category-progress-grid");
    const assignmentModal = document.getElementById("assignment-modal");
    const assignmentForm = document.getElementById("assignment-form");
    const assignmentItemId = document.getElementById("assignment-item-id");
    const assignmentName = document.getElementById("assignment-name");

    function transformRows(rows) {
      return HOUSEHOLD_TEMPLATE.categories.map(category => ({
        name: category.name,
        icon: category.icon,
        items: rows
          .filter(item => item.category === category.name)
          .sort((a, b) => a.display_order - b.display_order)
          .map(item => ({
            id: item.id,
            name: item.item,
            packed: item.packed,
            assignedTo: item.assigned_to || ""
          }))
      }));
    }

    function render() {
      const categories = transformRows(householdItems);
      const progress = calculateProgress(categories);

      document.getElementById("overall-progress-percent").textContent = `${progress.percentage}%`;
      document.getElementById("overall-progress-fill").style.width = `${progress.percentage}%`;
      document.getElementById("overall-progress-copy").textContent = `${progress.packed} of ${progress.total} packed`;
      document.querySelector(".progress-track").setAttribute("aria-valuenow", String(progress.percentage));

      progressGrid.innerHTML = createCategoryProgressMarkup(categories);
      categoryContainer.innerHTML = categories.map(category =>
        createCategoryMarkup(category, { household: true })
      ).join("");
    }

    async function loadItems() {
      const { data, error } = await householdClient
        .from("household_packing_items")
        .select("*")
        .order("category_order")
        .order("display_order");

      if (error) {
        console.error(error);
        categoryContainer.innerHTML = `
          <article class="packing-category">
            <p class="category-note">The shared household list could not be loaded.</p>
          </article>
        `;
        showToast("Shared household list could not be loaded.", true);
        return;
      }

      householdItems = data || [];
      render();
    }

    categoryContainer.addEventListener("change", async event => {
      const checkbox = event.target.closest("[data-check-item]");
      if (!checkbox) return;

      const item = householdItems.find(entry => entry.id === checkbox.dataset.checkItem);
      if (!item) return;

      item.packed = checkbox.checked;
      render();

      const { error } = await householdClient
        .from("household_packing_items")
        .update({
          packed: checkbox.checked,
          packed_at: checkbox.checked ? new Date().toISOString() : null
        })
        .eq("id", item.id);

      if (error) {
        item.packed = !checkbox.checked;
        render();
        showToast("That household item could not be updated.", true);
      }
    });

    categoryContainer.addEventListener("click", event => {
      const assignButton = event.target.closest("[data-assign-household]");
      if (!assignButton) return;

      const item = householdItems.find(entry => entry.id === assignButton.dataset.assignHousehold);
      if (!item) return;

      assignmentItemId.value = item.id;
      assignmentName.value = item.assigned_to || "";
      document.getElementById("assignment-item-name").textContent = item.item;
      openModal(assignmentModal);
    });

    setupCategoryToggles(categoryContainer);

    assignmentForm.addEventListener("submit", async event => {
      event.preventDefault();

      const id = assignmentItemId.value;
      const assignedTo = assignmentName.value.trim() || null;

      const { error } = await householdClient
        .from("household_packing_items")
        .update({ assigned_to: assignedTo })
        .eq("id", id);

      if (error) {
        console.error(error);
        showToast("The assignment could not be saved.", true);
        return;
      }

      closeModal(assignmentModal);
      await loadItems();
      showToast("Household assignment updated.");
    });

    document.getElementById("reset-list-button").addEventListener("click", () => {
      showConfirm({
        title: "Reset the shared household list?",
        message: "This will untick every household item for everyone. Assignments will stay in place.",
        actionLabel: "Reset",
        icon: "↺",
        onConfirm: async () => {
          const { error } = await householdClient
            .from("household_packing_items")
            .update({
              packed: false,
              packed_at: null
            })
            .not("id", "is", null);

          if (error) {
            console.error(error);
            showToast("The shared list could not be reset.", true);
            return;
          }

          await loadItems();
          showToast("Shared household checklist reset.");
        }
      });
    });

    householdChannel = householdClient
      .channel("household-packing-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "household_packing_items"
        },
        () => loadItems()
      )
      .subscribe();

    await loadItems();
  }

  // =========================================================
  // CUSTOM LIST BUILDER AND EDITOR
  // =========================================================

  function initialiseCustomPage() {
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id");
    const builder = document.getElementById("custom-builder");
    const editor = document.getElementById("custom-editor");

    const textModal = document.getElementById("text-modal");
    const textModalForm = document.getElementById("text-modal-form");
    const textModalInput = document.getElementById("text-modal-input");
    const textModalTitle = document.getElementById("text-modal-title");
    const textModalLabel = document.getElementById("text-modal-label");

    function openTextModal({ title, label, value, onSave }) {
      textModalTitle.textContent = title;
      textModalLabel.textContent = label;
      textModalInput.value = value;
      textModalCallback = onSave;
      openModal(textModal);
      textModalInput.select();
    }

    textModalForm.addEventListener("submit", event => {
      event.preventDefault();

      const value = textModalInput.value.trim();
      if (!value) return;

      const callback = textModalCallback;
      textModalCallback = null;
      closeModal(textModal);

      if (callback) callback(value);
    });

    function showBuilder() {
      builder.hidden = false;
      editor.hidden = true;
      currentCustomList = null;
      document.getElementById("custom-page-title").textContent = "Create Custom List";
    }

    function showEditor(list) {
      currentCustomList = clone(list);
      builder.hidden = true;
      editor.hidden = false;
      document.getElementById("custom-page-title").textContent = currentCustomList.name;
      renderEditor();
    }

    function renderEditor() {
      if (!currentCustomList) return;

      const progress = calculateProgress(currentCustomList.categories);
      const categoriesContainer = document.getElementById("custom-packing-categories");

      document.getElementById("custom-progress-title").textContent = currentCustomList.name;
      document.getElementById("custom-progress-percent").textContent = `${progress.percentage}%`;
      document.getElementById("custom-progress-fill").style.width = `${progress.percentage}%`;
      document.getElementById("custom-progress-copy").textContent = `${progress.packed} of ${progress.total} packed`;
      document.getElementById("custom-category-progress-grid").innerHTML =
        createCategoryProgressMarkup(currentCustomList.categories);

      categoriesContainer.innerHTML = currentCustomList.categories.map(category =>
        createCategoryMarkup(category, { custom: true })
      ).join("");

      const isPinned = getPinnedListId() === currentCustomList.id;
      document.getElementById("pin-custom-button").textContent = isPinned ? "📌 Unpin" : "📌 Pin";
    }

    function persistAndRender(message = "") {
      currentCustomList.updatedAt = new Date().toISOString();
      updateCustomList(currentCustomList);
      renderEditor();

      if (message) showToast(message);
    }

    document.getElementById("build-custom-list-button").addEventListener("click", () => {
      const lists = getCustomLists();

      if (lists.length >= MAX_CUSTOM_LISTS) {
        showToast("You already have two custom lists.", true);
        return;
      }

      const name = document.getElementById("custom-list-name").value.trim();

      if (!name) {
        showToast("Please give your list a name.", true);
        return;
      }

      const selectedTypes = [
        ...document.querySelectorAll(".template-option input:checked")
      ].map(input => input.value);

      const categoriesByName = new Map();

      selectedTypes.forEach(type => {
        const template = normaliseTemplate(type);

        template?.categories.forEach(category => {
          if (!categoriesByName.has(category.name)) {
            categoriesByName.set(category.name, {
              name: category.name,
              icon: category.icon,
              note: category.note || "",
              items: []
            });
          }

          const target = categoriesByName.get(category.name);
          const existingNames = new Set(target.items.map(item => item.name.toLowerCase()));

          category.items.forEach(item => {
            if (!existingNames.has(item.name.toLowerCase())) {
              target.items.push({
                id: makeId("custom"),
                name: item.name,
                packed: false
              });
              existingNames.add(item.name.toLowerCase());
            }
          });
        });
      });

      const list = {
        id: makeId("list"),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categories: [...categoriesByName.values()]
      };

      if (!list.categories.length) {
        list.categories = [{
          name: "Personal",
          icon: "✨",
          note: "",
          items: []
        }];
      }

      lists.push(list);
      saveCustomLists(lists);

      history.replaceState(null, "", `packing-custom.html?id=${encodeURIComponent(list.id)}`);
      showEditor(list);
      showToast("Custom packing list created.");
    });

    const customContainer = document.getElementById("custom-packing-categories");
    setupCategoryToggles(customContainer);

    customContainer.addEventListener("change", event => {
      const checkbox = event.target.closest("[data-check-item]");
      if (!checkbox || !currentCustomList) return;

      currentCustomList.categories.forEach(category => {
        const item = category.items.find(entry => entry.id === checkbox.dataset.checkItem);
        if (item) item.packed = checkbox.checked;
      });

      persistAndRender();
    });

    customContainer.addEventListener("click", event => {
      const renameButton = event.target.closest("[data-rename-custom-item]");

      if (renameButton && currentCustomList) {
        let foundItem = null;

        currentCustomList.categories.forEach(category => {
          const item = category.items.find(entry => entry.id === renameButton.dataset.renameCustomItem);
          if (item) foundItem = item;
        });

        if (!foundItem) return;

        openTextModal({
          title: "Rename Item",
          label: "Item name",
          value: foundItem.name,
          onSave: value => {
            foundItem.name = value;
            persistAndRender("Item renamed.");
          }
        });

        return;
      }

      const deleteButton = event.target.closest("[data-delete-custom-item]");

      if (deleteButton && currentCustomList) {
        let foundItem = null;

        currentCustomList.categories.forEach(category => {
          const item = category.items.find(entry => entry.id === deleteButton.dataset.deleteCustomItem);
          if (item) foundItem = item;
        });

        if (!foundItem) return;

        showConfirm({
          title: "Remove this item?",
          message: `“${foundItem.name}” will be removed from this custom list.`,
          actionLabel: "Remove",
          onConfirm: () => {
            currentCustomList.categories.forEach(category => {
              category.items = category.items.filter(item => item.id !== foundItem.id);
            });

            currentCustomList.categories =
              currentCustomList.categories.filter(category => category.items.length > 0);

            if (!currentCustomList.categories.length) {
              currentCustomList.categories.push({
                name: "Personal",
                icon: "✨",
                note: "",
                items: []
              });
            }

            persistAndRender("Item removed.");
          }
        });
      }
    });

    document.getElementById("add-custom-item-form").addEventListener("submit", event => {
      event.preventDefault();

      if (!currentCustomList) return;

      const itemName = document.getElementById("new-custom-item").value.trim();
      const categoryName = document.getElementById("new-custom-category").value.trim() || "Personal";

      if (!itemName) return;

      let category = currentCustomList.categories.find(
        entry => entry.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (!category) {
        category = {
          name: categoryName,
          icon: "✨",
          note: "",
          items: []
        };

        currentCustomList.categories.push(category);
      }

      category.items.push({
        id: makeId("custom"),
        name: itemName,
        packed: false
      });

      event.currentTarget.reset();
      persistAndRender("Personal item added.");
    });

    document.getElementById("rename-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      openTextModal({
        title: "Rename List",
        label: "List name",
        value: currentCustomList.name,
        onSave: value => {
          currentCustomList.name = value;
          document.getElementById("custom-page-title").textContent = value;
          persistAndRender("Custom list renamed.");
        }
      });
    });

    document.getElementById("pin-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      if (getPinnedListId() === currentCustomList.id) {
        setPinnedListId("");
        showToast("List unpinned.");
      } else {
        setPinnedListId(currentCustomList.id);
        showToast("List pinned for quick access.");
      }

      renderEditor();
    });

    document.getElementById("export-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      downloadJSON({
        kind: "wiltshire-packing-list",
        version: 1,
        exportedAt: new Date().toISOString(),
        list: currentCustomList
      }, `${slugify(currentCustomList.name) || "packing-list"}.json`);

      showToast("Packing list exported.");
    });

    document.getElementById("duplicate-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      const lists = getCustomLists();

      if (lists.length >= MAX_CUSTOM_LISTS) {
        showToast("You already have two custom lists.", true);
        return;
      }

      const duplicate = clone(currentCustomList);
      duplicate.id = makeId("list");
      duplicate.name = `${currentCustomList.name} Copy`;
      duplicate.createdAt = new Date().toISOString();
      duplicate.updatedAt = duplicate.createdAt;
      duplicate.categories.forEach(category => {
        category.items.forEach(item => {
          item.id = makeId("custom");
        });
      });

      lists.push(duplicate);
      saveCustomLists(lists);
      showToast("Custom list duplicated.");
    });

    document.getElementById("reset-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      showConfirm({
        title: "Reset this custom checklist?",
        message: "This will untick every item. Your added and removed items will stay as they are.",
        actionLabel: "Reset",
        icon: "↺",
        onConfirm: () => {
          currentCustomList.categories.forEach(category => {
            category.items.forEach(item => {
              item.packed = false;
            });
          });

          persistAndRender("Custom checklist reset.");
        }
      });
    });

    document.getElementById("delete-custom-button").addEventListener("click", () => {
      if (!currentCustomList) return;

      showConfirm({
        title: "Delete this custom list?",
        message: `“${currentCustomList.name}” and all of its personal items will be deleted from this device.`,
        actionLabel: "Delete",
        onConfirm: () => {
          const remaining = getCustomLists().filter(list => list.id !== currentCustomList.id);
          saveCustomLists(remaining);

          if (getPinnedListId() === currentCustomList.id) {
            setPinnedListId("");
          }

          window.location.href = "packing.html";
        }
      });
    });

    const requestedList = requestedId ? findCustomList(requestedId) : null;

    if (requestedList) {
      showEditor(requestedList);
    } else {
      showBuilder();
    }
  }

  setupModalClosers();
  setupConfirmModal();

  if (pageType === "directory") {
    initialiseDirectoryPage();
  } else if (pageType === "list") {
    initialiseListPage();
  } else if (pageType === "custom") {
    initialiseCustomPage();
  }
})();
