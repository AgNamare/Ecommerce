import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    path: { type: [mongoose.Schema.Types.ObjectId], ref: "Category" },
    imageUrl: String,
    bannerImageUrl: String,
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
