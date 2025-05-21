import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartLocal, addProductToCart } from "@/redux/cart/cartSlice";
import { toast } from "sonner";
import { useState } from "react";
import Loader from "./Loader";
import { ShoppingBagIcon } from "lucide-react";
import Counter from "./Counter";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ProductCard = ({
  img,
  price,
  discountPrice,
  id,
  name,
  brand,
  stockLevel,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { selectedBranch } = useSelector((state) => state.branch);

  const cart = useSelector((state) => state.cart);
  const existingCartItem = cart.products.find(
    (item) => item.product._id === id
  );
  const currentQuantityInCart = existingCartItem
    ? existingCartItem.quantity
    : 0;

  const handleAddToCart = async (quantity) => {
    if (!selectedBranch) {
      return toast.error("Please select a branch to add to cart");
    }

    const totalQuantityAfterAdding = currentQuantityInCart + quantity;

    if (totalQuantityAfterAdding < 0) {
      toast.error("Quantity cannot be negative.");
      return;
    }

    if (totalQuantityAfterAdding <= stockLevel) {
      setIsCartLoading(true);

      try {
        if (user) {
          await dispatch(
            addProductToCart({
              productID: id,
              quantity,
              method: "update",
              axiosPrivate,
            })
          ).unwrap();
        } else {
          dispatch(
            addToCartLocal({
              img,
              price,
              id,
              name,
              quantity,
              discountPrice,
            })
          );
        }

        toast.success(
          `Product ${quantity > 0 ? "added to" : "removed from"} cart.`
        );
      } catch (error) {
        toast.error("Failed to update product in cart. Try Again Later");
      } finally {
        setIsCartLoading(false);
      }
    } else {
      toast.error(
        `Sorry, the stock for ${name} is currently ${stockLevel}. Please try again later or select a different amount.`
      );
      setIsCartLoading(false);
    }
  };

  // Helper function to truncate name if it exceeds 30 characters
  const truncateName = (str, maxLength) =>
    str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

  // Calculate discount percentage
  const discountPercentage = discountPrice
    ? ((price - discountPrice) / price) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl border border-1 overflow-hidden flex flex-col justify-between w-[175px] md:w-[192px] lg:w-[200px] h-[290px] sm:h-[310px] md:h-[370px] p-2">
      <div className="flex-1 flex flex-col">
        <Link
          to={`/products/${id}`}
          className="flex flex-col justify-between items-start"
        >
          <div className="h-[120px] sm:h-[150px] md:h-[160px] w-full flex justify-center">
            <img
              src={img}
              alt="Product Image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="py-1 mt-2 font-bold">
            <p className="text-black text-sm sm:text-md md:text-lg line-clamp-2">
              {truncateName(name, 38)}
            </p>
          </div>
          <div className="py-1 flex items-start justify-start">
            <p className="text-black text-xs sm:text-sm truncate">
              By <span className="text-primary">{brand}</span>
            </p>
          </div>
          {discountPrice !== price && (
            <div>
              <p className="text-xs sm:text-sm">
                <span className="line-through text-gray-500">KES {price}</span>{" "}
                <span className="text-red-200">
                  {Math.round(discountPercentage)}% Off
                </span>
              </p>
            </div>
          )}
          <div>
            {discountPrice ? (
              <h2 className="text-sm sm:text-md md:text-lg font-bold">
                KES {discountPrice}
              </h2>
            ) : (
              <h2 className="text-sm sm:text-md md:text-lg font-bold">
                KES {price}
              </h2>
            )}
          </div>
        </Link>
      </div>
      <div className="flex flex-row justify-center items-center mt-2">
        {isCartLoading ? (
          <div className="flex items-center justify-center bg-primary bg-opacity-45 text-white py-1 px-4 rounded-sm">
            <Loader />
          </div>
        ) : currentQuantityInCart > 0 ? (
          <div className="flex items-center justify-center bg-primary bg-opacity-70 text-white py-1 px-2 rounded-sm">
            <Counter
              onPlusClick={() => handleAddToCart(1)}
              onMinusClick={() => handleAddToCart(-1)}
              itemCount={currentQuantityInCart}
            />
          </div>
        ) : (
          <button
            onClick={() => handleAddToCart(1)}
            className="flex gap-1 items-center justify-center bg-primary text-white font-bold bg-opacity-70 px-2 py-1 rounded-sm hover:bg-opacity-60 active:scale-95"
          >
            <ShoppingBagIcon size={18} />
            <p className="text-xs sm:text-sm">Cart</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
