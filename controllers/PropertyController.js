const PROPERTY = require("../models/property");

const createProperty = async (req, res) => {
  res.send("create property");
};

const getLandlordsProperties = async (req, res) => {
  res.send("get landlords property");
};

const updatePropertyAvailability = async (req, res) => {
  res.send("update property availability");
};

//find() // number of pages
const getAllProperties = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 12; // Number of properties per page
  const skip = (page - 1) * limit; // Calculate the number of properties to skip
  try {
    const filter = {
      availability: "available", // Filter for available properties // You can add more filters here based on query parameters if needed
    };
    if(location) {
        filter.location = { $regex: location, $options: "i"}; // Case-insensitive search for location
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
        properties 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAProperty = async (req, res) => {
  res.send("get a property");
};

module.exports = {
  createProperty,
  getLandlordsProperties,
  updatePropertyAvailability,
  getAllProperties,
  getAProperty,
};
