const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { assignAndSendOtp } = require("../utils/otpService");

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists before trying to match password
    if (!user) {
      res.status(401);
      console.log("User not found with email:", email);
      throw new Error("Invalid email or password");
    }

    // Debug password comparison
    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      if (!user.isVerified) {
        await assignAndSendOtp(user);
        res.status(200).json({ requiresOtp: true, email: user.email });
        return;
      }
    }

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      console.log("Invalid email or password");
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(req.body, "aaaaa");
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({
      name,
      email,
      password,
      phone,
      otp,
      otpExpires,
    });

    await assignAndSendOtp(user);
    if (user) {
      res.status(201).json({
        message: "OTP sent to your email. Please verify before logging in.",
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }
    if (user.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
    if (Date.now() > user.otpExpires) {
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    await assignAndSendOtp(user);

    res.json({ message: "OTP resent to your email." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        isVerified: user.isVerified,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      // Handle password update with old password verification
      // Support both 'oldPassword' and 'currentPassword' field names for frontend compatibility
      const oldPassword = req.body.oldPassword || req.body.currentPassword;
      const newPassword = req.body.newPassword;

      if (oldPassword && newPassword) {
        // Verify old password matches
        const isOldPasswordValid = await user.matchPassword(oldPassword);

        if (!isOldPasswordValid) {
          res.status(400);
          throw new Error("Current password is incorrect");
        }

        // Update to new password
        user.password = newPassword;
      } else if (oldPassword || newPassword) {
        // If only one password field is provided, throw an error
        res.status(400);
        throw new Error(
          "Both current password and new password are required for password update"
        );
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    // Use the correct status code from the response or default to 500
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Add user address
// @route   POST /api/auth/address
// @access  Private
const addUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { street, city, state, postalCode, country } = req.body;

    if (user) {
      const address = {
        street,
        city,
        state,
        postalCode,
        country: country || "India",
      };

      user.addresses.push(address);
      await user.save();

      res.status(201).json(user.addresses);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete user address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
const deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { addressId } = req.params;

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Find the address index using the _id
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      res.status(404);
      throw new Error("Address not found");
    }

    // Remove the address from the array
    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  deleteUserAddress,
  verifyOtp,
  resendOtp,
};
