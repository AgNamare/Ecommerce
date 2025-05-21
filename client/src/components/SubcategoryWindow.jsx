import { Link } from "react-router-dom";

const SubcategoryWindow = ({ groups }) => {
  return (
    <div className="fixed inset-x-0 min-h-[40%] mt-1 p-3 bg-white border border-gray-200 shadow-lg z-20">
      <div>
        {groups.map((group) => (
          <div key={group.title} className="mb-2">
            <h4 className="text-md mb-2">
              <span className="text-sm cursor-default">{group.title}</span>
            </h4>
            <ul className="list-none p-0">
              {group.subcategories.map((subcategory) => (
                <li key={subcategory.id} className="mb-1">
                  <Link
                    to={`/category/${subcategory.link}`}
                    className="block text-sm font-normal text-gray-500"
                  >
                    {subcategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryWindow;
