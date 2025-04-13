export function pagination(
  model,
  query = {},
  options = {},
  searchFields = [],
  populateFields = []
) {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; 
      const searchQuery = req.query.searchQuery || "";
      const sortOption = req.query.sortOption || "newest";

      const startIndex = (page - 1) * limit;

      const results = {
        metadata: {
          page,
          limit,
        },
      };

      // Construct an array of search conditions for each specified field
      const searchConditions = [];
      if (searchQuery && searchFields.length > 0) {
        searchFields.forEach((field) => {
          const condition = {};
          condition[field] = { $regex: searchQuery, $options: "i" };
          searchConditions.push(condition);
        });
      }

      // Create the $or query for searching multiple fields
      const countFilter =
        searchConditions.length > 0 ? { $or: searchConditions } : query;

      // If limit is undefined, fetch all documents
      if (limit) {
        const totalCount = await model.countDocuments(countFilter).exec();
        results.metadata.totalCount = totalCount;
        results.metadata.totalPages = Math.ceil(totalCount / limit);

        if (startIndex >= totalCount) {
          return res.status(404).json({ message: "No such page exists" });
        }

        let queryBuilder =
          searchConditions.length > 0
            ? model.find({ $or: searchConditions })
            : model.find(query);

        if (populateFields.length > 0) {
          populateFields.forEach((field) => {
            queryBuilder = queryBuilder.populate(field);
          });
        }

        if (sortOption === "newest") {
          queryBuilder = queryBuilder.sort({ createdAt: -1 });
        } else if (sortOption === "oldest") {
          queryBuilder = queryBuilder.sort({ createdAt: 1 });
        } else if (sortOption === "bestmatch") {
          // Example sorting for demonstration, modify as needed
          queryBuilder = queryBuilder.sort({ name: 1 });
        }

        queryBuilder = queryBuilder.skip(startIndex).limit(limit);

        results.results = await queryBuilder.exec();

        if (startIndex + limit < totalCount) {
          results.next = {
            page: page + 1,
            limit,
          };
        }

        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit,
          };
        }
      } else {
        // If limit is undefined, fetch all documents
        let queryBuilder = model
          .find(countFilter)
          .sort(getSortOptions(sortOption));
        if (populateFields.length > 0) {
          populateFields.forEach((field) => {
            queryBuilder = queryBuilder.populate(field);
          });
        }
        results.results = await queryBuilder.exec();
      }

      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
// Helper function to handle sorting options
function getSortOptions(sortOption) {
  switch (sortOption) {
    case "newest":
      return { createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "bestmatch":
      return { productName: 1 }; // Example sorting, adjust as needed
    default:
      return {};
  }
}
