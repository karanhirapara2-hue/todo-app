import User from "../models/user.model.js";

export const createuser = async (data) => {
  const user = await User.create(data);
  return user;
};

export const findUser = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

export const comparePassword = async (enteredPassword, user) => {
  return await user.comparePassword(enteredPassword);
}

export const uploadPhoto = async (userId, filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // update photo
    user.profilePicture = filePath;

    await user.save();

    return user;

  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserDetails = async (userId, updates) => {
  const { email, name } = updates;
  //console.log('Received updates:', updates);

  const user = await User.findById(userId).select('-password');;
  if (!user) {
    throw new Error("User not found");
  } 

  if (!email && !name) {
    throw new Error("No updates provided");
  }

  if (email) {
    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  return user;
};

export const getCurrentUserDetails = async (userId) => {
  //console.log('Fetching current user with ID:', userId);

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const setUserCredential = async (userId, credentialMail, credentialPassword) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error("User not found");
  }

  if (!credentialMail && !credentialPassword) {
    throw new Error("No credentials provided");
  }

  if (credentialMail) {
    user.credentialMail = credentialMail;
  }

  if (credentialPassword) {
    user.credentialPassword = credentialPassword;
  }

  await user.save();

  return user;
};
