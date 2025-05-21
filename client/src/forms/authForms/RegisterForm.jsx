import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import walmartLogo from "../../assets/images/quickmart.png";
import { Link } from "react-router-dom";
import { months } from "@/utils/utils";
import Loader from "@/components/Loader";
import { Eye, EyeOff } from "lucide-react"; // Import the eye icons
import { useState } from "react";

const GenderEnum = z.enum(["Male", "Female"]);

const formSchema = z.object({
  gender: GenderEnum,
  email: z.string().email("Please enter a valid email address."),
  fName: z.string(),
  lName: z.string().min(1, "Last name cannot be empty."),
  phoneNumber: z
    .string()
    .regex(/^\d{9}$/, "Please enter a valid phone number."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine((val) => {
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      return hasUpper && hasLower && hasNumber;
    }, "Password must have at least one uppercase letter, one lowercase letter, and one number."),
  date: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
  toReceiveOffers: z.boolean(),
  agreeTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions.",
    path: ["agreeTerms"],
  }),
});

const RegisterForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "",
      email: "",
      fName: "",
      lName: "",
      phoneNumber: "",
      password: "",
      date: "",
      month: "",
      year: "",
      toReceiveOffers: false,
      agreeTerms: false,
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const agreeTerms = useWatch({
    name: "agreeTerms",
    defaultValue: false,
    control: control,
  });

  return (
    <div className=" h-fit md:max-w-[500px] w-full p-6 md:p-12 md:border rounded-xl bg-white">
      <div className=" flex flex-col gap-3 ">
        <Link to="/">
          <AspectRatio ratio={16 / 3} className="flex items-center justify-center">
            <img src={walmartLogo} alt="" className="w-28 h-fit " />
          </AspectRatio>
        </Link>
        <h1 className=" text-3xl">Create new account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
          <h3>Title</h3>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <input
                {...register("gender")}
                type="radio"
                name="gender"
                value="Male"
              />
              <label>Mr</label>
            </div>
            <div className="flex gap-1">
              <input
                {...register("gender")}
                type="radio"
                name="gender"
                value="Female"
                className="outline-none focus:outline-none"
              />
              <label>Mrs</label>
            </div>
            <div className="flex gap-1">
              <input
                {...register("gender")}
                type="radio"
                name="gender"
                value="Female"
                className="outline-none focus:outline-none"
              />
              <label>Ms</label>
            </div>
          </div>
          <input
            {...register("fName")}
            type="text"
            name="fName"
            placeholder="First Name"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.fName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.fName && (
            <p className="text-[#E71926]">{errors.fName.message}</p>
          )}
          <input
            {...register("lName")}
            type="text"
            name="lName"
            placeholder="Last Name"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.lName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.lName && (
            <p className="text-[#E71926]">{errors.lName.message}</p>
          )}
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
          <div className="flex">
            <span
              className={`w-[80px] mr-2 border-b outline-none focus:outline-none ${
                errors.phoneNumber ? "border-[#E71926]" : "border-[#194A3491]"
              }`}
            >
              +254
            </span>
            <input
              {...register("phoneNumber")}
              type="number"
              name="phoneNumber"
              placeholder="Phone Number"
              className={`w-full border-b pb-5 outline-none focus:outline-none ${
                errors.phoneNumber ? "border-[#E71926]" : "border-[#194A3491]"
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-[#E71926]">{errors.phoneNumber.message}</p>
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
          <div className="flex flex-col gap-2">
            <h3>Date of Birth (optional)</h3>
            <div className="flex justify-between items-center gap-5">
              <select
                {...register("date")}
                className="outline-none focus:outline-none border border-black w-full py-3"
              >
                <option value="" hidden>
                  Day
                </option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                {...register("month")}
                className="outline-none focus:outline-none border border-black w-full py-3 "
              >
                <option value="" hidden>
                  Month
                </option>
                {Object.entries(months).map(([monthName, monthNumber]) => (
                  <option key={monthNumber} value={monthNumber}>
                    {monthName}
                  </option>
                ))}
              </select>

              <select
                {...register("year")}
                className="outline-none focus:outline-none border border-black py-3 w-full"
              >
                <option value="" hidden>
                  Year
                </option>
                {Array.from({ length: 100 }, (_, i) => (
                  <option key={2024 - i} value={2024 - i}>
                    {2024 - i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              {...register("toReceiveOffers")}
              type="checkbox"
              name="toReceiveOffers"
            />
            <span className="ml-2">
              I would like to receive news and offers from Magunas
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex justify-center items-center gap-1">
              {errors.agreeTerms && (
                <span className="text-[#E71926] bold">*</span>
              )}
              <input {...register("agreeTerms")} type="checkbox" />
            </div>
            <span className="ml-2">
              I agree to the{" "}
              <span style={{ color: "#E71926", opacity: "0.91" }}>
                terms and conditions
              </span>{" "}
              as well as our{" "}
              <span style={{ color: "#E71926", opacity: "0.91" }}>
                Privacy policy
              </span>
            </span>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Create Account"}
          </button>
          <div className="flex items-center">
            <div className="flex-1 mr-5 border-t border-[#1E4E38]"></div>
            <div className="text-[#1E4E38]">Already have an Account?</div>
            <div className="flex-1 ml-5 border-t border-[#1E4E38]"></div>
          </div>
          <Link to={"/sign-in"}>
            <div className="cursor-pointer border-[1px] text-center p-3 text-primary border-primary transition duration-300 ease-in-out transform hover:scale-105 hover:border-[#194A45]">
              LOG IN
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
