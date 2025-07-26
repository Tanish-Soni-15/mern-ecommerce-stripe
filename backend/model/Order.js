import mongoose from "mongoose";
const { Schema } = mongoose;


const orderSchema = new Schema({
  id: {
    type: String,
   
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled','processing'],
    default: 'processing'
  },
  total: {
    type: Number,
    required: true
  },
  items:{ type: [Schema.Types.Mixed], required: true },
  shippingAddress: { type: Schema.Types.Mixed, required: true },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
   user: { type: Schema.Types.ObjectId, ref: "User" },
});



const Order = mongoose.model('order', orderSchema);
export { Order };