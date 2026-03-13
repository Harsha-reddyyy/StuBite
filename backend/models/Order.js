const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String
    }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "UPI"],
      default: "Cash on Delivery"
    },
    status: {
      type: String,
      default: "Placed"
    },
    deliveredTo: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      block: {
        type: String,
        required: true
      },
      floor: {
        type: Number,
        required: true
      },
      room: {
        type: Number,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
)

orderSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model("Order", orderSchema)
