import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation()
  // Scroll to the top when the layout mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-300 font-lato overflow-x-hidden">
      <Navbar />
      <main className="flex-grow max-w-full min-h-[80vh] md:mt-24 lg:mx-12 sm:mx-2 mx-1 mt-14">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
