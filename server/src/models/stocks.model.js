import mongoose from "mongoose";

const stockLevel = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  stockLevel: {
    type: Number,
    default: 0,
  },
  SKU:{
    type:String,
    required:true
  }
});

const Stock = mongoose.model('Stock', stockLevel);

export default Stock
