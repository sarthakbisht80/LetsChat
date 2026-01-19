import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js"; // Importing the User model
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for token generation

export async function signup(req, res) {
  const { email, password, fullName } = req.body; // getting the values from the request body

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists please use diffrenet  account" });
    }
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; // Random avatar URL

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar, // Assigning the random avatar URL
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for${newUser.fullName}`);
    } catch (error) {
      console.log("error creating the stream", error);
    }

    const token = jwt.sign(
      {
        userID: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookies
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Login Function   user click login btn=>  triggerReq=> req to api/auth/login=> check credentials
// if valid=> genreate JWT token and send it back to the client..
export async function login(req, res) {
  try {
    const { email, password } = req.body; // getting the values from the request body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        userID: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookies
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error duuring login:", error.message);
    console.log("cant login")
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//logut funciton
export function logout(req, res) {
  res.clearCookie("jwt");

  res.status(200).json({ message: "Logged out successfully", success: true });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onbaording for ${updatedUser.fullName}`);
    } catch (streamError) {
        console.log("Error updating Stream user during onboarding:", streamError);

    }
    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
