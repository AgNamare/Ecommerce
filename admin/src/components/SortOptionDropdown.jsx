import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Filter } from "lucide-react";

const SORT_OPTIONS = [
  {
    label: "Best match",
    value: "best",
  },
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
];

const SortOptionDropdown = ({ onChange, sortOption }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <div
          variant="outline"
          className="w-fit flex items-center border rounded-sm px-3 py-1 gap-2 cursor-pointer"
        >
          <Filter size={20} />{" "}
          <span className="text-lg font-normal">Filter</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="cursor-pointer"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptionDropdown;
