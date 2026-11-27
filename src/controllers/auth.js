import bcrypt from "bcrypt";
import {
  getUserByEmail,
  getUserByUsername,
  createUser,
} from "../models/users.js";
import { getRoleByName } from "../models/roles.js";

// Display registration page
export function registerPage(req, res) {
  return res.render("auth/register", {
    title: "Create Account",
    error: null,
  });
}

// Display login page
export function loginPage(req, res) {
  return res.render("auth/login", {
    title: "Login",
    error: null,
  });
}

// Register a new user
export async function registerUser(req, res, next) {
  try {
    const { displayName, username, email, password, confirmPassword } =
      req.body;

    if (
      !displayName?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).render("auth/register", {
        title: "Create Account",
        error: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).render("auth/register", {
        title: "Create Account",
        error: "Password must contain at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/register", {
        title: "Create Account",
        error: "Passwords do not match.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingEmail = await getUserByEmail(normalizedEmail);
    const existingUsername = await getUserByUsername(normalizedUsername);

    if (existingEmail || existingUsername) {
      return res.status(409).render("auth/register", {
        title: "Create Account",
        error: "Email or username is already registered.",
      });
    }

    const userRole = await getRoleByName("user");

    if (!userRole) {
      return res.status(500).render("auth/register", {
        title: "Create Account",
        error: "User role is not configured.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await createUser({
      displayName: displayName.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole._id,
    });

    return res.redirect("/auth/login");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).render("auth/register", {
        title: "Create Account",
        error: "Email or username is already registered.",
      });
    }

    return next(error);
  }
}

// Authenticate an existing user
export async function loginUser(req, res, next) {
  try {
    const { identifier, password } = req.body;

    if (!identifier?.trim() || !password) {
      return res.status(400).render("auth/login", {
        title: "Login",
        error: "Username/email and password are required.",
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = normalizedIdentifier.includes("@")
      ? await getUserByEmail(normalizedIdentifier)
      : await getUserByUsername(normalizedIdentifier);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render("auth/login", {
        title: "Login",
        error: "Invalid username/email or password.",
      });
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) {
          reject(error);
          return undefined;
        }

        req.session.user = {
          id: user._id.toString(),
          displayName: user.displayName,
          username: user.username,
          email: user.email,
          role: user.role.name,
        };

        req.session.save((saveError) => {
          if (saveError) {
            reject(saveError);
            return undefined;
          }

          resolve();
          return undefined;
        });

        return undefined;
      });
    });

    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

// Log out the current user
export function logoutUser(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
}
