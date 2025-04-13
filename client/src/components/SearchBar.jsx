import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const formSchema = z.object({
  searchQuery: z.string().min(1).max(50),
});

const SearchBar = () => {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const onSave = ({ searchQuery }) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchQuery);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
      setValue("searchQuery", searchTermFromUrl);
    }
  }, [window.location.search, setValue]);

  return (
    <div className="w-full border h-8 rounded-full px-4 py-1 bg-gray-200">
      <form
        className="flex justify-between items-center"
        onSubmit={handleSubmit(onSave)}
      >
        <input
          className="w-full focus:outline-none bg-gray-200"
          {...register("searchQuery")}
          type="text"
          placeholder="Search"
          defaultValue={searchTerm}
        />
        <button type="submit" aria-label="Search">
          <Search  size={18}/>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
