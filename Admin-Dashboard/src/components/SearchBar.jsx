import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Search } from "lucide-react";

const formSchema = z.object({
  searchQuery: z.string({
    required_error: "Product name is required",
  }),
});

const SearchBar = ({ placeholder, onSubmit, searchQuery = "" }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
    },
  });

  useEffect(() => {
    reset({ searchQuery });
  }, [reset, searchQuery]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex items-center gap-3 justify-between flex-row border-2 p-2 rounded-md w-full ${
        errors.searchQuery && "border-red-500"
      }`}
    >
      <input className="focus:outline-none" {...register("searchQuery")} placeholder={placeholder} />
      <button type="submit"><Search/></button>
    </form>
  );
};

export default SearchBar;
