import { AspectRatio } from "@/components/ui/aspect-ratio";
import walmartLogo from "../assets/images/quickmart.png";
import { Instagram, Facebook, X, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <div className="bg-primary w-full md:p-8 p-4 flex flex-col justify-start md:flex-row md:gap-24 gap-4 mt-4 text-white">
      <div className="w-full md:w-1/5 flex flex-col text-white">
        <img src={walmartLogo} alt="Walmart Logo" className="w-28 h-fit" />
        <h3 className="text-sm capitalize">stay in touch with us</h3>
        <div className="flex flex-row gap-2 ">
          <Facebook color="#ffffff" />
          <Instagram color="#ffffff" />
          <X color="#ffffff" />
          <Youtube color="#ffffff" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-24 justify-between">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium underline">About Us</h3>
          <p className="text-sm">Corporation Governance</p>
          <p className="text-sm">Community</p>
          <p className="text-sm">Supplier Relation</p>
          <p className="text-sm">Branch Network</p>
          <p className="text-sm">Careers</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium underline">Customer Service</h3>
          <p className="text-sm">Co-operate policies</p>
          <p className="text-sm">Cookies Policy</p>
          <p className="text-sm">Privacy Policy</p>
          <p className="text-sm">Return Policy</p>
          <p className="text-sm">Talk To Us</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium underline">Customer Service</h3>
          <p className="text-sm">Co-operate policies</p>
          <p className="text-sm">Cookies Policy</p>
          <p className="text-sm">Privacy Policy</p>
          <p className="text-sm">Return Policy</p>
          <p className="text-sm">Talk To Us</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium underline">Customer Service</h3>
          <p className="text-sm">Co-operate policies</p>
          <p className="text-sm">Cookies Policy</p>
          <p className="text-sm">Privacy Policy</p>
          <p className="text-sm">Return Policy</p>
          <p className="text-sm">Talk To Us</p>
        </div>
      </div>
    </div>
  );
}
