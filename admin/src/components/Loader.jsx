import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-6 w-6 animate-spin">
      <LoaderCircle size={24} strokeWidth={2} color="currentColor" />
    </div>
  );
};

export default Loader;
