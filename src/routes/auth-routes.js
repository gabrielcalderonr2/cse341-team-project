import { Router } from "express";
import {
    registerPage,
    registerUser,
    loginPage,
    loginUser,
    logoutUser,
} from "../controllers/auth.js";

const router = Router();

// Registration
router.get("/register", registerPage);
router.post("/register", registerUser);

// Login
router.get("/login", loginPage);
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

export default router;