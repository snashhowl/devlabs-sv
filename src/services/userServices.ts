import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envs";

export const registerUserService = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return { message: "User created" };
};

export const loginUserService = async (email: string, password: any) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Wrong credentials.");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Wrong credentials.");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
    expiresIn: "1h",
  });
  return { token };
};

export const verifyTokenService = async (token: string): Promise<boolean> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return !!decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};
