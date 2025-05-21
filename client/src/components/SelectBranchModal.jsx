import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as per your project structure
import StoreSelection from "./StoreSelection";
import { useGetBranches } from "@/api/HomeApi";
import { setBranch } from "@/redux/branch/branchSlice";
import { useNavigate } from "react-router-dom";

export function SelectBranchModal({ onSave }) {
  const { branches: apiBranches, isLoadingBranches } = useGetBranches();
  const [branches, setBranches] = useState([]);

  const handleSelectBranch = (branch) => {
    onSave(branch);
  };

  useEffect(() => {
    // Update local state with API branches once they are loaded
    if (!isLoadingBranches && apiBranches.length > 0) {
      setBranches(apiBranches);
    }
  }, [apiBranches, isLoadingBranches]);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => console.log("Open modal")}>
        Select Branch
      </Button>

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-10">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">Select Branch</h2>
          </div>
          {/* StoreSelection component */}
          <StoreSelection
            branches={branches}
            onSelectBranch={handleSelectBranch}
          />
        </div>
      </div>
    </div>
  );
}
