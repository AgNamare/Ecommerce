import React from "react";
import { Check } from "lucide-react"; // Importing the tick icon from Lucide
import { Link } from "react-router-dom";

const Stepper = ({ heading, steps, activeStep, doneSteps, to }) => {
  return (
    <div className="w-full">
      <ol className="flex items-center justify-between p-2 sm:p-3 md:p-4 text-xs font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 sm:text-base sm:space-x-8 md:text-lg md:space-x-10 rtl:space-x-reverse">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-center ${
              activeStep === index ? "font-semibold" : ""
            }`}
          >
            <Link to={to[index]} className="flex items-center">
              <span
                className={`flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 me-2 text-xs  border-gray-500 rounded-full shrink-0 dark:border-gray-400 ${
                  doneSteps && doneSteps.includes(index)
                    ? "bg-secondary text-white font-bold"
                    : activeStep === index
                    ? "bg-transparent"
                    : "bg-gray-200" // Background color for not active step
                }`}
              >
                {/* Displaying tick icon if the step is marked as done */}
                {doneSteps && doneSteps.includes(index) ? (
                  <Check size={14} color="#fff" strokeWidth={4} />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={`${ 
                  doneSteps && doneSteps.includes(index) ? "text-primary" : ""
                }`}
              >
                {/* Conditionally rendering the step label */}
                {step.label.replace("Details", "")}
              </span>
            </Link>
            {index < steps.length - 1 && (
              <svg
                className="w-2 h-2 sm:w-4 sm:h-4 ms-2 sm:ms-4 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
