import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Channel from "../../models/Channel.js";
import User from "../../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const postRegister = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(409).send("Email already in use");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newChannel = await Channel.create({})

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      channel:newChannel._id
    });

    const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      userDetails: { username, email, token: token },
    });
  } catch (error) {
    res.status(500).json("Something went wrong. Please try again");
  }
};
