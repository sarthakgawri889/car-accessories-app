import User from "../model/User.js";

export const addUser = async (req, res) => {
  try {
    const {
      sub,
      email,
      nickname,
      picture,
      given_name,
      family_name,
      name,
      email_verified,
      locale,
    } = req.body;
    const exist = await User.findOne({ sub });

    if (exist) {
      res.status(200).json({ msg: "User already exists" });
      return;
    }

    const newUser = new User({
      sub,
      email,
      nickname,
      picture,
      given_name,
      family_name,
      name,
      email_verified,
      locale,
    });

    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Debugging: Log the error
    return res.status(500).json(error.message);
  }
};