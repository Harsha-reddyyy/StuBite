const canteens = require("../data/catalog")

// The homepage only needs summary fields, so we trim the payload here instead of sending full menus.
exports.getCanteens = (req, res) => {
  res.json({
    canteens: canteens.map(({ slug, name, description, image }) => ({
      slug,
      name,
      description,
      image
    }))
  })
}

// Menu lookup stays slug-based so the frontend can keep clean, readable URLs.
exports.getCanteenMenu = (req, res) => {
  const canteen = canteens.find((item) => item.slug === req.params.canteenSlug)

  if (!canteen) {
    return res.status(404).json({ message: "Canteen not found" })
  }

  res.json({
    canteen: {
      slug: canteen.slug,
      name: canteen.name,
      description: canteen.description,
      image: canteen.image
    },
    items: canteen.items
  })
}
