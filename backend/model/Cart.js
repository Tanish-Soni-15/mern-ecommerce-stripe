import mongoose from "mongoose";
const {Schema} = mongoose;


const cartSchema = new Schema({
    
    quantity: { type : Number, required: true},
    product: { type: Schema.Types.ObjectId, ref: "Product" }

})
const virtual  = cartSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
cartSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
})

const  Cart = mongoose.model('cart',cartSchema);
export {Cart};