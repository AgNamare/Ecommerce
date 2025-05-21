import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import walmartLogo from "../assets/images/quickmart.png"; //
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

const AdminLoginForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="bg-white h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl">
      <div className="flex flex-col gap-3">
        <img src={walmartLogo} alt="Logo" className="w-32 h-fit mx-auto" />
        <h1 className="text-3xl">Admin Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
          <input
            {...register("email")}
            type="text"
            name="email"
            placeholder="Enter Email Address"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.email ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.email && (
            <p className="text-[#E71926]">{errors.email.message}</p>
          )}
          <input
            {...register("password")}
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.password ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.password && (
            <p className="text-[#E71926]">{errors.password.message}</p>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-[#194A34] flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-[#1F4F38] ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer"
            }`}
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
