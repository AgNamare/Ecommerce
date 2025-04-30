import React, { useEffect, useState } from "react";
import { useGetAllUsers } from "@/api/UserApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DataTable from "@/components/DataTable";
import PaginationSelector from "@/components/PaginationSelector";
import SearchBar from "@/components/SearchBar";
import SortOptionDropdown from "@/components/SortOptionDropdown";
import { userTableConfig } from "@/config/tablesConfig";
import { CirclePlus, File, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const UsersPage = () => {
  const [results, setResults] = useState({
    metadata: {
      page: 1,
      totalPages: 1,
    },
    results: [],
  });

  const [searchState, setSearchState] = useState({
    searchQuery: "",
    page: 1,
    sortOption: "bestMatch",
  });

  const { users, isLoading, is404Error } = useGetAllUsers(searchState);
  console.log(users);

  useEffect(() => {
    if (!isLoading) {
      if (is404Error) {
        // Handle 404 error case
        setResults({
          metadata: { page: 1, totalPages: 1 },
          results: [],
        });
      } else if (users) {
        // Update state with the fetched users
        setResults(users);
      }
    }
  }, [isLoading, users, is404Error]);

  const handleSearchQueryChange = (searchFormData) => {
    setSearchState((prev) => ({
      ...prev,
      searchQuery: searchFormData.searchQuery,
      page: 1,
    }));
  };

  const handleSortOptionChange = (sortOption) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
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
                <p className="text-lg">Users</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <SearchBar
            placeholder={"Search Users"}
            searchQuery={searchState.searchQuery}
            onSubmit={handleSearchQueryChange}
          />
        </div>
      </div>
      <div className="flex justify-between mx-1 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-fit flex items-center border rounded-sm px-3 py-1 gap-2 cursor-pointer">
            <File size={25} />
            Export
          </div>
          <SortOptionDropdown
            onChange={handleSortOptionChange}
            sortOption={searchState.sortOption}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : is404Error ? (
        <p>No users found</p>
      ) : (
        <>
          {results.results.length > 0 ? (
            <>
              <DataTable
                config={userTableConfig}
                data={results.results}
                page="users"
              />
              <PaginationSelector
                page={results.metadata.page}
                pages={results.metadata.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p>No users found</p>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
