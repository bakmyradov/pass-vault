import asyncHandler from "express-async-handler";
import Password from "../models/passwordsModel.js";
import User from "../models/userModel.js";
import { decryptWithKey, encryptWithKey } from "../utils/encryption.js";

// @desc    Add a new password
// @route   POST /api/passwords
// @access  Private
const addPassword = asyncHandler(async (req, res) => {
  const { service, username, plaintextPassword } = req.body;

  // Fetch the user
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Decrypt the master password
  const serverPassword = process.env.SERVER_PASSWORD;
  const masterPassword = decryptWithKey(
    user.encryptedMasterPassword,
    serverPassword,
    user.masterPasswordIV
  );

  // Encrypt the provided password with the master password
  const { iv, encryptedData } = encryptWithKey(
    plaintextPassword,
    masterPassword
  );

  // Save the encrypted password to the database
  const newPassword = await Password.create({
    user: req.user._id,
    service,
    username,
    encryptedPassword: encryptedData,
    iv,
  });

  res
    .status(201)
    .json({ message: "Password added successfully", id: newPassword._id });
});

// @desc    Retrieve a stored password
// @route   GET /api/passwords/:id
// @access  Private
const getPassword = asyncHandler(async (req, res) => {
  const { id } = req.params; // Password entry ID
  // Step 1: Fetch the user from the database
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Step 3: Fetch the password entry by ID
  const passwordEntry = await Password.findById(id);
  if (!passwordEntry) {
    res.status(404);
    throw new Error("Password not found");
  }

  // Step 4: Decrypt the user's master password using the server password
  const serverPassword = process.env.SERVER_PASSWORD;
  const masterPassword = decryptWithKey(
    user.encryptedMasterPassword,
    serverPassword,
    user.masterPasswordIV
  );

  // Step 5: Decrypt the stored password using the master password
  const plaintextPassword = decryptWithKey(
    passwordEntry.encryptedPassword,
    masterPassword,
    passwordEntry.iv
  );

  // Step 6: Return the decrypted password
  res.status(200).json({
    service: passwordEntry.service,
    username: passwordEntry.username,
    password: plaintextPassword,
  });
});

const getUserPasswords = asyncHandler(async (req, res) => {
  const passwords = await Password.find({ user: req.user._id });
  res.status(200).json(passwords);
});

// @desc    Update a stored password
// @route   PUT /api/passwords/:id
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params; // Password entry ID
  const { service, username, plaintextPassword, passwordId } = req.body;

  // Step 1: Fetch the user from the database
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Step 3: Fetch the password entry by ID
  const passwordEntry = await Password.findById(passwordId);
  if (!passwordEntry) {
    res.status(404);
    throw new Error("Password not found");
  }

  // Step 4: Decrypt the user's master password using the server password
  const serverPassword = process.env.SERVER_PASSWORD;
  const masterPassword = decryptWithKey(
    user.encryptedMasterPassword,
    serverPassword,
    user.masterPasswordIV
  );

  // Step 5: Encrypt the new password using the master password
  const { iv, encryptedData } = encryptWithKey(
    plaintextPassword,
    masterPassword
  );

  // Step 6: Update the password entry with the new data
  passwordEntry.service = service;
  passwordEntry.username = username;
  passwordEntry.encryptedPassword = encryptedData;
  passwordEntry.iv = iv;
  await passwordEntry.save();

  // Step 7: Return a success message
  res.status(200).json({ message: "Password updated successfully" });
});

// @desc    Delete a stored password
// @route   DELETE /api/passwords/:id
// @access  Private

const deletePassword = asyncHandler(async (req, res) => {
  const { id } = req.params; // Password entry ID

  // Step 1: Fetch the user from the database
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Step 2: Fetch the password entry by ID
  const passwordEntry = await Password.findById(id);
  if (!passwordEntry) {
    res.status(404);
    throw new Error("Password not found");
  }

  if (passwordEntry.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this password");
  }

  // Step 3: Delete the password entry
  await Password.findByIdAndDelete(id);

  // Step 4: Return a success message
  res.status(200).json({ message: "Password deleted successfully" });
});

export {
  addPassword,
  getPassword,
  getUserPasswords,
  updatePassword,
  deletePassword,
};
