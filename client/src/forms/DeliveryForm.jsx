import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const DeliveryForm = ({ onSubmit }) => {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);

  const autocompleteRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const formattedAddress = place.formatted_address;
        const location = place.geometry.location;

        setSelectedPlace(formattedAddress);
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        setValue("address", formattedAddress);
        setValue("latitude", location.lat()); // Store latitude
        setValue("longitude", location.lng()); // Store longitude

        // Extracting city from the address components
        const addressComponents = place.address_components;
        const cityComponent = addressComponents.find((component) =>
          component.types.includes("locality")
        );

        if (cityComponent) {
          setValue("city", cityComponent.long_name); // Autofill city
        }

        if (map) {
          map.panTo(location);
        }
      } else {
        console.error("Place has no geometry:", place);
      }
    }
  };

  const libraries = ["places"];

  return (
    <div className="z-20">
      <h1>Delivery Information</h1>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <div className="mb-2 mt-4">
          <div>
            <h3 className="mb-1 text-black">Search for your Address</h3>
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                id="address"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                placeholder="Search for your address"
                className="w-full bg-[#D9D9D9] rounded-full px-4 py-2 focus:outline-none"
              />
            </Autocomplete>
          </div>
        </div>

        <GoogleMap
          id="map"
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={12}
          center={markerPosition || { lat: -34.397, lng: 150.644 }}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
          <input {...register("latitude")} type="hidden" />
          <input {...register("longitude")} type="hidden" />
          <div className="mb-2">
            <h3 className="mb-1 text-black">Building</h3>
            <input
              {...register("building")}
              type="text"
              id="building"
              placeholder="Building"
              className="w-full bg-[#D9D9D9] rounded-full px-4 py-2 focus:outline-none"
            />
          </div>

          <div className="mb-2">
            <div>
              <h3 className="mb-1 text-black">City</h3>
              <input
                {...register("city")}
                type="text"
                id="city"
                placeholder="City"
                readOnly
                className="w-full bg-[#D9D9D9] rounded-full px-4 py-2 focus:outline-none text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mb-2">
            <div>
              <h3 className="mb-1 text-black">Apartment No./Office Name</h3>
              <input
                {...register("apartment")}
                type="text"
                id="apartment"
                placeholder="Apartment No./Office Name"
                className="w-full bg-[#D9D9D9] rounded-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-2">
            <div>
              <h3 className="mb-1 text-black">Contact Number</h3>
              <input
                {...register("contactNumber", {
                  required: "Contact Number is required",
                })}
                type="text"
                id="contactNumber"
                placeholder="Contact Number"
                className="w-full bg-[#D9D9D9] rounded-full px-4 py-2 focus:outline-none"
              />
            </div>
            {errors.contactNumber && <p>{errors.contactNumber.message}</p>}
          </div>

          <div className="mb-2">
            <div>
              <h3 className="mb-1 text-black">Delivery Instructions</h3>
              <textarea
                {...register("instructions")}
                id="instructions"
                placeholder="Delivery Instructions"
                className="w-full bg-[#D9D9D9] rounded-lg px-4 py-2 focus:outline-none"
              ></textarea>
            </div>
            {errors.instructions && <p>{errors.instructions.message}</p>}
          </div>

          <div className="mb-2">
            <div>
              <h3 className="mb-1 text-black">Address Type</h3>
              <div className="mb-4">
                <div className="flex items-center">
                  <label className="inline-flex items-center mr-4">
                    <input
                      {...register("addressType", {
                        required: "Address Type is required",
                      })}
                      type="radio"
                      value="home"
                      className="form-radio h-5 w-5 text-[#E61927]"
                    />
                    <span className="ml-2">Home</span>
                  </label>
                  <label className="inline-flex items-center mr-4">
                    <input
                      {...register("addressType", {
                        required: "Address Type is required",
                      })}
                      type="radio"
                      value="work"
                      className="form-radio h-5 w-5 text-[# E61927]"
                    />
                    <span className="ml-2">Work</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      {...register("addressType", {
                        required: "Address Type is required",
                      })}
                      type="radio"
                      value="other"
                      className="form-radio h-5 w-5 text-[#E61927]"
                    />
                    <span className="ml-2">Other</span>
                  </label>
                </div>
                {errors.addressType && (
                  <p className="text-red-500">{errors.addressType.message}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary w-full hover:bg-[#194A3490] text-white py-2 px-4 rounded-full focus:outline-none"
          >
            Save Details
          </button>
        </form>
      </LoadScript>
    </div>
  );
};

export default DeliveryForm;
