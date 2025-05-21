import {
  CircleUserRound,
  LogInIcon,
  StoreIcon,
  ChevronRight,
  LogOutIcon,
  ChevronDown, // Import ChevronDown
  ChevronUp,
  ShoppingCart,
  Package,
  Phone, // Import ChevronUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StoreSelection from "./StoreSelection";
import { useGetBranches } from "@/api/HomeApi";
import { removeBranch, setBranch } from "@/redux/branch/branchSlice";
import { categories } from "@/utils/utils";
import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import MobileNavLinks from "./MobileNavLinks";
import { clearAccessToken } from "@/redux/auth/authSlice";
import { deleteUser } from "@/redux/user/userSlice";
import { resetCart } from "@/redux/cart/cartSlice";
import { deleteOrderInfo } from "@/redux/order/orderSlice";
import { useLogOut } from "@/api/AuthApi";

const MobileNavbar = ({ isOpen }) => {
  const { user } = useSelector((state) => state.user);
  const { branches: apiBranches, isLoadingBranches } = useGetBranches();
  const [branches, setBranches] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State for category expansion
  const { logOut, isLoggingOut } = useLogOut();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoadingBranches && apiBranches.length > 0) {
      setBranches(apiBranches);
    }
  }, [apiBranches, isLoadingBranches]);

  const handleSelectBranch = (branch) => {
    dispatch(setBranch(branch));
  };

  const handleSignOut = async () => {
    await logOut();
    dispatch(deleteUser());
    dispatch(removeBranch());
    dispatch(resetCart());
    dispatch(deleteOrderInfo());
    window.location.reload();
  };

  const formatCategoryNameForUrl = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, "-");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 w-80 h-[85vh] bg-white shadow-lg transform transition-transform translate-x-0 overflow-hidden">
      <ScrollArea className="h-full bg-white">
        {" "}
        {/* Ensure ScrollArea takes full height */}
        <div className="space-y-2">
          {/* Branch selection */}
          <div className="border-b-2 py-2 mb-2">
            <div className="flex items-center gap-2 px-4">
              {isLoadingBranches ? (
                <p>Loading...</p>
              ) : (
                <>
                  <StoreIcon color="#DAA520" size={20} />
                  <StoreSelection
                    branches={branches}
                    onSelectBranch={handleSelectBranch}
                  />
                </>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-2 border-b-2 mb-2">
            <h2 className="font-bold text-md text-gray-800 px-4">Categories</h2>
            <div className="flex flex-col gap-3">
              {categories
                .slice(0, isExpanded ? categories.length : 4)
                .map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between px-2"
                  >
                    <Link
                      to={`/category/${formatCategoryNameForUrl(
                        category.name
                      )}`}
                      className="flex items-center gap-2 w-full text-gray-800 hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      <span className="flex-grow text-sm">{category.name}</span>
                    </Link>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span className="ml-2 text-sm">
                {isExpanded ? "Show Less" : "Show More"}
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col border-b-2 py-2 gap-4">
          <h2 className="text-md font-bold px-4">Links</h2>
          <div className="flex gap-1 px-2 items-center">
            <div className="bg-gray-200 p-2 rounded-full ">
              <Package size={16} className="text-gray-500" />
            </div>
            <Link to="/orders" className="hover:underline">
              Orders
            </Link>
          </div>
          <div className="flex gap-1 px-2 items-center">
            <div className="bg-gray-200 p-2 rounded-full ">
              <Phone size={16} className="text-gray-500" />
            </div>
            <Link to="/contacts" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
        {/* Sign-Out Button at the Bottom */}
        {user && (
          <div className="mt-auto">
            <button
              onClick={handleSignOut}
              className="flex items-center text-red-600 w-full px-2 py-2 mb-4 rounded"
            >
              <LogOutIcon className="mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MobileNavbar;
