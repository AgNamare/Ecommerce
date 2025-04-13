import Branch from "../models/branch.model.js";

export const findNearestBranch = async (coordinates) => {
  const nearestBranch = await Branch.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: coordinates, // [longitude, latitude]
        },
        distanceField: "distance",
        spherical: true,
      },
    },
    { $sort: { distance: 1 } }, // Sort by distance, ascending
  ]);

  console.log("Nearest Branch:", nearestBranch);
  return nearestBranch.length > 0 ? nearestBranch[0] : null;
};
