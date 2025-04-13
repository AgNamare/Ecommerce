import { useSearchProducts } from "@/api/HomeApi";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/skeletons/SkeletonCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import NoProductsFoundIllustration from "@/components/NoProductsFoundIllustration";

const SearchPage = () => {
  console.log("SearchPage rendered");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm");
  const branch = useSelector((state) => state.branch.selectedBranch.id);

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(-1);

  const {
    products: fetchedProducts,
    metadata,
    isProductsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: productsError,
  } = useSearchProducts(searchTerm, branch, sortBy, sortOrder);

  // Handle sort change
  const handleSortChange = (e) => {
    const [sortField, order] = e.target.value.split(",");
    setSortBy(sortField);
    setSortOrder(Number(order));
    // Resetting search params for sorting
    setSearchParams({
      searchTerm,
      sortBy: sortField,
      sortOrder: order,
    });
  };

  // Handle scroll for loading more products
  const handleScroll = () => {
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const bottomPosition = document.documentElement.offsetHeight - 800; // Adjust threshold

    if (
      scrollPosition >= bottomPosition &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
      console.log("Loading more products...");
    }
  };

  // Listen to scroll event
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage]); // Depend on fetching states

  // Loading state
  if (isProductsLoading && fetchedProducts.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-600">
          Search results for "{searchTerm}"
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} className="m-0" />
          ))}
        </div>
      </div>
    );
  }

  // Check for errors or no products found
  if (productsError || (fetchedProducts.length === 0 && !isProductsLoading)) {
    return (
      <div>
        <h2 className="text-2xl text-center md:text-3xl font-semibold text-gray-600 mb-4">
          No products found for "{searchTerm}"
        </h2>
        <NoProductsFoundIllustration />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between  mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 ">
          Search results for "{searchTerm}"
          <p className="text-gray-600 text-sm">
            {metadata?.totalDocuments} product
            {metadata?.totalDocuments === 1 ? "" : "s"} found
          </p>
        </h2>

        <div className="text-sm absolute right-0  top-20 md:relative md:top-0">
          <label htmlFor="sort" className="mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={`${sortBy},${sortOrder}`}
            onChange={handleSortChange}
            className="border border-gray-300 rounded px-1 py-1 focus:outline-none"
          >
            <option value="createdAt,-1">Relevance</option>
            <option value="discountPrice,1">Price: Low to High</option>
            <option value="discountPrice,-1">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap sm:justify-start sm:gap-0 gap-2 mb-4 justify-between">
        {fetchedProducts.map((product) => (
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} className="m-0" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
