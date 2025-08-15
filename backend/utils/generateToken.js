const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  console.log("Generating token for user:", id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
};

module.exports = generateToken;
