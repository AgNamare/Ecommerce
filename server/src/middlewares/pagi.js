export function constructSearchQuery(searchQuery, searchFields) {
  // Construct query to search in specified fields
  const regexQuery = { $regex: "\\b" + searchQuery + "\\b", $options: "i" }; // Use word boundary and case-insensitive matching
  const searchQueryObject = {};
  searchFields.forEach((field) => {
    searchQueryObject[field] = regexQuery;
  });
  console.log("Search query object:", searchQueryObject);
  return searchQueryObject;
}

export function pagination(model, query = {}, options = {}) {
  return async (req, res, next) => {
    try {
      console.log("Pagination request received:", req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || options.limit || 10;
      const searchQuery = req.query.searchQuery || "";
      const sortOption = req.query.sortOption || "newest";
      const searchFields = options.searchFields || []; // Added line to accept search fields
      console.log("Search fields:", searchFields);

      // Ensure page is at least 1
      if (page < 1) {
        return res.status(404).json({ message: "Invalid page request" });
      }

      const startIndex = Math.max(page - 1, 0) * limit;

      const results = {
        metadata: {
          page,
          limit,
        },
      };

      let countFilter = { ...query };
      if (searchQuery) {
        countFilter = {
          ...countFilter,
          ...constructSearchQuery(searchQuery, searchFields),
        };
      }

      console.log("Count Filter: ", countFilter);

      const totalCount = await model.countDocuments(countFilter).exec();
      console.log("Total count:", totalCount);

      results.metadata.totalCount = totalCount;
      results.metadata.totalPages = Math.ceil(totalCount / limit);
      console.log("Total pages:", results.metadata.totalPages);

      if (startIndex >= totalCount) {
        console.log("Invalid page request:", page);
        return res.status(404).json({ message: "No such page exists" });
      }

      let queryBuilder = searchQuery
        ? model.find({
            ...query,
            ...constructSearchQuery(searchQuery, searchFields),
          }) // Using constructSearchQuery function
        : model.find(query);

      if (sortOption === "newest") {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      } else if (sortOption === "oldest") {
        queryBuilder = queryBuilder.sort({ createdAt: 1 });
      } else if (
        sortOption === "bestmatch" &&
        searchFields.includes("productName")
      ) {
        queryBuilder = queryBuilder.sort({ productName: 1 });
      }

      queryBuilder = queryBuilder.skip(startIndex).limit(limit);

      results.results = await queryBuilder.exec();
      console.log("Results:", results.results);

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

      console.log("Pagination results:", results);
      res.paginatedResults = results;
      next();
    } catch (error) {
      console.log("Error in pagination:", error.message);
      res.status(500).json({ message: error.message });
    }
  };
}
