import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FilePenLine, X } from "lucide-react";
import walmartLogo from "../../assets/images/quickmart.png";
import Loader from "@/components/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  otp: z.string().min(6, "Please enter a valid OTP."),
});

const OTPVerificationForm = ({
  onSave,
  isLoading,
  name,
  onButtonClick,
  onXButtonClick,
  onResendOtpClick,
}) => {
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtpClick = () => {
    onResendOtpClick();
    setTimer(30); // Start the countdown from 30 seconds
  };

  return (
    <div className="h-fit w-screen md:max-w-[500px] p-4 md:p-12 md:border rounded-xl bg-white">
      <div className="flex justify-end">
        <button className="cursor-pointer" onClick={onXButtonClick}>
          <X />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <img src={walmartLogo} alt="" className="w-fit h-fit " />
        <h1 className="text-3xl">Verify Your Account</h1>
        {onButtonClick && <p>Hi {name}</p>}
        <div className="flex gap-2">
          <p>Check your Email we have sent your OTP</p>
          {onButtonClick && (
            <button className="cursor-pointer" onClick={onButtonClick}>
              <FilePenLine color="#194A34" />
            </button>
          )}
        </div>
        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(onSave)}
        >
          <input
            {...register("otp")}
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className={`w-full border-b pb-5 focus:outline-none border-[#194A3491]`}
          />
          {errors.otp && <p className="text-[#E71926]">{errors.otp.message}</p>}

          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-primary hover:opacity-80 ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer"
            }`}
          >
            {isLoading ? <Loader /> : "Verify"}
          </button>
          <div className="flex items-center">
            <div className="flex-1 mr-5 border-t border-[#1E4E38]"></div>
            <div className="text-[#1E4E38]">Didn't receive OTP?</div>
            <div className="flex-1 ml-5 border-t border-[#1E4E38]"></div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleResendOtpClick}
              type="button"
              disabled={timer > 0}
              className={`border-[1px] text-center p-2 text-primary border-primary transition duration-300 ease-in-out transform ${
                timer === 0
                  ? "hover:scale-105 hover:border-[#194A45] cursor-pointer"
                  : "cursor-default"
              }`}
            >
              {timer > 0 ? `Wait for ${timer} seconds` : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationForm;
