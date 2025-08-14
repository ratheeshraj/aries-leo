const mongoose = require("mongoose");
const { productSchema } = require("../models/productModel");
const { inventorySchema } = require("../models/inventoryModel");
const { categorySchema } = require("../models/categoryModel");
const { discountSchema } = require("../models/discountModel");

const connectDB = async () => {
  let defaultConn, bbifyConn;
  try {
    // Default DB Connection
    defaultConn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${defaultConn.connection.host}`);

    // BBIngrateDB Connection
    const bbifyUri =
      "mongodb+srv://super-admin:*DB56nC%3Ecgg7%3EGGu@bbify.ge61eao.mongodb.net/bbify?retryWrites=true&w=majority";
    bbifyConn = await mongoose
      .createConnection(bbifyUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .asPromise();
    console.log(`BBIngrateDB Connected: ${bbifyConn.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  return { defaultConn, bbifyConn };
};

let bbifyProductModel;
let bbifyInventoryModel;
let bbifyCategoryModel;
let bbifyDiscountModel;

const initializeConnections = async () => {
  const connections = await connectDB();
  bbifyInventoryModel = connections.bbifyConn.model(
    "inventories",
    inventorySchema
  );
  bbifyProductModel = connections.bbifyConn.model("products", productSchema);
  bbifyCategoryModel = connections.bbifyConn.model(
    "categories",
    categorySchema
  );
  bbifyDiscountModel = connections.bbifyConn.model("discounts", discountSchema);
};

const getBbifyInventoryModel = () => bbifyInventoryModel;
const getBbifyProductModel = () => bbifyProductModel;
const getBbifyCategoryModel = () => bbifyCategoryModel;
const getBbifyDiscountModel = () => bbifyDiscountModel;

module.exports = {
  initializeConnections,
  getBbifyProductModel,
  getBbifyInventoryModel,
  getBbifyCategoryModel,
  getBbifyDiscountModel,
};
