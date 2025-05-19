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

const formSchema = z.object({
  driver_name: z.string().min(1, "Driver name cannot be empty."),
  driver_photo: z.string().url("Driver photo URL must be a valid URL."),
  vehicle_type: z.string().min(1, "Vehicle type cannot be empty."),
  vehicle_registration_number: z
    .string()
    .min(1, "Vehicle registration number cannot be empty."),
});

const AddLogisticsForm = ({
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
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(img || null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        driver_photo: image || defaultValues.driver_photo,
      });

      if (defaultValues.driver_photo && !image) {
        setImage(defaultValues.driver_photo);
      }
    }
  }, [defaultValues, image, reset]);

  const onSave = (data) => {
    const formData = { ...data, driver_photo: image || data.driver_photo };
    console.log("FormData:", formData);
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      handleImageSubmit(selectedFiles[0]);
    }
  };

  const handleImageSubmit = async (file) => {
    if (file) {
      setUploading(true);
      try {
        const downloadURL = await storeImage(file);
        setImage(downloadURL);
        setValue("driver_photo", downloadURL);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Failed to upload image.");
      } finally {
        setUploading(false);
        setFiles([]);
      }
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
          setUploadProgress({ [file.name]: progress });
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const getButtonText = () => {
    if (uploading) {
      const totalProgress = Object.values(uploadProgress).reduce(
        (acc, progress) => acc + progress,
        0
      );
      return `Uploading ${Math.round(totalProgress)}%`;
    }
    return `Add Photo`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="min-h-fit bg-background flex gap-4 justify-center p-4 rounded-lg h-fit border border-slate-300 m-2"
    >
      <div className="flex flex-col items-left w-full bg-white">
        <div className="bg-white m-1 p-3 rounded-lg w-full h-fit border-[0.5px] shadow-sm border-slate-200">
          <h1 className="font-semibold text-md w-full border-slate-100">
            General Information
          </h1>
          <div className="mt-2">
            <label
              htmlFor="driver_name"
              className="block text-sm text-gray-500"
            >
              Driver Name
            </label>
            <input
              id="driver_name"
              type="text"
              {...register("driver_name")}
              placeholder="Enter Driver Name"
              className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
            />
            {errors.driver_name && (
              <span className="text-red-500 font-bold text-sm">
                {errors.driver_name.message}
              </span>
            )}
          </div>
          <div className="mt-2">
            <label
              htmlFor="vehicle_type"
              className="block text-sm text-gray-500"
            >
              Vehicle Type
            </label>
            <input
              id="vehicle_type"
              type="text"
              {...register("vehicle_type")}
              placeholder="Enter Vehicle Type"
              className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
            />
            {errors.vehicle_type && (
              <span className="text-red-500 font-bold text-sm">
                {errors.vehicle_type.message}
              </span>
            )}
          </div>
          <div className="mt-2">
            <label
              htmlFor="vehicle_registration_number"
              className="block text-sm text-gray-500"
            >
              Vehicle Registration Number
            </label>
            <input
              id="vehicle_registration_number"
              type="text"
              {...register("vehicle_registration_number")}
              placeholder="Enter Vehicle Registration Number"
              className="w-full border text-sm outline-none focus:outline-none py-1 px-2 rounded-md bg-slate-100"
            />
            {errors.vehicle_registration_number && (
              <span className="text-red-500 font-bold text-sm">
                {errors.vehicle_registration_number.message}
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-fit">
          <div className="flex flex-col items-center bg-white m-1 rounded-lg gap-2 border shadow-sm p-2 border-slate-200">
            <h1 className="font-semibold text-md w-full self-start border-slate-200">
              Driver Photo
            </h1>
            <input
              onChange={handleFileChange}
              className="w-full hidden"
              type="file"
              id="driver_photo"
              accept="image/*"
            />
            {errors.driver_photo && (
              <span className="text-red-300">
                {errors.driver_photo.message}
              </span>
            )}
            <p className="w-full text-sm text-slate-500">Upload Driver Photo</p>
            <div className="w-full border-dashed bg-slate-100 border-2 border-slate-300">
              <div className="flex flex-wrap justify-start w-full">
                {image && (
                  <img
                    src={image}
                    className="rounded-lg w-[120px] h-[120px] object-cover m-2"
                    alt="Driver"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("driver_photo").click()}
                className="flex flex-row justify-center align-center text-sm mx-auto bg-slate-200 text-primary border border-primary p-2 rounded-lg my-4 focus:scale-95 hover:opacity-90"
              >
                <Upload size={16} />
                <span className="ml-2 font-medium capitalize">
                  {getButtonText()}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-lg my-2 block focus:scale-95 hover:opacity-95 shadow-md"
          >
            {isLoading ? <Loader /> : action}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddLogisticsForm;
