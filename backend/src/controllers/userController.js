import { UserService } from "../services/userService.js";

// Controller response handler
const sendResponse = (
  res,
  status,
  success,
  message,
  data = null,
  error = null
) => {
  const response = { success, message };
  if (data) response.data = data;
  if (error && process.env.NODE_ENV === "development") response.error = error;

  return res.status(status).json(response);
};

// Sign up a new user
export const signup = async (req, res) => {
  try {
    const userData = req.body;
    const result = await UserService.createUser(userData);
    return sendResponse(res, 201, true, "User registered successfully", result);
  } catch (error) {
    console.error("Controller - Signup error:", error.message);

    if (error.message.includes("exists")) {
      return sendResponse(res, 409, false, error.message);
    }

    if (
      error.message.includes("must be at least") ||
      error.message.includes("Valid email")
    ) {
      return sendResponse(res, 400, false, error.message);
    }

    return sendResponse(
      res,
      500,
      false,
      "Failed to register user",
      null,
      error.message
    );
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.authenticateUser(email, password);
    return sendResponse(res, 200, true, "Login successful", result);
  } catch (error) {
    console.error("Controlle - Login error:", error.message);

    if (error.message === "Invalid credentials") {
      return sendResponse(res, 401, false, error.message);
    }

    if (
      error.message.includes("must be at least") ||
      error.message.includes("Valid email")
    ) {
      return sendResponse(res, 400, false, error.message);
    }

    return sendResponse(res, 500, false, "Login failed", null, error.message);
  }
};

// Get all users (protected route)
export const getAllUsers = async (req, res) => {
  try {
    const result = await UserService.getAllUsers();
    return sendResponse(res, 200, true, "Users fetched successfully", result);
  } catch (error) {
    console.error("Controller - Get all users error:", error.message);
    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch users",
      null,
      error.message
    );
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    return sendResponse(res, 200, true, "User fetched successfully", { user });
  } catch (error) {
    console.error("Controller - Get user by ID error:", error.message);

    if (error.message === "User not found") {
      return sendResponse(res, 404, false, error.message);
    }

    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch user",
      null,
      error.message
    );
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserService.getUserByEmail(email);
    return sendResponse(res, 200, true, "User fetched successfully", { user });
  } catch (error) {
    console.error("Controller - Get user by email error:", error.message);

    if (error.message === "User not found") {
      return sendResponse(res, 404, false, error.message);
    }

    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch user",
      null,
      error.message
    );
  }
};

// Get current authenticated user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await UserService.getUserProfile(req.user.id);
    return sendResponse(res, 200, true, "Profile fetched successfully", {
      user,
    });
  } catch (error) {
    console.error("Controller - Get profile error:", error.message);

    if (error.message === "User not found") {
      return sendResponse(res, 404, false, error.message);
    }

    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch profile",
      null,
      error.message
    );
  }
};
