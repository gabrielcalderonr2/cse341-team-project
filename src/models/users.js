import User from "./schemas/users.js";

export async function getAllUsers() {
  return User.find({})
    .select("-password")
    .populate("role", "name")
    .lean();
}

export async function getUserById(id) {
  return User.findById(id)
    .select("-password")
    .populate("role", "name")
    .lean();
}

export async function getUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() })
    .select("+password")
    .populate("role", "name");
}

export async function getUserByUsername(username) {
  return User.findOne({ username: username.toLowerCase() })
    .select("+password")
    .populate("role", "name");
}

export async function createUser(userData) {
  const user = new User(userData);
  return user.save();
}
