const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a Name"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["teacher", "admin", "course-incharge"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a Phone Number"],
    unique: [true, "Mobile number already exists"],
  },
  email: {
    type: String,
    required: [true, "Please enter a Email"],
    unique: [true, "Email already exists"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please enter a Image Url"],
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  requests:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
  }]
});
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.methods.matchPassword = async function (password) {
//   console.log(password + "  " + this.password);
//   return await bcrypt.compare(password, this.password);
// };

userSchema.methods.generateToken = async function () {
  console.log(process.env.JWT_SECRET);
  return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("CompanyUser", userSchema);
