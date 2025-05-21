import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import { SampleNextArrow, SamplePrevArrow } from "./Arrows";

export default function ProductGroup({ products }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // Adjust this breakpoint as necessary

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Set isMobile based on screen width
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Settings for react-slick
  const settings = {
    dots: true, // Enable dots for navigation
    infinite: false, // Disable infinite scroll
    speed: 500, // Transition speed
    slidesToShow: isMobile ? 2 : 6, // Adjust slides to show based on mobile
    slidesToScroll: 1, // Number of slides to scroll at a time
    centerMode: false, // Disable center mode
    nextArrow: !isMobile ? <SampleNextArrow /> : null, // Hide arrows on mobile
    prevArrow: !isMobile ? <SamplePrevArrow /> : null, // Hide arrows on mobile
    responsive: [
      {
        breakpoint: 1280, // Large screens (e.g., laptops/desktops)
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // Medium screens (e.g., tablets)
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Small screens (e.g., smaller tablets)
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // Extra small screens (e.g., mobile devices)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <Slider {...settings} className="w-full">
        {products.map((product, index) => (
          <div key={index} className="pr-2">
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
          </div>
        ))}
      </Slider>
    </div>
  );
}
