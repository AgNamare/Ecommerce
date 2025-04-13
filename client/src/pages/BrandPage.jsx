import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetProducts } from "@/api/ProductApi";
import { useGetBranches } from "@/api/AuthApi";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import Popup from "@/components/Popup";
import StoreSelection from "@/components/StoreSelection";
import { setBranch } from "@/redux/branch/branchSlice";
import NoProductsFoundIllustration from "@/components/NoProductsFoundIllustration";

const BrandPage = () => {
  const { brand } = useParams();
  const branch = useSelector((state) => state.branch?.selectedBranch?.id);
  const dispatch = useDispatch();

  const [branches, setBranches] = useState([]);
  const { branches: fetchedBranches, isLoadingBranches } = useGetBranches();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const {
    products,
    metadata,
    isProductsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetProducts(branch, brand);

  // Update branches when fetched
  useEffect(() => {
    if (!isLoadingBranches) {
      setBranches(fetchedBranches);
    }
  }, [fetchedBranches, isLoadingBranches]);

  // Show popup if no branch is selected
  useEffect(() => {
    if (!branch) {
      setIsPopupVisible(true);
    }
  }, [branch]);

  const handleSelectBranch = (branch) => {
    dispatch(setBranch(branch));
    setIsPopupVisible(false);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight - 800;

      if (
        scrollPosition >= bottomPosition &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage(); // Fetch next page of products
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state for the first page
  if (isProductsLoading) {
    return (
      <div className="flex flex-col min-h-screen mt-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">
          <span className="capitalize">{brand}</span> Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 ">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} className="m-0" />
          ))}
        </div>
      </div>
    );
  }

  // Render message if no products match the brand
  if (products.length === 0) {
    return (
      <>
        <h2 className="text-2xl text-center md:text-3xl font-semibold text-gray-600 mb-4">
          <span className="capitalize">"{brand}"</span> Products
        </h2>
        <NoProductsFoundIllustration />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-4">
      <Popup isVisible={isPopupVisible} onClose={closePopup}>
        <StoreSelection
          branches={branches}
          onSelectBranch={handleSelectBranch}
        />
      </Popup>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-600 mb-4">
        <span className="capitalize">{brand}</span> Products
      </h2>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-600">
          <p className="text-sm md:text-base text-gray-600">
            {metadata?.totalDocuments} product
            {metadata?.totalDocuments === 1 ? "" : "s"} found
          </p>
        </h2>
      </div>

      <div className="flex flex-wrap sm:justify-start sm:gap-0 gap-2 mb-4 justify-between">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            discountPrice={product.discountPrice}
            price={product.price}
            brand={product.brand}
            img={product.images[0]}
            name={product.productName}
            id={product._id}
            stockLevel={product.stockLevel}
          />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 ">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} className="m-0" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandPage;
