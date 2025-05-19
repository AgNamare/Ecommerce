import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import adminLogo from "../assets/images/quickmart.png"; // Update with your admin logo
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

const RoleEnum = z.enum(["superadmin", "admin"]);

const formSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty."),
  lastName: z.string().min(1, "Last name cannot be empty."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine((val) => {
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      return hasUpper && hasLower && hasNumber;
    }, "Password must have at least one uppercase letter, one lowercase letter, and one number."),
  phone: z.string().regex(/^\d{9}$/, "Please enter a valid phone number."),
  role: RoleEnum,
  branch: z.string().nullable(), // Added branch validation
});

const AdminRegisterForm = ({ onSave, isLoading, branches: propBranches }) => {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      setBranches(propBranches);
    }
  }, [isLoading]);
  console.log(branches);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "admin",
      branch: null,
    },
  });

  return (
    <div className="h-fit md:max-w-[500px] w-full p-6 md:p-12 md:border rounded-xl bg-white">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl text-center">Create Admin Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
          <input
            {...register("firstName")}
            type="text"
            placeholder="First Name"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.firstName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.firstName && (
            <p className="text-[#E71926]">{errors.firstName.message}</p>
          )}

          <input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.lastName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.lastName && (
            <p className="text-[#E71926]">{errors.lastName.message}</p>
          )}

          <input
            {...register("email")}
            type="text"
            placeholder="Enter Email Address"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.email ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.email && (
            <p className="text-[#E71926]">{errors.email.message}</p>
          )}

          <input
            {...register("phone")}
            type="text"
            placeholder="Phone Number"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.phone ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.phone && (
            <p className="text-[#E71926]">{errors.phone.message}</p>
          )}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.password ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.password && (
            <p className="text-[#E71926]">{errors.password.message}</p>
          )}

          <div className="flex flex-col">
            <label className="mb-2">Role</label>
            <select
              {...register("role")}
              className="outline-none focus:outline-none border border-black py-3"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2">Branch</label>
            <select
              {...register("branch")}
              className="outline-none focus:outline-none border border-black py-3"
            >
              <option value="" hidden>
                Select Branch
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className={`bg-[#194A34] flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-[#1F4F38] ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer"
            }`}
          >
            {isLoading ? <Loader /> : "Create Account"}
          </button>

          <div className="flex items-center">
            <div className="flex-1 mr-5 border-t border-[#1E4E38]"></div>
            <div className="text-[#1E4E38]">Already have an Account?</div>
            <div className="flex-1 ml-5 border-t border-[#1E4E38]"></div>
          </div>
          <Link to={"/admin-sign-in"}>
            <div className="cursor-pointer border-[1px] text-center p-3 text-[#194A34] border-[#194A34] transition duration-300 ease-in-out transform hover:scale-105 hover:border-[#194A45]">
              LOG IN
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterForm;
