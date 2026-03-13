const canteens = require("../data/catalog")

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
