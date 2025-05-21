import { useGetCategoryProducts, useGetSubcategories } from "@/api/HomeApi";
import CircleLink from "@/components/CircleLink";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import Popup from "@/components/Popup"; // Import the Popup component
import StoreSelection from "@/components/StoreSelection"; // Import the StoreSelection component
import { useState, useEffect } from "react";
import { setBranch } from "@/redux/branch/branchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetBranches } from "@/api/AuthApi";
import NoProductsFoundIllustration from "@/components/NoProductsFoundIllustration";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const branch = useSelector((state) => state.branch?.selectedBranch?.id);
  const [branches, setBranches] = useState([]);
  const { branches: fetchedBranches, isLoadingBranches } = useGetBranches();
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Control popup visibility

  const {
    products,
    metadata,
    isProductsLoading,
    error: productsError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetCategoryProducts(
    categoryId,
    branch,
    sortBy,
    sortOrder,
    10, // limit per page
    searchParams.get("searchQuery") || ""
  );

  const { subcategories, isSubcategoriesLoading } =
    useGetSubcategories(categoryId);

  useEffect(() => {
    if (!isLoadingBranches) {
      setBranches(fetchedBranches);
    }
  }, [fetchedBranches, isLoadingBranches]);

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

  const handleSortChange = (e) => {
    const [sortField, order] = e.target.value.split(",");
    setSortBy(sortField);
    setSortOrder(Number(order));
    setSearchParams({ sortBy: sortField, sortOrder: order });
  };

  const handleSelectBranch = (branch) => {
    dispatch(setBranch(branch));
    setIsPopupVisible(false);
  };

  // Show popup if no branch is selected
  useEffect(() => {
    if (!branch) {
      setIsPopupVisible(true);
    }
  }, [branch]);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="mt-4">
      {/* Store Selection Popup */}
      <Popup isVisible={isPopupVisible} onClose={closePopup}>
        <StoreSelection
          branches={branches}
          onSelectBranch={handleSelectBranch}
        />
      </Popup>

      {isSubcategoriesLoading ? (
        <div className="flex flex-wrap justify-between mb-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <div className="animate-pulse h-full w-full rounded-full bg-gray-300"></div>
            </div>
          ))}
        </div>
      ) : (
        subcategories && (
          <div>
            <h1 className="text-lg font-bold mb-4 capitalize">
              Shop {categoryId} By Category
            </h1>
            <div className="flex flex-wrap justify-between">
              {subcategories.map((subcategory) => (
                <CircleLink
                  key={subcategory._id}
                  src={subcategory.imageUrl}
                  title={subcategory.name}
                  link={`/category/${subcategory.name}`}
                />
              ))}
            </div>
          </div>
        )
      )}

      {isProductsLoading && !products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 ">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} className="m-0" />
          ))}
        </div>
      ) : productsError ? (
        <div className="text-red-500 text-center mt-4">
          <NoProductsFoundIllustration />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 mt-4">
            <h2 className="text-2xl font-semibold text-gray-600">
              <p className="text-gray-600 text-sm">
                {metadata.totalDocuments} product
                {metadata.totalDocuments === 1 ? "" : "s"} found
              </p>
            </h2>

            <div className="text-xs">
              <label htmlFor="sort" className="mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${sortBy},${sortOrder}`}
                onChange={handleSortChange}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value="createdAt,-1">Relevance</option>
                <option value="discountPrice,1">Price: Low to High</option>
                <option value="discountPrice,-1">Price: High to Low</option>
              </select>
            </div>
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
        </>
      )}
    </div>
  );
};

export default CategoryPage;
