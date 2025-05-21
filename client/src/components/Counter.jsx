import { Plus, Minus } from "lucide-react";

const Counter = ({ onPlusClick, onMinusClick, itemCount }) => {
  return (
    <div className="flex gap-1 items-center justify-center">
      <button type="button" className="px-2" onClick={onMinusClick}>
        <Minus size={16} />
      </button>
      <div className=" flex items-center justify-center text-primary border-gray-400 bg-white h-5 w-8">
        {itemCount}
      </div>
      <button type="button" className="px-2" onClick={onPlusClick}>
        <Plus size={16} />
      </button> 
    </div>
  );
};

export default Counter;
