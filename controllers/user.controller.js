const User = require("../models/user");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) { 
      return res.status(400).json({ success: false, message: "please enter email or password" })
    }
    
    const user = await User.findOne({ email: email }).select("password")
    
    if (!user)
      return res.status(404).json({
        success: false,
        message: "user does not exist",
      });

    if ((password !== user.password))
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    
     const token = await user.generateToken();
     
     const options = {
       expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
       httpOnly: true,
       sameSite: None
     };
     return res.status(200).cookie("token", token, options).json({
       success: true,
       user,
       token,
     });
  } catch (error) {
    console.error("Error fetching test series:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const CompanyUser = require("../models/user");

exports.createNewUser = async (req, res) => {
    try {
        const { username, role, phone, email, imageUrl, password } = req.body;

        // Check if all required fields are provided
        if (!username || !phone || !email || !imageUrl || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user already exists
        const existingUser = await CompanyUser.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

       

        // Create a new user
        const newUser = await CompanyUser.create({
            username,
            role,
            phone,
            email,
            imageUrl,
            password,
        });

      

        res.status(201).json({
            success: true,
            message: "User created successfully",
           
        });
    } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



