import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from "./Arrows";

export default function BannerGroup({ banners }) {
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
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : 5,
    slidesToScroll: 1,
    nextArrow: !isMobile ? <SampleNextArrow /> : null, // Pass null if isMobile is true
    prevArrow: !isMobile ? <SamplePrevArrow /> : null, // Pass null if isMobile is true
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full overflow-visible">
      <Slider {...settings} className="w-full">
        {banners.map((banner, index) => (
          <div key={index} className="relative">
            <Link to={`/category/${banner.name}`} className="block">
              <div
                className="w-[180px] md:w-[230px]"
                style={{
                  backgroundImage: `url(${banner.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "360px",
                  borderRadius: "0.5rem",
                  margin: "0 auto",
                  position: "relative",
                }}
                alt={`Banner ${index + 1}`}
              >
                <span
                  className="font-bold text-left"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    color: "black",
                    padding: "5px",
                  }}
                >
                  {banner.name}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
