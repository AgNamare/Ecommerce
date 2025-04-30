import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/SearchBar";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { logisticsTableConfig } from "@/config/tablesConfig"; // Define this configuration
import { CirclePlus, File, Truck } from "lucide-react"; // Adjust icons as needed
import { useGetLogistics } from "@/api/LogisticsApi";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

const LogisticsPage = () => {
  const [logistics, setLogistics] = useState([]);
  const [searchState, setSearchState] = useState({
    searchQuery: "",
    sortOption: "bestMatch",
  });

  const { logistics: data, isLoading, isError } = useGetLogistics(searchState);

  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        // Handle error case
        setLogistics([]);
      } else if (data) {
        // Update state with the fetched logistics
        setLogistics(data);
      }
    }
  }, [isLoading, data, isError]);

  const handleSearchQueryChange = (searchFormData) => {
    setSearchState((prev) => ({
      ...prev,
      searchQuery: searchFormData.searchQuery,
    }));
  };

  const handleSortOptionChange = (sortOption) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
    }));
  };

  return (
    <div>
      <div className="flex items-center w-full justify-between mb-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <p className="text-lg">Dashboard</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="text-lg">Logistics</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <SearchBar
            placeholder={"Search Logistics"}
            searchQuery={searchState.searchQuery}
            onSubmit={handleSearchQueryChange}
          />
        </div>
      </div>
      <div className="flex justify-between mx-1 mb-4">

        <Link to="/logistics/new">
          <div className="w-fit flex items-center border rounded-sm px-3 py-1 gap-2 cursor-pointer">
            <CirclePlus size={25} />
            Add New Vehicle
          </div>
        </Link>
      </div>

      {isLoading ? (
        <p><Loader/></p>
      ) : isError ? (
        <p>No logistics found</p>
      ) : (
        <>
          {logistics.length > 0 ? (
            <DataTable
              config={logisticsTableConfig} // Ensure this config matches the new data structure
              data={logistics}
              page="logistics"
            />
          ) : (
            <p>No logistics found</p>
          )}
        </>
      )}
    </div>
  );
};

export default LogisticsPage;
