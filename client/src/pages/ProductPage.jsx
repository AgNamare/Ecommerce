import React, { useEffect, useState } from "react";
import { useGetAProduct, useGetProducts } from "@/api/ProductApi";
import { useParams, useNavigate, Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSelector, useDispatch } from "react-redux";
import ShareButton from "@/components/ShareButton";
import QuantityDropdown from "@/components/QuantityDropdown";
import { addProductToCart, addToCartLocal } from "@/redux/cart/cartSlice";
import { toast } from "sonner";
import SkeletonProductPage from "@/components/skeletons/SkeletonProductPage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import StoreSelection from "@/components/StoreSelection";
import { useGetBranches, useGetCategoryProducts } from "@/api/HomeApi";
import { setBranch } from "@/redux/branch/branchSlice";
import ProductGroup from "@/components/ProductGroup";
import Popup from "@/components/Popup";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedBranch } = useSelector((state) => state.branch);
  const { branches: fetchedBranches, isLoadingBranches } = useGetBranches();
  const [branches, setBranches] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { products: pro } = useSelector((state) => state.cart);
  const productQuantity =
    pro.filter((item) => item.product._id === id)[0]?.quantity || 0;
  // Fetch branches
  useEffect(() => {
    if (!isLoadingBranches) {
      setBranches(fetchedBranches);
    }
  }, [fetchedBranches, isLoadingBranches]);

  const handleBranchSelection = (branch) => {
    console.log(branch);
    dispatch(setBranch(branch));
    setIsPopupVisible(false);
  };

  // Fetching products based on selected branch
  const { products, isProductsLoading } = useGetProducts(
    selectedBranch ? selectedBranch.id : null
  );

  // Fetching the specific product
  const { product, isProductLoading } = useGetAProduct(
    id,
    selectedBranch ? selectedBranch.id : null
  );
  // Fetching related products from the same category
  const { products: relatedProducts, isLoadingRelatedProducts } =
    useGetCategoryProducts(product?.category?.name, selectedBranch?.id);

  const axiosPrivate = useAxiosPrivate();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!selectedBranch) {
      setIsPopupVisible(true); // Show popup if no branch is selected
    }
  }, [selectedBranch]);

  // Handle loading states
  if (isLoadingBranches || isProductLoading || isLoadingRelatedProducts) {
    return <SkeletonProductPage />;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  const {
    category,
    productName,
    brand,
    SKU,
    price,
    description,
    images,
    size,
    measurementUnit,
    discountPrice,
    stockLevel,
  } = product;

  const breadcrumbs = category
    ? [
        { name: "Home", path: "/" },
        ...category.path.map((cat) => ({
          name: cat.name,
          path: `/category/${cat.name}`,
        })),
        { name: category.name, path: `/category/${category.name}` },
      ]
    : [];

  const productUrl = window.location.href;

  const handleQuantityChange = (quantity) => {
    setSelectedQuantity(quantity);
  };

  const existingCartItem = cart.products.find(
    (item) => item.product._id === id
  );
  const currentQuantityInCart = existingCartItem
    ? existingCartItem.quantity
    : 0;

  const handleAddToCart = async (quantity) => {
    if (stockLevel > 0) {
      const totalQuantityAfterAdding = currentQuantityInCart + quantity;

      if (
        totalQuantityAfterAdding <= stockLevel &&
        totalQuantityAfterAdding >= 0
      ) {
        setIsAddingToCart(true);

        try {
          if (user) {
            // For logged-in users
            await dispatch(
              addProductToCart({
                productID: id,
                quantity: quantity,
                method: "setQuantity",
                axiosPrivate,
              })
            ).unwrap();

            toast.success("Product added to cart.");
          } else {
            // For non-logged-in users, handle local cart
            dispatch(
              addToCartLocal({
                img: product.images[0],
                price: discountPrice || price,
                id,
                name: productName,
                quantity,
              })
            );
            toast.success("Product added to cart.");
          }
        } catch (error) {
          console.error("Failed to update product in cart:", error);
        } finally {
          setIsAddingToCart(false);
        }
      } else {
        toast.error(
          "Cannot add more than available stock level. Please select a lower quantity."
        );
      }
    } else {
      toast.error("Product is out of stock.");
    }
  };

  return (
    <div className="md:p-8 lg:p-4">
      {/* Show Store Selection Popup */}
      <Popup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
      >
        <StoreSelection
          branches={branches}
          onSelectBranch={handleBranchSelection}
        />
      </Popup>

      {/* Breadcrumbs */}
      <div className="py-2">
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap space-x-0.5 text-sm md:text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <Link to={crumb.path} className="hover:text-primary">
                        {crumb.name}
                      </Link>
                      <span className="mx-0.5">/</span>
                    </>
                  ) : (
                    <span className="text-primary">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-8 lg:gap-16">
        {/* Image Carousel */}
        <div className="lg:w-[30vw] md:w-[50vw]">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image}>
                  <img
                    src={image}
                    alt="Product"
                    className="w-full h-auto object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && <CarouselPrevious />}
            {images.length > 1 && <CarouselNext />}
          </Carousel>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {productName}
          </h2>
          <Link
            to={`/brand/${brand}`}
            className="capitalize text-sm md:text-base"
          >
            More From <span className="text-primary">{brand}</span>
          </Link>
          <p className="text-sm md:text-base">
            Size: {size} {measurementUnit}{" "}
          </p>

          <QuantityDropdown
            productQuantity={productQuantity}
            stockLevel={stockLevel}
            price={discountPrice}
            onQuantityChange={handleQuantityChange}
            initialQuantity={currentQuantityInCart}
          />

          <div className="flex flex-col md:flex-row lg:w-[50%] gap-4">
            <button
              type="button"
              className={`flex-1 text-white rounded-3xl py-2 px-4 ${
                isAddingToCart ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
              } text-sm md:text-base`}
              onClick={() => handleAddToCart(selectedQuantity)}
              disabled={isAddingToCart}
            >
              Add To Cart
            </button>
            <button
              type="button"
              className={`flex-1 text-white rounded-3xl py-2 px-4 ${
                isAddingToCart ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
              } text-sm md:text-base`}
              onClick={async () => {
                await handleAddToCart(selectedQuantity);
                navigate("/cart");
              }}
              disabled={isAddingToCart}
            >
              Buy Now
            </button>
          </div>
          <div className="mt-4">
            <ShareButton url={productUrl} title={productName} />
          </div>
        </div>
      </div>

      {description && <p className="mt-4 text-gray-600">{description}</p>}

      <div className="mt-12">
        <h2 className="font-bold text-xl ">You May Also Like</h2>
        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div className="">
            <ProductGroup
              isLoding={isLoadingRelatedProducts}
              products={relatedProducts}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
