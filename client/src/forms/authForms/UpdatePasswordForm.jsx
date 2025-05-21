import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { z } from "zod";
import walmartLogo from "../../assets/images/quickmart.png";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine((val) => {
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      return hasUpper && hasLower && hasNumber;
    }, "Password must have at least one uppercase letter, one lowercase letter, and one number."),
});
const UpdatePasswordForm = ({ onSave, isLoading, onButtonClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl bg-white">
      <div className="flex justify-end">
        <button className="cursor-pointer" onClick={onButtonClick}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <img src={walmartLogo} alt="" className="w-28   h-fit " />
        <h1 className="text-3xl">Update Password</h1>
        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(onSave)}
        >
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"} // Conditional input type
              name="password"
              placeholder="Password"
              className={`w-full border-b pb-5 outline-none focus:outline-none ${
                errors.password ? "border-[#E71926]" : "border-[#194A3491]"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}{" "}
              {/* Eye icon */}
            </button>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
