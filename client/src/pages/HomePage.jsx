import React, { Suspense, lazy, useState, useEffect } from "react";
import { useGetProducts } from "@/api/ProductApi";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import SkeletonBanner from "@/components/skeletons/SkeletonBanner";
import ProductGroupSkeleton from "../components/skeletons/ProductGroupSkeleton";

const ProductGroup = lazy(() => import("@/components/ProductGroup"));
const BannerGroup = lazy(() => import("@/components/BannerGroup"));
const CircleLink = lazy(() => import("@/components/CircleLink"));

const HomePage = () => {
  const { selectedBranch } = useSelector((state) => state.branch);
  const { accessToken } = useSelector((state) => state.user);
  const branch = selectedBranch?.id || "6685508b50bbcc94fe606925";
  const { products, metadata, isProductsLoading } = useGetProducts(branch);
  const { products: peoplesChoiceProducts, isLoading: isLoadingPeoplesChoice } =
    useGetProducts(branch, "Farmers Choice");

  // State to track window width for mobile/desktop view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Update when window width is below 768px
    };

    // Initial check
    handleResize();

    // Add event listener to track window resizing
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const desktopBanners = [
    "https://cdnprod.mafretailproxy.com/assets/images/1232x280_2x_814e5fd63c_b3fee0b419.jpg",
    "https://cdnprod.mafretailproxy.com/assets/images/Artboard_2_fe33987a10.png",
  ];

  const mobileBanners = [
    "https://cdnprod.mafretailproxy.com/assets/images/343x110_2x_4604d4a36d.png",
    "https://cdnprod.mafretailproxy.com/assets/images/MY_CLUB_FESTIVAL_MOBILE_1_4482bf46b0.gif",
  ];

  // Select banners based on whether it's mobile or desktop
  const banners = isMobile ? mobileBanners : desktopBanners;

  const adverts = [
    {
      name: "Mobile Phones",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_1_07bd7246d5.jpg",
    },
    {
      name: "TVs",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_2_21b8f48a7d.jpg",
    },
    {
      name: "Small Appliances",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_3_e2a9dbff72.jpg",
    },
    {
      name: "Large Appliances",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_4_6518feb662.jpg",
    },
    {
      name: "Laptops",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_6_c849e4a661.jpg",
    },
    {
      name: "Home Cinema & Audio",
      img: "https://cdnprod.mafretailproxy.com/assets/images/NF_Category_9_25093ef6aa.jpg",
    },
  ];
  const Farmdverts = [
    {
      name: "Fruits",
      img: "https://cdnprod.mafretailproxy.com/assets/images/Category_1_57c9b7911d.jpg",
    },
    {
      name: "Vegetables",
      img: "https://cdnprod.mafretailproxy.com/assets/images/Category_2_d7d54847a9.jpg",
    },
    {
      name: "Dairy & Eggs",
      img: "https://cdnprod.mafretailproxy.com/assets/images/Category_3_659c657e8e.jpg",
    },
    {
      name: "Meat & Poultry",
      img: "https://cdnprod.mafretailproxy.com/assets/images/Category_4_e41dfc2855.jpg",
    },
    {
      name: "Fish & Seafood",
      img: "https://cdnprod.mafretailproxy.com/assets/images/Category_5_2e0353acf4.jpg",
    },
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="w-full">
      {/* Banner Carousel */}
      <div className="mb-4 flex justify-center w-full lg:w-full">
        <Suspense fallback={<SkeletonBanner />}>
          <Slider {...settings} className="w-full">
            {banners.map((banner, index) => (
              <div key={index} className="w-full">
                <img
                  src={banner} // The src changes based on `isMobile`
                  alt={`Banner ${index + 1}`}
                  className="w-full h-auto md:h-64 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>
        </Suspense>
      </div>

      <div>
        <h2 className="text-primary font-bold text-2xl w-full text-center mb-4">
          Ready Set Shop
        </h2>
        <Suspense fallback={<ProductGroupSkeleton />}>
          <div className="grid sm:grid-cols-6 grid-cols-4 justify-center gap-8">
            <CircleLink
              src="https://cdnprod.mafretailproxy.com/assets/images/4_Meat_and_Poultry_b2ac17efaf.png"
              link="/category/fresh meat"
              alt="Nyama Fresh"
              title="Nyama Fresh"
            />
            <CircleLink
              src="https://cdnprod.mafretailproxy.com/assets/images/11_Cleaning_and_Household_ad418b1b70.png"
              link="/category/cleaning supplies"
              alt="Cleaning Supplies"
              title="Cleaning Supplies"
            />
            <CircleLink
              src="https://imgs.search.brave.com/EOR__1jmbm4yjs1au4L3XUTtYQNCi6nPFmMgSInOzpo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTY5/MzQ3MjAzL3Bob3Rv/L2JyZWFrZmFzdC1j/ZXJlYWwuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPU8yVXdx/dEJfaXBuSUFqSzd5/SV95Um5CN0I4eDhL/cXRHVlc1WkF2QjIy/b1E9"
              title="Cereals & Grains"
              alt="Cereals"
              link="/category/cereals & grains"
            />
            <CircleLink
              src="https://imgs.search.brave.com/b5k0LB_I21VMIV7LOCPTwzYHF6DpZf_vdMVvpAjgpro/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjU1/MTIzNTc0L3Bob3Rv/L3NvZnQtZHJpbmtz/LXNwbGFzaGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/aVpjYU1TRXV6eExS/eTJscG5VdzlOaG5U/Y09oWU5neEEzcG9C/YmpDc1NTYz0"
              title="Soft Drinks"
              link="/category/soft drinks"
            />
            <CircleLink
              src="https://imgs.search.brave.com/e1_a30ZLwQgjAuzB18ZQEg5WU2kRqisQDVAEuIeZGSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzkzLzMwLzc1/LzM2MF9GXzQ5MzMw/NzUxMF9SQVpadlRC/ZW1zeE82bGdETWJs/MEZaSDYxT3Y5ZExQ/ci5qcGc"
              title="Bakery"
              link="/category/Bakery"
            />
            <CircleLink
              src="https://imgs.search.brave.com/z1dlBNAv-DZ_4PhZv_4LSqIdCxaIuhrsx8-OnFfPTVc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vcGhvdG9z/L2Jyb2tlbi1jaG9j/b2xhdGUtYmFyLXBp/Y3R1cmUtaWQ5NDEx/MDg0NTI_az0yMCZt/PTk0MTEwODQ1MiZz/PTYxMng2MTImdz0w/Jmg9dGpBcVNjZUdL/MVoyM0VMRW9DOV8y/NzBkZXJGclZ6RG1D/WVRub0gyNlZsST0.jpeg"
              title="Confectionary"
              link="/category/confectionary"
            />
            <CircleLink
              src="https://imgs.search.brave.com/6urvB2DrrPDcalQ60v2Mh1lRt9PPkood7TkDQdlbELI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzAwLzk2Lzk5/LzM2MF9GXzIwMDk2/OTk5MF9CZGVLZFJv/QmtVTU91NkNIdEdY/b29hbzRtdVF3ZXU0/Zi5qcGc"
              alt="Fruits"
              title="Fruits"
              link="/category/fruits"
            />
            <CircleLink
              src="https://imgs.search.brave.com/TNqznHgBwuUWkO-ZTg3SOjvgorspvzqbbR8v2IScYKc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFQbFlndUNZY0wu/anBn"
              alt="Skin Care"
              title="Skin Care"
              link="/category/Skin Care"
            />
            <CircleLink
              src="https://imgs.search.brave.com/6qTBPdDoOxvJUETu5HbiKkUzBZd7w_gUY4kQ4V6Mk3A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFNYk80bTRCVUwu/anBn"
              title="Oral Care"
              link="/category/oral care"
            />
            <CircleLink
              src="https://imgs.search.brave.com/xEjG9UIJiAQ0XTCa_kD4pOHeAfqgv4RdJa8INJLguN4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ5/MjgyOTkwL3Bob3Rv/L2EtcGlsZS1vZi1n/bGF6ZWQtZG91Z2hu/dXRzLXdpdGgtc3By/aW5rbGVzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1ZN2xL/dG1KaWlxZGFlUjFR/ZUlIcE4wRDVHQURG/b19QbjdIbXhCVk5P/d2dZPQ"
              title="Pastries"
              link="/category/pastries"
            />
            <CircleLink
              src="https://imgs.search.brave.com/aYLw4QJELApaNvwD4N1nNXOHGDHuDOqZtaUJ__2TcH4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzU3LzMxLzA1/LzM2MF9GXzE1NzMx/MDU1NF9Id0Nvanhl/VW02QzJRN0ZKdHcy/UjM3Y3FZTWV3TkdY/VS5qcGc"
              title="Flours"
              link="/category/flours"
            />
            <CircleLink
              src="https://imgs.search.brave.com/wMopS-n_ho2UJ2NaUsES7mrWHliS2p3pGPD5UqydfwU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzk4Lzg4LzQz/LzM2MF9GXzk4ODg0/MzgyX1A3Zkd6VUQ4/MFpVWXIwRGFzUHQx/a1V2Tk5obm5qRll5/LmpwZw"
              title="Vegetables"
              link="/category/vegetables"
            />
          </div>
        </Suspense>
      </div>

      {/* Best Sellers */}
      <div className="mt-8 w-full">
        <h2 className="text-xl mb-4 font-bold">Best Sellers</h2>
        {isProductsLoading ? (
          <ProductGroupSkeleton />
        ) : (
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGroup products={products} />
          </Suspense>
        )}
      </div>

      <img
        src={
          isMobile
            ? "https://cdnprod.mafretailproxy.com/assets/images/MY_CLUB_FESTIVAL_MOBILE_1_4482bf46b0.gif"
            : "https://cdnprod.mafretailproxy.com/assets/images/Artboard_2_fe33987a10.png"
        }
        alt="Responsive Banner"
        className="w-full h-auto object-cover my-8"
        loading="lazy"
      />

      <div className="mt-8 w-full">
        <h2 className="text-xl mb-4 font-bold">Farmer's Choice</h2>
        {isLoadingPeoplesChoice ? (
          <ProductGroupSkeleton />
        ) : (
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGroup products={peoplesChoiceProducts} />
          </Suspense>
        )}
      </div>

      <img
        src={
          isMobile
            ? "https://retailmedia-static.azureedge.net/creativeassets-live/47891b0851deb136b99a42946e93bf58acd86004ab40ab028561fb04ba21b9cd.png"
            : "https://cdnprod.mafretailproxy.com/assets/images/Artboard_2_copy_0fb97f2709.png"
        }
        alt="Responsive Banner 2"
        className="w-full h-auto object-cover my-8"
        loading="lazy"
      />

      {/* Other Advertisements */}
      <div className="mt-8">
        <h2 className="text-xl mb-4 font-bold">Electronics</h2>
        <Suspense fallback={<SkeletonBanner />}>
          <BannerGroup banners={adverts} />
        </Suspense>
      </div>
      <div className="mt-8">
        <h2 className="text-xl mb-4 font-bold">Fresh From The Farm</h2>
        <Suspense fallback={<SkeletonBanner />}>
          <BannerGroup banners={Farmdverts} />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
