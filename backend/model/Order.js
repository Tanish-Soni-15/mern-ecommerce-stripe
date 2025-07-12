import mongoose from "mongoose";
const { Schema } = mongoose;


const orderSchema = new Schema({
    totalAmount: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [Schema.Types.Mixed], required: true },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    status: { type: String, default: "pending" },
})
const virtual = orderSchema.virtual('id');
virtual.get(function () {
    return this._id;
})
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})

const Order = mongoose.model('order', orderSchema);
export { Order };