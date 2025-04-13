import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import walmartLogo from "../../assets/images/quickmart.png";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

const LoginForm = ({ onSave, isLoading, onButtonClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="bg-white h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl">
      <div className=" flex flex-col gap-3 ">
        <Link to="/"> 
          <AspectRatio ratio={16 / 3} className="flex items-center justify-center">
            <img src={walmartLogo} alt="" className="w-28 h-fit " />
          </AspectRatio>
        </Link>
        <h1 className=" text-3xl">Login to your account</h1>
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
          {errors.password && (
            <p className="text-[#E71926]">{errors.password.message}</p>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>
          <div className="flex items-center">
            <div className="flex-1 mr-5 border-t border-[#1E4E38]"></div>
            <div className="text-[#1E4E38]">Don't have an Account?</div>
            <div className="flex-1 ml-5 border-t border-[#1E4E38]"></div>
          </div>
          <Link to={"/sign-up"}>
            <div className="cursor-pointer border-[1px] text-center p-3 text-primary border-primary transition duration-300 ease-in-out transform hover:scale-105 hover:border-[#194A45]">
              Register
            </div>
          </Link>
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={onButtonClick}
              className="hover:text-primary cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
