import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import walmartLogo from "../../assets/images/quickmart.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/Loader";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const ConfirmEmailForm = ({ onSave, isLoading, onButtonClick }) => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl bg-white">
      <div className="flex justify-end">
        <button className="cursor-pointer" onClick={onButtonClick}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <img src={walmartLogo} alt="" className="w-28" />
        <h1 className="text-3xl">Forgot Password</h1>
        <p>Enter your email address to reset your password</p>

        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(onSave)}
        >
          <input
            {...register("email")}
            type="email"
            name="email"
            placeholder="Email Address"
            className={`border-b pb-5 outline-none focus:outline-none w-full "border-[#194A3491]"}
            `}
          />

          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmailForm;
