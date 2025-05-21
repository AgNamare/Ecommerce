import * as React from "react";
import { Check, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const StoreSelection = ({ branches, onSelectBranch }) => {
  const [open, setOpen] = React.useState(false);
  const { selectedBranch: initialSelectedBranch } = useSelector(
    (state) => state.branch
  );
  const [selectedBranch, setSelectedBranch] = React.useState(
    initialSelectedBranch || null
  );

  useEffect(() => {
    if (initialSelectedBranch) {
      setSelectedBranch(initialSelectedBranch);
    }
  }, [initialSelectedBranch]);
  const handleSelect = (branch) => {
    setSelectedBranch(branch);
    onSelectBranch(branch); // Notify parent component
    setOpen(false); // Close popover
  };

  return (
    <Popover open={open} onOpenChange={setOpen} className="z-1000 ">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[130px] hover:text-primary justify-between border-none hover:bg-white p-0"
        >
          {selectedBranch ? selectedBranch.label : "Select Branch"}
          <ChevronDownIcon className="ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white shadow-lg rounded">
        <Command>
          <CommandInput placeholder="Select Branch" />
          <CommandList>
            {branches.length === 0 ? (
              <CommandEmpty>No branches found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {branches.map((branch) => (
                  <CommandItem
                    key={branch.value}
                    value={branch.value}
                    onSelect={() => handleSelect(branch)}
                    className="cursor-pointer flex items-center"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBranch && selectedBranch.value === branch.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <p className="text-sm">{branch.label}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSelection;
