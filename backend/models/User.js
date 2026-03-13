const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema(
  {
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
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
)

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
      name: String,
      phone: String,
      block: String,
      floor: Number,
      room: Number
    }
  },
  {
    _id: true,
    timestamps: true
  }
)

const cartItemSchema = new mongoose.Schema(
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

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim: true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  password:{
    type:String,
    required:true
  },
  passwordResetCodeHash: {
    type: String,
    default: null
  },
  passwordResetExpiresAt: {
    type: Date,
    default: null
  },
  addresses: {
    type: [addressSchema],
    default: []
  },
  cart: {
    type: [cartItemSchema],
    default: []
  },
  orders: {
    type: [orderSchema],
    default: []
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("User", userSchema)
