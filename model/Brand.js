import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String,required:true ,default:"brand"},
    profileImage:{type: String,default:""},
    category:{type:Array,default:[]},
    location:{type:String,default:""},
    description:{type:String,default:""},
    rating:{type:Number,default:0},
    reviews:{type:Array,default:[]},
}, { timestamps: true });

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema)