const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
    },

    // ✅ password Google users ke liye optional hona chahiye
    password: {
      type: String,
      required: false,
      default: null,
    },

    // ✅ provider identify karega signup kis tarike se hua
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    // ✅ googleId store karna important hai
    googleId: {
      type: String,
      default: null,
    },

    // optional: google profile image
    profileImage: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,

    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
