const bcrypt = require("bcryptjs")
const Order = require("../models/Order")
const User = require("../models/User")

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
})

const normalizeLegacyOrder = (order, userId) => ({
  _id: order._id,
  user: userId,
  items: order.items || [],
  subtotal: order.subtotal,
  deliveryFee: order.deliveryFee,
  total: order.total,
  paymentMethod: order.paymentMethod,
  status: order.status || "Placed",
  deliveredTo: order.deliveredTo,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt
})

const getUserOrders = async (user) => {
  const persistedOrders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .lean()

  const legacyOrders = Array.isArray(user.orders)
    ? user.orders.map((order) => normalizeLegacyOrder(order, user._id))
    : []

  return [...persistedOrders, ...legacyOrders].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
  )
}

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const orders = await getUserOrders(user)

    res.json({
      user: sanitizeUser(user),
      addresses: user.addresses,
      cart: user.cart,
      orders
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (name) {
      user.name = name
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: sanitizeUser(user)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createAddress = async (req, res) => {
  try {
    const { name, phone, block, floor, room, isDefault } = req.body

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (isDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false
      })
    }

    user.addresses.push({
      name,
      phone,
      block,
      floor,
      room,
      isDefault: Boolean(isDefault)
    })

    await user.save()

    res.status(201).json({
      message: "Address saved successfully",
      addresses: user.addresses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params
    const { name, phone, block, floor, room, isDefault } = req.body

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    if (typeof isDefault === "boolean" && isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false
      })
    }

    address.name = name
    address.phone = phone
    address.block = block
    address.floor = floor
    address.room = room
    address.isDefault = Boolean(isDefault)

    await user.save()

    res.json({
      message: "Address updated successfully",
      addresses: user.addresses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    address.deleteOne()
    await user.save()

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    let found = false

    user.addresses.forEach((address) => {
      const isMatch = address._id.toString() === addressId
      address.isDefault = isMatch
      if (isMatch) {
        found = true
      }
    })

    if (!found) {
      return res.status(404).json({ message: "Address not found" })
    }

    await user.save()

    res.json({
      message: "Default address updated",
      addresses: user.addresses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.clearDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    address.isDefault = false
    await user.save()

    res.json({
      message: "Default address removed",
      addresses: user.addresses
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total, paymentMethod, addressId } = req.body

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const address = user.addresses.id(addressId)

    if (!address) {
      return res.status(400).json({ message: "Delivery address not found" })
    }

    const order = await Order.create({
      user: user._id,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      deliveredTo: {
        name: address.name,
        phone: address.phone,
        block: address.block,
        floor: address.floor,
        room: address.room
      }
    })

    user.cart = []

    await user.save()

    res.status(201).json({
      message: "Order placed successfully",
      order
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("orders")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const orders = await getUserOrders(user)

    res.json({ orders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("cart")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ cart: user.cart || [] })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.replaceCart = async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Cart items must be an array" })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.cart = items
    await user.save()

    res.json({
      message: "Cart updated successfully",
      cart: user.cart
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
