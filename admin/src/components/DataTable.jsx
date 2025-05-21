import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router DOM

const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle null or undefined dates

  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) return "Invalid Date";

  // Format the date as "MM/DD/YYYY"
  return date.toLocaleDateString();
};

const DataTable = ({ data, config, page }) => {
  // Check if data is available
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const { columns, order } = config;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100 rounded-md">
          <tr className=" mb-2">
            {/* Render table headers */}
            {order.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-black  uppercase tracking-wider"
              >
                {columns[header].label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Render table rows */}
          {data.map((product, index) => (
            <tr key={index}>
              {/* For each product, render table cells based on headers */}
              {order.map((header) => (
                <td key={header} className="px-4 py-1 whitespace-nowrap">
                  {/* Render cell content based on header */}
                  {header === "DOB"
                    ? formatDate(product[header])
                    : columns[header].render
                    ? columns[header].render(product[header])
                    : product[header]}
                </td>
              ))}
              {/* Make the entire row clickable with link to product detail page */}

              <td className="px-4 py-1 whitespace-nowrap">
                <Link
                  to={`/${page}/${product._id}`}
                  className="text-primary hover:underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
