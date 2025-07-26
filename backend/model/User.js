import mongoose from "mongoose";

const {Schema}=mongoose;
const userSchema = new Schema({
    email: { type : String, required: true, unique: true},
    password: { type : String, required: true},
    name:{type:String,required:true},
    isVerified:{type:String,default:false}
    
})
userSchema.virtual("id").get(function () {
    return this._id.toHexString(); 
});

userSchema.set("toJSON", {
    virtuals: true, 
    versionKey: false,
    getters: true, // Important to include virtuals
    transform: function (doc, ret) {
        delete ret._id; // Remove _id to avoid duplication
    }
});

const  User = mongoose.model('User',userSchema);
export {User};