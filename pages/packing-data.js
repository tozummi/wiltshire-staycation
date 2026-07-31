const PACKING_TEMPLATES = {
  men: {
    title: "Men’s Packing List",
    icon: "🧔🏻‍♂️",
    label: "Personal checklist",
    introduction: "A complete checklist for clothing, toiletries, essentials, accessories and shared extras.",
    categories: [
      {
        name: "Clothing",
        icon: "👕",
        items: [
          "Underwear sets x 7",
          "Socks x 5",
          "Pyjama socks x 3",
          "Pyjamas x 2",
          "Sliders/slippers (to wear in the house)",
          "Trousers or shorts x 3",
          "Tops x 4",
          "Belt"
        ]
      },
      {
        name: "Toiletries",
        icon: "🧴",
        items: [
          "Flannel/Gloves",
          "Shower gel & Shampoo",
          "Toothbrush",
          "Glasses/Contact Lenses",
          "Any personal medication",
          "Hay-fever medicine",
          "Anti-perspirant",
          "Comb",
          "Skincare",
          "Cotton buds",
          "Nail cutter",
          "Moisturiser",
          "Laundry bag (for dirty clothes)"
        ]
      },
      {
        name: "Essentials",
        icon: "📱",
        items: [
          "Phone/console",
          "Phone/console charger",
          "Wallet",
          "Driving licence",
          "Keys",
          "Gum",
          "Snacks (for the journey)"
        ]
      },
      {
        name: "Accessories",
        icon: "🎧",
        items: [
          "Jacket (worn on the journey there)",
          "Sun hat",
          "Sunglasses",
          "Fan",
          "Power bank",
          "Earphones/headphones",
          "Water bottle",
          "Prayer mat"
        ]
      },
      {
        name: "Shared Extras",
        icon: "🧺",
        note: "Only one person per house needs to bring each of these, as they can be shared.",
        items: [
          "Toothpaste",
          "Insect repellent",
          "Sun cream",
          "Med kit",
          "Ibuprofen",
          "Paracetamol",
          "Imodium"
        ]
      }
    ]
  },

  women: {
    title: "Women’s Packing List",
    icon: "🧕🏾",
    label: "Personal checklist",
    introduction: "A complete checklist for clothing, toiletries, essentials, accessories and shared extras.",
    categories: [
      {
        name: "Clothing",
        icon: "👗",
        items: [
          "Underwear sets x 7",
          "Socks x 5",
          "Pyjama socks x 3",
          "Pyjamas or Nightdress x 2",
          "Sliders/slippers (to wear in the house)",
          "Trousers / Skirt / Leggings x 3",
          "Tops or Dress x 3",
          "Hijab + Pins/magnets",
          "Hijab cap",
          "Prayer abaya",
          "Belt"
        ]
      },
      {
        name: "Toiletries",
        icon: "🧴",
        items: [
          "Flannel/Gloves",
          "Shower gel & Shampoo",
          "Toothbrush",
          "Glasses/Contact Lenses",
          "Any personal medication",
          "Hay-fever medicine",
          "Anti-perspirant",
          "Brush and any Hair products",
          "Hairbands & Jewellery (like earrings)",
          "Makeup & Skincare",
          "Cotton buds",
          "Nail cutter",
          "Moisturiser",
          "Laundry bag (for dirty clothes)",
          "Sanitary towels",
          "Pain reliefs"
        ]
      },
      {
        name: "Essentials",
        icon: "📱",
        items: [
          "Phone",
          "Phone charger",
          "Purse",
          "Driving licence",
          "Keys",
          "Gum",
          "Snacks (for the journey)"
        ]
      },
      {
        name: "Accessories",
        icon: "🎧",
        items: [
          "Jacket (worn on the journey there)",
          "Sun hat",
          "Sunglasses",
          "Fan",
          "Power bank",
          "Earphones/headphones",
          "Water bottle",
          "Prayer mat"
        ]
      },
      {
        name: "Shared Extras",
        icon: "🧺",
        note: "Only one person per house needs to bring each of these, as they can be shared.",
        items: [
          "Toothpaste",
          "Insect repellent",
          "Sun cream",
          "Med kit",
          "Ibuprofen",
          "Paracetamol",
          "Imodium"
        ]
      }
    ]
  },

  babies: {
    title: "Babies’ & Children’s Packing List",
    icon: "👶🏽",
    label: "Little ones’ checklist",
    introduction: "Feeding, clothing, toiletries, travel equipment, entertainment and food for babies and children.",
    categories: [
      {
        name: "Essentials",
        icon: "🍼",
        items: [
          "Baby/Toddler cup",
          "Food aprons/Bibs",
          "Silicone spoons/cutlery",
          "Sponge",
          "Bottle brush/Straw cleaner",
          "Beaker",
          "Bottle",
          "Sterilising equipment",
          "Blanket x 2"
        ]
      },
      {
        name: "Clothing",
        icon: "👕",
        items: [
          "Children’s clothes hangers",
          "10 vests",
          "5 socks",
          "7 outfits",
          "5 pyjamas",
          "1 swimming set (for paddling pool)",
          "Swim nappies (for paddling pool)",
          "Swim hat",
          "12 Bibs",
          "Jacket",
          "Cardigan",
          "12 muslins",
          "Sunhats",
          "Sunglasses",
          "Shoes",
          "Dirty clothes bag"
        ]
      },
      {
        name: "Accessories",
        icon: "🎒",
        items: [
          "Stroller Bag/Changing bag",
          "Pushchair clips",
          "Cupholder",
          "Fan"
        ]
      },
      {
        name: "Toiletries",
        icon: "🛁",
        items: [
          "Changing mat",
          "Suncream",
          "Moisturiser",
          "Shampoo",
          "Bodywash",
          "Flannel",
          "Towel x 2",
          "Non slip mat",
          "Baby bathtub/seat",
          "Bath toys",
          "Bath thermometer",
          "Vaseline",
          "Sudo cream",
          "Nappies",
          "Nappy bags",
          "Wipes x 3",
          "Cotton pads",
          "Swim nappies",
          "Nail trimmer",
          "Snot sucker",
          "Saline spray",
          "Hairbrush",
          "Stick thermometer"
        ]
      },
      {
        name: "Amenities",
        icon: "🛏️",
        items: [
          "Pushchair + Raincover (pushchair fan, cupholder)",
          "Hip seat carrier",
          "Highchair seat",
          "Bed rail",
          "Some toys",
          "Stationery & paper",
          "Tablet",
          "Storybooks",
          "Carseat and isofix",
          "Small peg hanger",
          "Night light",
          "White noise machine"
        ]
      },
      {
        name: "Food",
        icon: "🥣",
        items: [
          "Snacks",
          "Yogurts",
          "Jars/pouches",
          "Home cooked baby food"
        ]
      }
    ]
  }
};

const HOUSEHOLD_TEMPLATE = {
  title: "Shared Household Packing List",
  icon: "🏠",
  label: "Live family checklist",
  introduction: "A shared checklist for household supplies, appliances and activities. Everyone sees the same updates.",
  categories: [
    {
      name: "Kitchen & Cleaning",
      icon: "🧽",
      items: [
        "Kitchen Tissue",
        "Nose tissue",
        "Fairy Liquid",
        "Washing up sponge",
        "Wiping cloth",
        "Multipurpose spray",
        "Pegs",
        "Soap powder",
        "Fly swatter"
      ]
    },
    {
      name: "Bathroom",
      icon: "🛁",
      items: [
        "Bathroom cloth",
        "Bathroom jug",
        "Toilet Rolls",
        "Bodna",
        "Bathroom Spray",
        "Toilet Bleach",
        "Hand wash",
        "Anti Bac Wipes"
      ]
    },
    {
      name: "Appliances & Electronics",
      icon: "🔌",
      items: [
        "Air fryer",
        "Rice cooker + spoon",
        "Extension plugs",
        "Firestick/Nvidia Shield"
      ]
    },
    {
      name: "Household Essentials",
      icon: "🏡",
      items: [
        "Bin bags",
        "Picnic blanket"
      ]
    },
    {
      name: "Games & Activities",
      icon: "🏸",
      items: [
        "Badminton",
        "Football",
        "Paddling pool",
        "Bubble machine",
        "Water guns",
        "Board games"
      ]
    }
  ]
};
