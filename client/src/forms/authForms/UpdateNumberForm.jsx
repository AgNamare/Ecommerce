import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import walmartLogo from "../../assets/images/quickmart.png";
import { X } from "lucide-react";
import Loader from "@/components/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address."),
});

const ChangeEmailForm = ({
  onSave,
  isLoading,
  fName,
  lName,
  onButtonClick,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl">
      <div className="flex justify-end">
        <button className="cursor-pointer" onClick={onButtonClick}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <img src={walmartLogo} alt="" className="w-28 h-fit " />
        <h1 className="text-3xl">Change Email</h1>
        <p>Update your Email</p>
        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(onSave)}
        >
          <div className="flex">
            <input
              {...register("email")}
              type="email"
              name="email"
              placeholder="Email Address"
              className={`w-full border-b pb-5 outline-none focus:outline-none border-[#194A3491]`}
            />
          </div>
          {errors.email && (
            <p className="text-[#E71926]">{errors.email.message}</p>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Update Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeEmailForm;
