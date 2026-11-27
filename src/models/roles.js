import Role from "./schemas/roles.js";

export async function getAllRoles() {
  return Role.find({}).lean();
}

export async function getRoleByName(name) {
  return Role.findOne({ name: name.toLowerCase() }).lean();
}

export async function createRole(name) {
  return Role.findOneAndUpdate(
    { name: name.toLowerCase() },
    { $setOnInsert: { name: name.toLowerCase() } },
    { upsert: true, new: true }
  );
}
