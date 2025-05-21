import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../config/firebase";
import { Upload } from "lucide-react";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { useGetCategories } from "@/api/CategoryApi";

const formSchema = z.object({
  productName: z.string().min(1, "Name cannot be empty."),
  price: z.coerce.number(),
  discountPrice: z.coerce.number(),
  SKU: z.string().min(1, "SKU cannot be empty."),
  description: z.string(),
  measurementUnit: z.string().min(1, "Measurement Unit cannot be empty."),
  size: z.coerce.number(),
  stockLevel: z.coerce.number().optional(),
  brand: z.string().min(1, "Brand cannot be empty."),
  category: z.string().min(1, "Category cannot be empty."),
});

const AddProductForm = ({
  onSubmit,
  action,
  isLoading,
  defaultValues,
  img,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });
  console.log(errors);

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategories();

  console.log(categories);

  // Update form values whenever defaultValues change
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const onSave = (data) => {
    console.log("Form Data: ", data);
    console.log(data);
    const formData = { ...data, images };
    console.log("FormData:", formData); // Debugging
    onSubmit(formData);
    setImages([]);
  };

  useEffect(() => {
    setImages(img || []);
  }, [img]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      handleImageSubmit(selectedFiles);
    }
  };

  const handleImageSubmit = async (selectedFiles) => {
    if (selectedFiles.length + images.length <= 5) {
      setUploading(true);
      const promises = selectedFiles.map((file) => storeImage(file));
      await Promise.all(promises);
      setFiles([]);
      setUploading(false);
    } else {
      toast.error("You can only upload a maximum of 5 images.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImages((prevImages) => [...prevImages, downloadURL]);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  if (categoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError) return <div>Error loading categories</div>;

  const getButtonText = () => {
    if (uploading) {
      const filesCount = Object.keys(uploadProgress).length;
      const totalProgress = Object.values(uploadProgress).reduce(
        (acc, progress) => acc + progress,
        0
      );
      return `Uploading ${Math.round(totalProgress / filesCount)}%`;
    }
    return `Add Images`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="min-h-fit  flex gap-4 justify-center p-4 rounded-lg h-fit border border-slate-300 m-2"
    >
      {/* Form Fields */}
      <div className="flex flex-col items-left w-full bg-white">
        {/* General Information Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200">
          <h1 className="font-semibold text-md w-full border-slate-100">
            General Information
          </h1>
          <div className="mt-2">
            <label
              htmlFor="productName"
              className="block text-sm text-gray-500"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              {...register("productName")}
              placeholder="Enter Product Name"
              className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
            />
            {errors.productName && (
              <span className="text-red-500 font-bold text-sm">
                {errors.productName.message}
              </span>
            )}
          </div>
          <div className="mt-2">
            <label
              htmlFor="description"
              className="block capitalize text-sm text-gray-500"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              placeholder="Description"
              className="w-full text-sm bg-gray-100 border outline-none focus:outline-none p-2 rounded-md"
            ></textarea>
            {errors.description && (
              <span className="text-red-500 font-bold text-sm">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Discounts Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200 mt-4">
          <h1 className="font-semibold text-md w-full border-slate-100">
            Pricing and Discounts
          </h1>
          <div className="flex flex-row items-center justify-between gap-2 mt-1">
            <div className="w-1/2">
              <label
                htmlFor="price"
                className="block capitalize text-sm text-gray-500"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                {...register("price")}
                placeholder="Price"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
              {errors.price && (
                <span className="text-red-500 font-bold text-sm">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="discount"
                className="block capitalize text-sm text-gray-500"
              >
                Discount Price
              </label>
              <input
                id="discount"
                type="number"
                {...register("discountPrice")}
                placeholder="Discount Price"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-md border-slate-200 mt-4">
          <h1 className="font-semibold text-md w-full border-slate-100">
            Product Details
          </h1>
          <div className="flex flex-row items-center justify-between gap-2 mt-2">
            <div className="w-full">
              <label htmlFor="brand" className="block text-sm text-slate-500">
                Brand
              </label>
              <input
                id="brand"
                type="text"
                {...register("brand")}
                placeholder="Brand"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
              {errors.brand && (
                <span className="text-red-500 font-bold text-sm">
                  {errors.brand.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-3 mt-2">
            <div className="w-1/2">
              <label
                htmlFor="size"
                className="block capitalize text-sm text-slate-500"
              >
                Size
              </label>
              <input
                id="size"
                type="number"
                {...register("size")}
                placeholder="Size"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
              {errors.size && (
                <span className="text-red-500 font-bold text-sm">
                  {errors.size.message}
                </span>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="measurementUnit"
                className="block text-sm text-slate-500"
              >
                Measurement Unit
              </label>
              <input
                id="measurementUnit"
                type="text"
                {...register("measurementUnit")}
                placeholder="Measurement Unit"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
              {errors.measurementUnit && (
                <span className="text-red-500 font-bold text-sm">
                  {errors.measurementUnit.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="w-full h-fit">
        <div className="flex flex-col items-center bg-white m-1 rounded-lg gap-2 border shadow-sm p-2 border-slate-200">
          <h1 className="font-semibold text-md w-full self-start border-slate-200">
            Product Media
          </h1>
          <input
            onChange={handleFileChange}
            className="w-full hidden"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          {errors.images && <span>{errors.images.message}</span>}
          <p className="w-full text-sm text-slate-500">Photo Product</p>
          <div className="w-full border-dashed bg-slate-100 border-2 border-slate-300">
            <div className="flex flex-wrap justify-start w-full">
              {images &&
                images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    className="rounded-lg w-[120px] h-[120px] object-cover m-2"
                    alt="Product"
                  />
                ))}
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("images").click()}
              className="flex flex-row justify-center align-center text-sm mx-auto bg-slate-200 text-primary border border-primary p-2 rounded-lg my-4 focus:scale-95 hover:opacity-90"
            >
              <Upload size={16} />
              <span className="ml-2 font-medium capitalize">
                {getButtonText()}
              </span>
            </button>
          </div>
        </div>

        {/* Category Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-md border-slate-200 mt-4">
          <h1 className="font-semibold text-md w-full border-slate-100">
            Category
          </h1>
          <div className="mt-2">
            <label htmlFor="category" className="block text-sm text-gray-500">
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className="w-full rounded-md border px-2 py-1 text-sm outline-none focus:outline-none bg-slate-100"
            >
              <option value="">Select Category</option>
              {categories &&
                categories
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort categories alphabetically
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
            </select>
            {errors.category && (
              <span className="text-red-500 font-bold text-sm">
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        {/* Inventory Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-md border-slate-200 mt-4">
          <h1 className="font-semibold text-md w-full border-slate-100">
            Inventory
          </h1>
          <div className="mt-2 flex gap-4">
            <div className="w-full flex-1">
              <label
                htmlFor="SKU"
                className="block capitalize text-sm text-slate-500"
              >
                SKU (Stock Keeping Unit)
              </label>
              <input
                id="SKU"
                type="text"
                {...register("SKU")}
                placeholder="SKU"
                className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
              />
              {errors.SKU && (
                <span className="text-red-500 font-bold text-sm">
                  {errors.SKU.message}
                </span>
              )}
            </div>
            {action === "Update" && (
              <div className="w-full flex-1">
                <label
                  htmlFor="stockLevel"
                  className="block capitalize text-sm text-gray-500"
                >
                  Stock Level
                </label>
                <input
                  id="stockLevel"
                  type="number"
                  {...register("stockLevel")}
                  placeholder="Stock Level"
                  className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
                />
                {errors.stockLevel && (
                  <span className="text-red-500 font-bold text-sm">
                    {errors.stockLevel.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white p-3 rounded-lg my-2 block focus:scale-95 hover:opacity-95 shadow-md"
          >
            {isLoading ? <Loader /> : action}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
