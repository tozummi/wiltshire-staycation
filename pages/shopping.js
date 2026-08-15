/* Page must remain visible even if a later API call fails. */
document.body.classList.add("shopping-page-ready");

const SUPABASE_URL =
  "https://qoeiqvoaqqfheojaanad.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZWlxdm9hcXFmaGVvamFhbmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODMzODEsImV4cCI6MjEwMDA1OTM4MX0.fAkhkc2m7VpVo5Z59LSAJK-_No0xNnt6eLX3U4oSPvg";

const db =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =========================================
   SHOPPING CATEGORIES
========================================= */

const categories = [
  ["Meat & Fish", "🥩"],
  ["Fruit & Vegetables", "🥬"],
  ["Dairy & Eggs", "🥛"],
  ["Bakery", "🍞"],
  ["Breakfast", "🥣"],
  ["Cupboard", "🥫"],
  ["Herbs & Spices", "🧂"],
  ["Drinks", "🥤"],
  ["Snacks", "🍿"],
  ["Household & Disposables", "🧻"]
];

const icons = {
  Tesco: "🛒",
  Costco: "📦",
  "Halal Shop": "🥩"
};


/* =========================================
   STATE
========================================= */

let items = [];
let suggestions = [];
let shops = [];

let shopFilter = "all";
let remainingOnly = false;
let channel;

const SHOPPING_VIEW_KEY =
  "wiltshireShoppingViewModeV1";

let shoppingView =
  localStorage.getItem(SHOPPING_VIEW_KEY) === "detailed"
    ? "detailed"
    : "compact";


/* =========================================
   HELPERS
========================================= */

const $ = id =>
  document.getElementById(id);

const esc = value =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");


function toast(message, error = false) {
  const element = $("toast");

  element.textContent = message;

  element.className =
    "toast show" +
    (error ? " error-toast" : "");

  clearTimeout(element.timer);

  element.timer =
    setTimeout(() => {
      element.className = "toast";
    }, 3000);
}


function openModal(id) {
  const modal = $(id);

  if (!modal) return;

  modal.hidden = false;

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    modal
      .querySelector(
        "input:not([type=hidden]), select, button"
      )
      ?.focus();
  }, 30);
}


function closeModal(id) {
  const modal = $(id);

  if (!modal) return;

  modal.hidden = true;

  if (
    !document.querySelector(
      ".modal:not([hidden])"
    )
  ) {
    document.body.style.overflow = "";
  }
}


/* =========================================
   CATEGORY SELECTS
========================================= */

function fillCategories() {
  const options =
    categories
      .map(
        ([name]) =>
          `<option>${esc(name)}</option>`
      )
      .join("");

  $("itemCategory").innerHTML = options;

  $("suggestionAddCategory").innerHTML =
    options;
}


/* =========================================
   COMPACT / DETAILED VIEW
========================================= */

function applyShoppingView() {
  document.body.classList.toggle(
    "shopping-view-compact",
    shoppingView === "compact"
  );

  document
    .querySelectorAll("[data-shopping-view]")
    .forEach(button => {
      button.classList.toggle(
        "is-active",
        button.dataset.shoppingView ===
          shoppingView
      );
    });
}


function setupShoppingView() {
  document
    .querySelectorAll("[data-shopping-view]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          shoppingView =
            button.dataset.shoppingView ===
            "detailed"
              ? "detailed"
              : "compact";

          localStorage.setItem(
            SHOPPING_VIEW_KEY,
            shoppingView
          );

          applyShoppingView();
        }
      );
    });

  applyShoppingView();
}


/* =========================================
   LOAD DATA
========================================= */

async function loadAll() {
  await Promise.all([
    loadShops(),
    loadItems(),
    loadSuggestions()
  ]);

  setupRealtime();
}


async function loadShops() {
  const { data, error } =
    await db
      .from("shopping_shops")
      .select("*")
      .order("display_order");

  if (error) {
    toast(
      "Shopping arrangements could not be loaded.",
      true
    );

    return;
  }

  shops = data || [];

  renderShops();
}


async function loadItems() {
  const { data, error } =
    await db
      .from("shopping_items")
      .select("*")
      .order("category_order")
      .order("display_order")
      .order("created_at");

  if (error) {
    $("categoryList").innerHTML = `
      <div class="page-card loading-card">
        The shopping list could not be loaded.
      </div>
    `;

    return;
  }

  items = data || [];

  renderItems();
  renderProgress();
}


async function loadSuggestions() {
  const { data, error } =
    await db
      .from("shopping_suggestions")
      .select("*")
      .eq("status", "pending")
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    toast(
      "Suggestions could not be loaded.",
      true
    );

    return;
  }

  suggestions = data || [];

  renderSuggestions();
}


/* =========================================
   SHOPPING ARRANGEMENTS
========================================= */

function renderShops() {
  $("shopsGrid").innerHTML =
    shops.length
      ? shops
          .map(
            shop => `
              <article class="shop-card">

                <div class="shop-icon">
                  ${icons[shop.name] || "🛍️"}
                </div>

                <div class="shop-copy">
                  <strong>
                    ${esc(shop.name)}
                  </strong>

                  <small>
                    ${esc(shop.description || "")}
                  </small>

                  <span class="assignment">
                    Assigned to:
                    <b>
                      ${esc(
                        shop.assigned_to ||
                        "Not assigned yet"
                      )}
                    </b>
                  </span>
                </div>

                <button
                  class="shop-edit"
                  data-shop-edit="${shop.id}"
                  aria-label="Edit assignment"
                  type="button"
                >
                  ✎
                </button>

              </article>
            `
          )
          .join("")
      : `<p class="loading">
           No arrangements yet.
         </p>`;
}


/* =========================================
   ARRANGEMENTS ACCORDION
========================================= */

const arrangementsToggle =
  $("arrangementsToggle");

const arrangementsPanel =
  $("arrangementsPanel");

if (
  arrangementsToggle &&
  arrangementsPanel
) {
  arrangementsToggle.addEventListener(
    "click",
    () => {
      const isOpen =
        arrangementsToggle.getAttribute(
          "aria-expanded"
        ) === "true";

      arrangementsToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      arrangementsPanel.hidden = isOpen;
    }
  );
}


/* =========================================
   FILTER ITEMS
========================================= */

function visibleItems() {
  return items.filter(item => {
    const matchesShop =
      shopFilter === "all" ||
      item.shop === shopFilter;

    const matchesRemaining =
      !remainingOnly ||
      !item.completed;

    return (
      matchesShop &&
      matchesRemaining
    );
  });
}


/* =========================================
   RENDER SHOPPING LIST
========================================= */

function renderItems() {
  const visible =
    visibleItems();

  $("categoryList").innerHTML =
    categories
      .map(([name, icon]) => {
        const all =
          items.filter(
            item =>
              item.category === name
          );

        const shown =
          visible.filter(
            item =>
              item.category === name
          );

        if (
          shopFilter !== "all" &&
          !shown.length
        ) {
          return "";
        }

        const done =
          all.filter(
            item => item.completed
          ).length;

        return `
          <article class="category">

            <button
              class="category-toggle"
              aria-expanded="true"
              type="button"
            >

              <span class="category-icon">
                ${icon}
              </span>

              <span class="category-name">

                <strong>
                  ${esc(name)}
                </strong>

                <small>
                  ${
                    all.length
                      ? `${done} of ${all.length} bought`
                      : "Nothing added yet"
                  }
                </small>

              </span>

              <span>⌄</span>

            </button>

            <div class="category-items">

              ${
                shown.length
                  ? shown
                      .map(renderItem)
                      .join("")
                  : `
                    <p class="empty">
                      No items for this filter.
                    </p>
                  `
              }

            </div>

          </article>
        `;
      })
      .join("") ||
    `
      <div class="page-card loading-card">
        No items match this filter.
      </div>
    `;
}


function renderItem(item) {
  return `
    <div
      class="shopping-item
      ${item.completed ? "done" : ""}"
    >

      <input
        class="item-check"
        type="checkbox"
        data-toggle="${item.id}"
        ${item.completed ? "checked" : ""}
        aria-label="Mark ${esc(item.item)} as bought"
      >

      <div class="item-copy">

        <span class="item-name">
          ${esc(item.item)}
        </span>

        <div class="item-meta">

          ${
            item.quantity
              ? `<span>
                   ${esc(item.quantity)}
                 </span>`
              : ""
          }

          <span class="shop-tag">
            ${esc(item.shop)}
          </span>

        </div>

      </div>

      <div class="item-actions">

        <button
          class="item-edit"
          data-edit="${item.id}"
          type="button"
          aria-label="Edit ${esc(item.item)}"
        >
          ✎
        </button>

        <button
          class="item-delete"
          data-delete="${item.id}"
          type="button"
          aria-label="Delete ${esc(item.item)}"
        >
          ×
        </button>

      </div>

    </div>
  `;
}


/* =========================================
   SHOPPING PROGRESS
========================================= */

function renderProgress() {
  const total =
    items.length;

  const done =
    items.filter(
      item => item.completed
    ).length;

  const percentage =
    total
      ? Math.round(
          (done / total) * 100
        )
      : 0;

  $("progressPercent").textContent =
    `${percentage}%`;

  $("progressFill").style.width =
    `${percentage}%`;

  $("progressTrack").setAttribute(
    "aria-valuenow",
    percentage
  );

  $("progressText").textContent =
    total
      ? `${done} of ${total} items bought`
      : "No shopping items yet.";
}


/* =========================================
   SHOP FILTERS
========================================= */

$("shopFilters").onclick =
  event => {
    const button =
      event.target.closest(
        "[data-shop]"
      );

    if (!button) return;

    shopFilter =
      button.dataset.shop;

    document
      .querySelectorAll(
        "[data-shop]"
      )
      .forEach(filterButton => {
        filterButton.classList.toggle(
          "active",
          filterButton === button
        );
      });

    renderItems();
  };


$("remainingBtn").onclick =
  () => {
    remainingOnly =
      !remainingOnly;

    $("remainingBtn")
      .classList.toggle(
        "active",
        remainingOnly
      );

    $("remainingBtn").textContent =
      remainingOnly
        ? "Showing remaining only"
        : "Show remaining only";

    renderItems();
  };


/* =========================================
   SHOPPING ITEM EVENTS
========================================= */

$("categoryList").onclick =
  async event => {
    const categoryToggle =
      event.target.closest(
        ".category-toggle"
      );

    if (categoryToggle) {
      const card =
        categoryToggle.closest(
          ".category"
        );

      const collapsed =
        card.classList.toggle(
          "collapsed"
        );

      categoryToggle.setAttribute(
        "aria-expanded",
        String(!collapsed)
      );

      return;
    }

    const checkbox =
      event.target.closest(
        "[data-toggle]"
      );

    if (checkbox) {
      return toggleItem(
        checkbox.dataset.toggle,
        checkbox.checked
      );
    }

    const edit =
      event.target.closest(
        "[data-edit]"
      );

    if (edit) {
      return openItem(
        edit.dataset.edit
      );
    }

    const deleteButton =
      event.target.closest(
        "[data-delete]"
      );

    if (deleteButton) {
      return deleteItem(
        deleteButton.dataset.delete
      );
    }
  };


/* =========================================
   MARK ITEM BOUGHT
========================================= */

async function toggleItem(
  id,
  completed
) {
  const item =
    items.find(
      item => item.id === id
    );

  if (!item) return;

  item.completed =
    completed;

  renderItems();
  renderProgress();

  const { error } =
    await db
      .from("shopping_items")
      .update({
        completed,
        completed_at:
          completed
            ? new Date().toISOString()
            : null
      })
      .eq("id", id);

  if (error) {
    item.completed =
      !completed;

    renderItems();
    renderProgress();

    toast(
      "Item could not be updated.",
      true
    );
  }
}


/* =========================================
   ADD / EDIT ITEM
========================================= */

function openItem(id = "") {
  const item =
    items.find(
      item => item.id === id
    );

  $("itemForm").reset();

  $("itemId").value =
    item?.id || "";

  $("itemName").value =
    item?.item || "";

  $("itemQuantity").value =
    item?.quantity || "";

  $("itemShop").value =
    item?.shop || "Tesco";

  $("itemCategory").value =
    item?.category ||
    categories[0][0];

  $("itemModalTitle").textContent =
    item
      ? "Edit Shopping Item"
      : "Add Shopping Item";

  openModal("itemModal");
}


$("addItemBtn").onclick =
  () => openItem();


$("itemForm").onsubmit =
  async event => {
    event.preventDefault();

    const id =
      $("itemId").value;

    const category =
      $("itemCategory").value;

    const payload = {
      item:
        $("itemName")
          .value
          .trim(),

      quantity:
        $("itemQuantity")
          .value
          .trim() ||
        null,

      shop:
        $("itemShop").value,

      category,

      category_order:
        categories.findIndex(
          categoryItem =>
            categoryItem[0] ===
            category
        ) + 1
    };

    let response;

    if (id) {
      response =
        await db
          .from("shopping_items")
          .update(payload)
          .eq("id", id);
    } else {
      response =
        await db
          .from("shopping_items")
          .insert({
            ...payload,

            display_order:
              items.filter(
                item =>
                  item.category ===
                  category
              ).length + 1
          });
    }

    if (response.error) {
      toast(
        "Item could not be saved.",
        true
      );

      return;
    }

    closeModal("itemModal");

    await loadItems();

    toast(
      id
        ? "Item updated."
        : "Item added."
    );
  };


/* =========================================
   DELETE ITEM
========================================= */

async function deleteItem(id) {
  const item =
    items.find(
      item => item.id === id
    );

  if (!item) return;

  if (
    !confirm(
      `Delete "${item.item}"?`
    )
  ) {
    return;
  }

  const { error } =
    await db
      .from("shopping_items")
      .delete()
      .eq("id", id);

  if (error) {
    toast(
      "Item could not be deleted.",
      true
    );

    return;
  }

  await loadItems();

  toast("Item deleted.");
}


/* =========================================
   EDIT SHOP ASSIGNMENT
========================================= */

$("shopsGrid").onclick =
  event => {
    const button =
      event.target.closest(
        "[data-shop-edit]"
      );

    if (!button) return;

    const shop =
      shops.find(
        shop =>
          shop.id ===
          button.dataset.shopEdit
      );

    if (!shop) return;

    $("shopId").value =
      shop.id;

    $("shopAssigned").value =
      shop.assigned_to || "";

    $("shopModalTitle").textContent =
      `Assign ${shop.name}`;

    openModal("shopModal");
  };


$("shopForm").onsubmit =
  async event => {
    event.preventDefault();

    const { error } =
      await db
        .from("shopping_shops")
        .update({
          assigned_to:
            $("shopAssigned")
              .value
              .trim() ||
            null
        })
        .eq(
          "id",
          $("shopId").value
        );

    if (error) {
      toast(
        "Assignment could not be saved.",
        true
      );

      return;
    }

    closeModal("shopModal");

    await loadShops();

    toast(
      "Assignment updated."
    );
  };


/* =========================================
   SUBMIT SUGGESTION
========================================= */

$("suggestionForm").onsubmit =
  async event => {
    event.preventDefault();

    const payload = {
      item:
        $("suggestionItem")
          .value
          .trim(),

      quantity:
        $("suggestionQuantity")
          .value
          .trim() ||
        null,

      suggested_by:
        $("suggestionName")
          .value
          .trim(),

      note:
        $("suggestionNote")
          .value
          .trim() ||
        null,

      status: "pending"
    };

    $("submitSuggestion").disabled =
      true;

    const { error } =
      await db
        .from(
          "shopping_suggestions"
        )
        .insert(payload);

    $("submitSuggestion").disabled =
      false;

    if (error) {
      toast(
        "Suggestion could not be submitted.",
        true
      );

      return;
    }

    localStorage.setItem(
      "shoppingSuggestionName",
      payload.suggested_by
    );

    $("suggestionForm").reset();

    $("suggestionName").value =
      payload.suggested_by;

    await loadSuggestions();

    toast(
      "Suggestion added."
    );
  };


/* =========================================
   RENDER SUGGESTIONS
========================================= */

function renderSuggestions() {
  $("suggestionCount").textContent =
    suggestions.length;

  $("suggestionsList").innerHTML =
    suggestions.length
      ? suggestions
          .map(
            suggestion => `
              <article class="suggestion">

                <div class="suggestion-top">

                  <h4>
                    ${esc(suggestion.item)}
                  </h4>

                  <span>
                    ${esc(
                      suggestion.quantity ||
                      ""
                    )}
                  </span>

                </div>

                ${
                  suggestion.note
                    ? `
                      <p class="suggestion-note">
                        “${esc(suggestion.note)}”
                      </p>
                    `
                    : ""
                }

                <div class="suggestion-footer">

                  <div>

                    <span class="suggestion-by">
                      Suggested by
                      ${esc(
                        suggestion.suggested_by
                      )}
                    </span>

                    <span class="suggestion-date">
                      ${
                        new Intl.DateTimeFormat(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        ).format(
                          new Date(
                            suggestion.created_at
                          )
                        )
                      }
                    </span>

                  </div>

                  <div class="suggestion-actions">

                    <button
                      class="suggestion-action"
                      data-add-suggestion="${suggestion.id}"
                      type="button"
                    >
                      + Add
                    </button>

                    <button
                      class="suggestion-action"
                      data-sort="${suggestion.id}"
                      type="button"
                    >
                      Sorted
                    </button>

                    <button
                      class="suggestion-action danger"
                      data-delete-suggestion="${suggestion.id}"
                      type="button"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            `
          )
          .join("")
      : `
        <p class="empty">
          No pending suggestions yet.
        </p>
      `;
}


/* =========================================
   SUGGESTION ACTIONS
========================================= */

$("suggestionsList").onclick =
  async event => {
    const add =
      event.target.closest(
        "[data-add-suggestion]"
      );

    if (add) {
      return openSuggestion(
        add.dataset.addSuggestion
      );
    }

    const sorted =
      event.target.closest(
        "[data-sort]"
      );

    if (sorted) {
      return resolveSuggestion(
        sorted.dataset.sort,
        "sorted"
      );
    }

    const deleteButton =
      event.target.closest(
        "[data-delete-suggestion]"
      );

    if (deleteButton) {
      return deleteSuggestion(
        deleteButton.dataset
          .deleteSuggestion
      );
    }
  };


function openSuggestion(id) {
  const suggestion =
    suggestions.find(
      suggestion =>
        suggestion.id === id
    );

  if (!suggestion) return;

  $("suggestionAddId").value =
    suggestion.id;

  $("suggestionAddItem").value =
    suggestion.item;

  $("suggestionAddQuantity").value =
    suggestion.quantity || "";

  $("suggestionAddShop").value =
    "Tesco";

  $("suggestionAddCategory").value =
    categories[0][0];

  $("suggestionAddTitle").textContent =
    `Add “${suggestion.item}”`;

  openModal(
    "suggestionAddModal"
  );
}


$("suggestionAddForm").onsubmit =
  async event => {
    event.preventDefault();

    const category =
      $("suggestionAddCategory")
        .value;

    const payload = {
      item:
        $("suggestionAddItem")
          .value
          .trim(),

      quantity:
        $("suggestionAddQuantity")
          .value
          .trim() ||
        null,

      shop:
        $("suggestionAddShop")
          .value,

      category,

      category_order:
        categories.findIndex(
          categoryItem =>
            categoryItem[0] ===
            category
        ) + 1,

      display_order:
        items.filter(
          item =>
            item.category ===
            category
        ).length + 1
    };

    const { error } =
      await db
        .from("shopping_items")
        .insert(payload);

    if (error) {
      toast(
        "Suggestion could not be added.",
        true
      );

      return;
    }

    await resolveSuggestion(
      $("suggestionAddId").value,
      "added",
      false
    );

    closeModal(
      "suggestionAddModal"
    );

    await loadItems();

    toast(
      "Suggestion added to the list."
    );
  };


async function resolveSuggestion(
  id,
  status,
  notify = true
) {
  const { error } =
    await db
      .from(
        "shopping_suggestions"
      )
      .update({
        status,
        resolved_at:
          new Date().toISOString()
      })
      .eq("id", id);

  if (error) {
    toast(
      "Suggestion could not be updated.",
      true
    );

    return;
  }

  await loadSuggestions();

  if (notify) {
    toast(
      "Suggestion marked as sorted."
    );
  }
}


async function deleteSuggestion(id) {
  const suggestion =
    suggestions.find(
      suggestion =>
        suggestion.id === id
    );

  if (!suggestion) return;

  if (
    !confirm(
      `Delete "${suggestion.item}"?`
    )
  ) {
    return;
  }

  const { error } =
    await db
      .from(
        "shopping_suggestions"
      )
      .delete()
      .eq("id", id);

  if (error) {
    toast(
      "Suggestion could not be deleted.",
      true
    );

    return;
  }

  await loadSuggestions();

  toast(
    "Suggestion deleted."
  );
}


/* =========================================
   EXPORT SHOPPING LIST TO TXT
========================================= */

const exportTxtBtn =
  $("exportTxtBtn");

if (exportTxtBtn) {
  exportTxtBtn.addEventListener(
    "click",
    exportShoppingList
  );
}


function exportShoppingList() {
  const lines = [];

  lines.push(
    "WILTSHIRE FAMILY STAYCATION"
  );

  lines.push(
    "SHOPPING LIST"
  );

  lines.push(
    "17–21 August 2026"
  );

  lines.push("");
  lines.push(
    "=============================="
  );
  lines.push("");

  categories.forEach(
    ([categoryName]) => {
      const categoryItems =
        items.filter(
          item =>
            item.category ===
            categoryName
        );

      if (
        !categoryItems.length
      ) {
        return;
      }

      lines.push(
        categoryName.toUpperCase()
      );

      lines.push(
        "-".repeat(
          categoryName.length
        )
      );

      categoryItems.forEach(
        item => {
          const status =
            item.completed
              ? "[BOUGHT]"
              : "[ ]";

          const quantity =
            item.quantity
              ? ` — ${item.quantity}`
              : "";

          const shop =
            item.shop
              ? ` (${item.shop})`
              : "";

          lines.push(
            `${status} ${item.item}${quantity}${shop}`
          );
        }
      );

      lines.push("");
    }
  );

  const total =
    items.length;

  const bought =
    items.filter(
      item => item.completed
    ).length;

  lines.push(
    "=============================="
  );

  lines.push(
    `Progress: ${bought} of ${total} items bought`
  );

  const blob =
    new Blob(
      [lines.join("\n")],
      {
        type:
          "text/plain;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "wiltshire-shopping-list.txt";

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

  toast(
    "Shopping list exported."
  );
}


/* =========================================
   MODALS
========================================= */

document.onclick =
  event => {
    const button =
      event.target.closest(
        "[data-close]"
      );

    if (button) {
      closeModal(
        button.dataset.close
      );

      return;
    }

    if (
      event.target.classList.contains(
        "modal"
      )
    ) {
      closeModal(
        event.target.id
      );
    }
  };


document.onkeydown =
  event => {
    if (
      event.key === "Escape"
    ) {
      document
        .querySelectorAll(
          ".modal:not([hidden])"
        )
        .forEach(
          modal =>
            closeModal(
              modal.id
            )
        );
    }
  };


/* =========================================
   REALTIME UPDATES
========================================= */

function setupRealtime() {
  if (channel) return;

  channel =
    db
      .channel(
        "shopping-live"
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "shopping_items"
        },
        loadItems
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "shopping_suggestions"
        },
        loadSuggestions
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table:
            "shopping_shops"
        },
        loadShops
      )

      .subscribe();
}


/* =========================================
   INITIALISE
========================================= */

fillCategories();

$("suggestionName").value =
  localStorage.getItem(
    "shoppingSuggestionName"
  ) || "";

setupShoppingView();

loadAll().catch(error => {
  console.error("Shopping page failed to initialise:", error);
  toast("Some shopping features could not be loaded.", true);
});
