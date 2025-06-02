const PROPERTY = require("../models/property");

const createProperty = async (req, res) => {
  res.send("create property");
};

const getLandlordsProperties = async (req, res) => {
  const { userId } = req.user; // Get the landlord's userId from the authenticated user
  const { page = 1} = req.query
  const skip = (page - 1) * limit
  const limit = 5
  try {
    const properties = await PROPERTY.find({ landlord: userId })
    .sort(-createAt)
    .skip(skip)
    .limit(limit)

    const [total, availableProperties, rentedProperties] = await Promise.all([
        PROPERTY.countDocuments({ landlord: userId }), // Get total number of properties for the landlord
        PROPERTY.countDocuments({ 
         landlord: userId, 
         availability: "available"
        }),
        PROPERTY.countDocuments({
         landlord: userId,
         availability: "rented"
      }),
    ])

    const totalPages = Math.ceil(total / limit); // Calculate total pages

    res.status(200).json({
        total, 
        availableProperties, 
        rentedProperties, 
        properties, 
        currentPages:parseInt(page), 
        totalPages
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};

const updatePropertyAvailability = async (req, res) => {
    const { propertyId } = req.params; // Get the property ID from the request parameters
    const { availability } = req.body; // Get the new availability status from the request body
    if (!availability || !["available", "rented"].includes(availability)) {
        return res.status(400).json({ message: "Provide availabity" });
    }
    try {
        const property = await PROPERTY.findById(propertyId);
        property.availability = availability; // Update the availability status
        await property.save(); // Save the updated property

        res.status(200).json({ 
            success: true, 
            message: "Property availability updated", 
            property 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//find() // number of pages
const getAllProperties = async (req, res) => {
  const { page = 1, location, budget, type} = req.query;
  const limit = 12; // Number of properties per page
  const skip = (page - 1) * limit; // Calculate the number of properties to skip
  try {
    const filter = {
      availability: "available", // Filter for available properties // You can add more filters here based on query parameters if needed
    };
    if(location) {
        filter.location = { $regex: location, $options: "i"}; // Case-insensitive search for location
    } if (budget) {
        filter.price = {$lte: parseInt(budget)}; // Filter properties with price less than or equal to budget
    } if (type) {
        filter.title = { $regex: type, $options: "i" }; // Case-insensitive search for property type in title
    }
    
    const properties = await PROPERTY.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const totalProperties = await PROPERTY.countDocuments(filter); // Get total number of properties
    const totalPages = Math.ceil(totalProperties / limit); // calculate total pages

    res
    .status(200)
    .json({ 
       num: properties.length,
        totalPages, 
        currentPages:parseInt(page),  
        properties,
        totalProperties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAProperty = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const property = await PROPERTY.findById(propertyId).populate("landlord", "fullName profilePicture phoneNumber email"); // Populate landlord details 

        // more from landlord
        const moreFromLandlord = await PROPERTY.find({
            landlord: property.landlord._id, // Find properties by the same landlord
            _id: { $ne: propertyId }, // Exclude the current property
            availability: "available", // Only available properties
        })
        .limit(3)
        .sort("-createAt"); // Limit to 3 more properties

        // similar price range 20% of the properties price
        // 1000 800 - 1200
        const priceRange = property.price * 0.2; // 20% of the property price
        const similarProperties = await PROPERTY.find({
            _id: { $ne: propertyId }, // Exclude the current property
            availability: "available", // Only available properties
            price: {
                $gte: property.price - priceRange, // Minimum price
                $lte: property.price + priceRange, // Maximum price
            },
            location: property.location, // Same location
        }).limit(3).sort("-createAt"); // Limit to 3 similar properties 

        res.status(200).json({ property, moreFromLandlord, similarProperties });

        res.status(200).json({ property, moreFromLandlord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createProperty,
  getLandlordsProperties,
  updatePropertyAvailability,
  getAllProperties,
  getAProperty,
};
