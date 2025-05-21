import React, { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  addProductToCart,
  addToCartLocal,
  deleteProductFromCart,
  deleteProductLocalCart,
} from "@/redux/cart/cartSlice";
import { Car, Trash2 } from "lucide-react";
import { links, steps } from "@/config/cartConfig";
import { Link, useNavigate } from "react-router-dom";
import EmptyCartMessage from "@/components/EmptyCartMessage";
import SkeletonCartItems from "./SkeletonCartItems";
import SkeletonOrderSummary from "./SkeletonOrderSummary";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const Counter = lazy(() => import("@/components/Counter"));
const OrderSummary = lazy(() => import("@/components/OrderSummary"));
const Stepper = lazy(() => import("@/components/Stepper"));

const CartPage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deliveryInfo = useSelector((state) => state.order.deliveryInfo);
  const paymentInfo = useSelector((state) => state.order.paymentInfo);
  const cart = useSelector((state) => state.cart);
  const axiosPrivate = useAxiosPrivate();

  const [updatedCart, setUpdatedCart] = useState({
    products: [],
    totalQuantity: 0,
    totalSavings: 0,
    totalAmount: 0,
  });

  console.log(updatedCart);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);

  const fetchCart = async () => {
    try {
      if (user) {
        try {
          const response = await axiosPrivate.get(`/api/v1/cart/${user.cart}`);
          const cart = response.data; // Directly get the data from the response
          setUpdatedCart(cart);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          throw new Error("Failed to fetch cart");
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || {
          products: [],
          totalQuantity: 0,
          totalAmount: 0,
          savings: 0,
        };
        setUpdatedCart(localCart);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const handleAddToCart = async (product, quantity) => {
    setLoadingItemId(product._id);

    if (user) {
      const params = {
        productID: product._id,
        quantity: quantity,
        method: "update",
        axiosPrivate,
      };

      try {
        await dispatch(addProductToCart(params)).unwrap();
        await fetchCart();
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingItemId(null);
      }
    } else {
      dispatch(
        addToCartLocal({
          img: product.img,
          price: product.price,
          id: product._id,
          name: product.name,
          quantity: quantity,
          discountPrice: product.discountPrice,
        })
      );
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || {
        products: [],
        totalQuantity: 0,
        totalAmount: 0,
        savings: 0,
      };
      setUpdatedCart(localCart);
      setLoadingItemId(null);
    }
  };

  const handleDeleteProduct = async (productID) => {
    setLoadingItemId(productID);

    const params = {
      cartId: user ? user.cart : null,
      productId: productID,
      axiosPrivate,
    };

    try {
      if (user) {
        // Handle deleting product for authenticated users
        const newCart = await dispatch(deleteProductFromCart(params)).unwrap();
        setUpdatedCart(newCart);
      } else {
        console.log("Deleting..");
        // Handle deleting product for local storage (non-authenticated users)
        dispatch(deleteProductLocalCart({ id: productID }));

        // Manually update the updatedCart state after deleting product locally
        const localCart = JSON.parse(localStorage.getItem("cartItems")) || {
          products: [],
          totalQuantity: 0,
          totalAmount: 0,
          savings: 0,
        };

        console.log(localCart);
        const updatedLocalCart = {
          ...localCart,
          products: localCart.products.filter(
            (item) => item.product._id !== productID
          ),
        };

        // Update local storage and the state to reflect the changes
        localStorage.setItem("cartItems", JSON.stringify(updatedLocalCart));
        setUpdatedCart(updatedLocalCart);
      }
    } catch (error) {
      toast.error("Failed to delete product from cart.");
    } finally {
      setLoadingItemId(null);
    }
  };

  const doneSteps = [];
  const deliveryMethod = deliveryInfo.method;
  const hasAddress = deliveryInfo.address;
  const hasDeliverySlot = deliveryInfo.deliverySlot;

  if (deliveryMethod === "pickup" || (hasAddress && hasDeliverySlot)) {
    doneSteps.push(1); // Delivery step completed
  }

  if (Object.keys(paymentInfo).length > 0) {
    doneSteps.push(2); // Payment step completed
  }

  if (cart.products.length > 0) {
    doneSteps.push(0); // Cart step completed
  }

  return (
    <div className="mt-2 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Stepper
          steps={steps}
          to={links}
          doneSteps={doneSteps}
          heading={"Checkout Process"}
        />
      </Suspense>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row">
        {isCartLoading ? (
          <div className="w-full flex flex-col gap-6 lg:flex-row">
            <Suspense fallback={<div>Loading...</div>}>
              <SkeletonCartItems />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SkeletonOrderSummary />
            </Suspense>
          </div>
        ) : updatedCart.products && updatedCart.products.length === 0 ? (
          <EmptyCartMessage />
        ) : (
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 w-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-x-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-white">
                      <th className="py-2 px-4 text-sm font-semibold text-left lg:text-base">
                        Product Details
                      </th>
                      <th className="py-2 px-4 lg:text-base"></th>
                      <th className="py-2 px-4 text-sm font-semibold text-left lg:text-base">
                        Quantity
                      </th>
                      <th className="py-2 px-4 text-sm font-semibold text-left lg:text-base">
                        Price
                      </th>
                      <th className="py-2 px-4 text-sm font-semibold text-left lg:text-base">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedCart.products.map((item) => (
                      <tr key={item.product._id} className="bg-white relative">
                        <td className="py-2 px-4 text-sm lg:text-base">
                          <img
                            className="h-[70px] w-[70px] object-cover"
                            src={
                              item.product.images &&
                              item.product.images.length > 0
                                ? item.product.images[0]
                                : item.product.img
                            }
                            alt="product image"
                          />
                        </td>
                        <td className="py-2 px-4 text-sm lg:text-base">
                          <div className="capitalize">
                            <Link to={`/products/${item.product._id}`}>
                              {item.product.productName}
                            </Link>
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b text-sm lg:text-base">
                          <Suspense fallback={<div>Loading...</div>}>
                            <Counter
                              itemCount={item.quantity}
                              onMinusClick={() =>
                                handleAddToCart(item.product, -1)
                              }
                              onPlusClick={() =>
                                handleAddToCart(item.product, 1)
                              }
                              isLoading={loadingItemId === item.product._id}
                            />
                          </Suspense>
                        </td>
                        <td className="py-2 px-4 border-b text-sm lg:text-base">
                          Ksh {item.product.discountPrice}
                        </td>
                        <td className="py-2 px-4 border-b text-sm lg:text-base flex-col relative">
                          <span>
                            Ksh {item.quantity * item.product.discountPrice}
                          </span>
                          {loadingItemId === item.product._id ? (
                            <div className="absolute bottom-0 right-0 mb-2 mr-2">
                              <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <Trash2
                              color="#B12E26"
                              size={16}
                              onClick={() =>
                                handleDeleteProduct(item.product._id)
                              }
                              className="cursor-pointer absolute bottom-0 right-0 mb-2 mr-2"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Suspense>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80">
              <Suspense fallback={<div>Loading...</div>}>
                <OrderSummary
                  subtotal={updatedCart.totalAmount}
                  savings={updatedCart.totalSavings}
                  shippingFee={100}
                />
              </Suspense>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => navigate("/address")}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm lg:text-base"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
