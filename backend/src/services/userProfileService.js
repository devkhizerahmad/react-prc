import { prisma } from "../lib/prisma.js";

// Helper function to sanitize user data (remove password and sensitive information)
const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Input validation functions
const validateBio = (bio) => {
  if (bio && bio.length > 500) {
    throw new Error("Bio must be less than 500 characters");
  }
  return true;
};

const validateAvatar = (avatar) => {
  if (avatar) {
    const avatarRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!avatarRegex.test(avatar)) {
      throw new Error("Please provide a valid avatar URL");
    }
  }
  return true;
};

const validateDateOfBirth = (dateOfBirth) => {
  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    if (dob > today) {
      throw new Error("Date of birth cannot be in the future");
    }
    // Also check if the date is not too far in the past (before 1900)
    if (dob.getFullYear() < 1900) {
      throw new Error("Date of birth seems invalid");
    }
  }
  return true;
};

// UserProfile Service - Business Logic Layer
export class UserProfileService {
  // Validate profile input data
  static validateProfileData(data) {
    const errors = [];

    if (data.bio) {
      try {
        validateBio(data.bio);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (data.avatar) {
      try {
        validateAvatar(data.avatar);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (data.dateOfBirth) {
      try {
        validateDateOfBirth(data.dateOfBirth);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  // Create or Update user profile (Embedded in User model) using upsert
  static async upsertProfile(userId, profileData) {
    try {
      // Validate input
      this.validateProfileData(profileData);

      // Prepare the update/create data
      const data = {};
      if (profileData.bio !== undefined) data.bio = profileData.bio;
      if (profileData.avatar !== undefined) data.avatar = profileData.avatar;
      if (profileData.dateOfBirth !== undefined) {
        data.dateOfBirth = new Date(profileData.dateOfBirth);
      }

      data.updatedAt = new Date();

      // Use upsert to handle both creation (if somehow missing) and update
      // Since it's embedded in User model, we're upserting the User record
      const user = await prisma.user.upsert({
        where: { id: userId },
        update: data,
        create: {
          id: userId,
          // Mandatory fields for User model if record doesn't exist
          email: profileData.email || `user_${userId}@placeholder.com`,
          name: profileData.name || "New User",
          password: "placeholder_password_needs_reset",
          ...data
        }
      });

      return {
        profile: sanitizeUser(user),
      };
    } catch (error) {
      console.error(
        "UserProfileService - Upsert profile error:",
        error.message
      );
      throw error;
    }
  }

  // Deprecated: keeping updateProfile for backward compatibility but calling upsertProfile
  static async updateProfile(userId, profileData) {
    return this.upsertProfile(userId, profileData);
  }

  // Get profile by user ID (returns the user with profile fields)
  static async getProfileByUserId(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          avatar: true,
          dateOfBirth: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("Profile not found");
      }

      return {
        profile: sanitizeUser(user),
      };
    } catch (error) {
      console.error(
        "UserProfileService - Get profile by user ID error:",
        error.message
      );
      throw error;
    }
  }

  // Get public profile by user ID (limited information for public access)
  static async getPublicProfileByUserId(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          bio: true,
          avatar: true,
          dateOfBirth: false, // Don't expose date of birth publicly
          createdAt: true,
        },
      });

      if (!user) {
        throw new Error("Public profile not found");
      }

      return {
        profile: {
          id: user.id,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      console.error(
        "UserProfileService - Get public profile error:",
        error.message
      );
      throw error;
    }
  }
}
