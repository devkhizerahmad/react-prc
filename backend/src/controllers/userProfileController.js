import { UserProfileService } from "../services/userProfileService.js";

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

export const updateUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const profileData = req.body;
    const result = await UserProfileService.upsertProfile(userId, profileData);
    return sendResponse(res, 200, true, "Profile updated successfully", result);
  } catch (error) {
    console.error("Controller - Update profile error:", error.message);
    return handleError(res, error, "Failed to update profile");
  }
};

// Complete user profile (Initial profile creation)
export const completeUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const profileData = req.body;
    // Using upsert logic for completion
    const result = await UserProfileService.upsertProfile(userId, profileData);
    return sendResponse(
      res,
      201,
      true,
      "Profile completed successfully",
      result
    );
  } catch (error) {
    console.error("Controller - Complete profile error:", error.message);
    return handleError(res, error, "Failed to complete profile");
  }
};

// Helper for error handling to avoid duplication
const handleError = (res, error, defaultMessage) => {
  if (error.message === "User not found" || error.message.includes("not found")) {
    return sendResponse(res, 404, false, error.message);
  }

  if (
    error.message.includes("must be less than") ||
    error.message.includes("valid avatar URL") ||
    error.message.includes("cannot be in the future") ||
    error.message.includes("seems invalid")
  ) {
    return sendResponse(res, 400, false, error.message);
  }

  return sendResponse(res, 500, false, defaultMessage, null, error.message);
};

// Get user's own profile
export const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const result = await UserProfileService.getProfileByUserId(userId);
    return sendResponse(res, 200, true, "Profile fetched successfully", result);
  } catch (error) {
    console.error("Controller - Get profile error:", error.message);

    if (error.message === "Profile not found") {
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

// Get public profile by user ID
export const getPublicProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const result = await UserProfileService.getPublicProfileByUserId(userId);
    return sendResponse(
      res,
      200,
      true,
      "Public profile fetched successfully",
      result
    );
  } catch (error) {
    console.error("Controller - Get public profile error:", error.message);

    if (error.message.includes("not found")) {
      return sendResponse(res, 404, false, error.message);
    }

    return sendResponse(
      res,
      500,
      false,
      "Failed to fetch public profile",
      null,
      error.message
    );
  }
};
