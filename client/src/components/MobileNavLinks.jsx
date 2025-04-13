import { Link } from 'react-router-dom';

const MobileNavLinks = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Link to="/" className="text-gray-800 hover:bg-gray-200 p-2 rounded-md text-sm">Home</Link>
      <Link to="/orders" className="text-gray-800 hover:bg-gray-200 p-2 rounded-md text-sm">Orders</Link>
      <Link to="/services" className="text-gray-800 hover:bg-gray-200 p-2 rounded-md text-sm">Services</Link>
      <Link to="/contact" className="text-gray-800 hover:bg-gray-200 p-2 rounded-md  text-sm">Contact</Link>
      <Link to="/shop" className="text-gray-800 hover:bg-gray-200 p-2 rounded-md text-sm">Shop</Link>
    </div>
  );
};

export default MobileNavLinks;
