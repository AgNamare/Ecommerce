import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import visa from "../assets/Visa.jpg";
import mastercard from "../assets/mastercard.jpg";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

const CardTypeEnum = z.enum(["Visa", "Mastercard"]);

const cardDetailsSchema = z.object({
  cardType: CardTypeEnum,
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits.")
    .regex(/^\d{16}$/, "Please enter a valid card number."),
  expiryDate: z.string().min(5, "Expiry date must be in MM/YY format."),
  cvv: z.string().min(3, "CVV must be 3 digits."),
  cardholderName: z.string().min(1, "Cardholder name cannot be empty."),
});

const CardDetailsForm = ({ onSave, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cardDetailsSchema),
  });

  return (
    <div className="w-80  p-6 md:p-12  rounded-xl bg-white">
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-bold">Enter Card Details</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSave)}>
          <div className="flex gap-4 items-center">
            <input
              {...register("cardType")}
              type="radio"
              name="cardType"
              value="Visa"
              className="outline-none focus:outline-none"
            />
            <label>Visa</label>
            <input
              {...register("cardType")}
              type="radio"
              name="cardType"
              value="Mastercard"
              className="outline-none focus:outline-none"
            />
            <label>Mastercard</label>
          </div>
          {errors.cardType && (
            <p className="text-[#E71926]">{errors.cardType.message}</p>
          )}
          <input
            {...register("cardNumber")}
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.cardNumber ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.cardNumber && (
            <p className="text-[#E71926]">{errors.cardNumber.message}</p>
          )}
          <input
            {...register("expiryDate")}
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.expiryDate ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.expiryDate && (
            <p className="text-[#E71926]">{errors.expiryDate.message}</p>
          )}
          <input
            {...register("cvv")}
            type="text"
            name="cvv"
            placeholder="CVV"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.cvv ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.cvv && (
            <p className="text-[#E71926]">{errors.cvv.message}</p>
          )}
          <input
            {...register("cardholderName")}
            type="text"
            name="cardholderName"
            placeholder="Cardholder Name"
            className={`w-full border-b pb-5 outline-none focus:outline-none ${
              errors.cardholderName ? "border-[#E71926]" : "border-[#194A3491]"
            }`}
          />
          {errors.cardholderName && (
            <p className="text-[#E71926]">{errors.cardholderName.message}</p>
          )}
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-primary flex justify-center items-center text-white p-3 w-full rounded-3xl transition-colors duration-200 hover:bg-[#1F4F38] ${
              isLoading ? "opacity-60 cursor-default" : "cursor-pointer "
            }`}
          >
            {isLoading ? <Loader /> : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardDetailsForm;
