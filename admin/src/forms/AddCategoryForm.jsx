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

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Name cannot be empty."),
  description: z.string().optional(),
  parent: z.string().optional(),
  imageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(), // Added banner image field
});

const AddCategoryForm = ({
  onSubmit,
  action,
  isLoading,
  defaultValues,
  img,
  bannerImg, // New banner image prop
  categoryPath = [],
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

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategories();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSave = (data) => {
    const formData = {
      ...data,
      imageUrl: image,
      bannerImageUrl: bannerImage, // Save banner image URL
    };
    if (!formData.parent) {
      delete formData.parent;
    }
    if (!formData.imageUrl) {
      delete formData.imageUrl;
    }
    if (!formData.bannerImageUrl) {
      delete formData.bannerImageUrl;
    }
    if (!formData.description) {
      delete formData.description;
    }

    onSubmit(formData);
  };

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null); // State for banner image
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImage(img || null);
    setBannerImage(bannerImg || null); // Set initial banner image
  }, [img, bannerImg]);

  const handleFileChange = (e, setImageState) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleImageSubmit(selectedFile, setImageState);
    }
  };

  const handleImageSubmit = async (selectedFile, setImageState) => {
    setUploading(true);
    await storeImage(selectedFile, setImageState);
    setFile(null);
    setUploading(false);
  };

  const storeImage = async (file, setImageState) => {
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
            setImageState(downloadURL); // Set either category or banner image
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const getButtonText = () => {
    if (uploading) {
      const filesCount = Object.keys(uploadProgress).length;
      const totalProgress = Object.values(uploadProgress).reduce(
        (acc, progress) => acc + progress,
        0
      );
      return `Uploading ${Math.round(totalProgress / filesCount)}%`;
    }
    return `Add Image`;
  };

  const formattedCategoryPath = categoryPath
    .map((category) => category.name)
    .join(" > ");

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="min-h-fit bg-background flex gap-4 justify-center p-4 rounded-lg h-fit border border-slate-300 m-2"
    >
      {/* Form Fields */}
      <div className="flex flex-col items-left w-full rounded-lg bg-white">
        {/* General Information Section */}
        <div className="bg-white  p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200">
          <h1 className="font-semibold text-md w-full border-slate-100">
            General Information
          </h1>
          <div className="mt-2">
            <label htmlFor="name" className="block text-sm text-gray-500">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter Category Name"
              className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
            />
            {errors.name && (
              <span className="text-red-500 font-bold text-sm">
                {errors.name.message}
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

        {/* Parent Category Section */}
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200 mt-4">
          <h1 className="font-semibold text-md w-full border-slate-100">
            Parent Category
          </h1>
          <div className="mt-2">
            <label htmlFor="parent" className="block text-sm text-gray-500">
              Parent Category
            </label>
            <select
              id="parent"
              {...register("parent")}
              className="w-full rounded-md border px-2 py-1 text-sm outline-none focus:outline-none bg-slate-100"
            >
              <option value="">Select Parent Category</option>
              {categories &&
                categories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
            </select>
            {errors.parent && (
              <span className="text-red-500 font-bold text-sm">
                {errors.parent.message}
              </span>
            )}
          </div>
        </div>

        {/* Category Path Section */}
        {categoryPath.length > 0 && (
          <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200 mt-4">
            <h1 className="font-semibold text-md w-full border-slate-100">
              Category Path
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {formattedCategoryPath}
            </p>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="w-full h-fit">
          <div className="flex flex-col items-center bg-white m-1 rounded-lg gap-2 border shadow-sm p-2 border-slate-200">
            <h1 className="font-semibold text-md w-full self-start border-slate-200">
              Category Image
            </h1>
            <input
              onChange={(e) => handleFileChange(e, setImage)}
              className="w-full hidden"
              type="file"
              id="image"
              accept="image/*"
            />
            <p className="w-full text-sm text-slate-500">
              Upload Category Image
            </p>
            <div className="w-full border-dashed bg-slate-100 border-2 border-slate-300">
              <div className="flex flex-wrap justify-start w-full">
                {image && (
                  <img
                    src={image}
                    className="rounded-lg w-[120px] h-[120px] object-cover m-2"
                    alt="Category"
                  />
                )}
              </div>
            </div>
            <label
              htmlFor="image"
              className="px-3 flex w-fit py-2 items-center gap-2 border-2 border-black rounded-lg text-sm hover:bg-slate-200 cursor-pointer"
            >
              <Upload size={16} /> {getButtonText()}
            </label>
          </div>
        </div>

        {/* Banner Image Upload Section */}
        <div className="w-full h-fit">
          <div className="flex flex-col items-center bg-white m-1 rounded-lg gap-2 border shadow-sm p-2 border-slate-200">
            <h1 className="font-semibold text-md w-full self-start border-slate-200">
              Banner Image
            </h1>
            <input
              onChange={(e) => handleFileChange(e, setBannerImage)}
              className="w-full hidden"
              type="file"
              id="bannerImage"
              accept="image/*"
            />
            <p className="w-full text-sm text-slate-500">Upload Banner Image</p>
            <div className="w-full border-dashed bg-slate-100 border-2 border-slate-300">
              <div className="flex flex-wrap justify-start w-full">
                {bannerImage && (
                  <img
                    src={bannerImage}
                    className="rounded-lg w-full h-[120px] object-cover m-2"
                    alt="Banner"
                  />
                )}
              </div>
            </div>

            <label
              htmlFor="bannerImage"
              className="px-3 flex w-fit py-2 items-center gap-2 border-2 border-black rounded-lg text-sm hover:bg-slate-200 cursor-pointer"
            >
              <Upload size={16} /> {getButtonText()}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center mt-3">
          <button
            className="bg-primary text-white p-3 rounded-lg my-2 block focus:scale-95 hover:opacity-95 shadow-md"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="text-white" />{" "}
                <span>{action}</span>
              </>
            ) : (
              <span>{action}</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCategoryForm;
