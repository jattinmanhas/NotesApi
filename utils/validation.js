const { body } = require("express-validator");
const User = require("../models/User");

const validateRegister = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      });
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const validationLogin = [
  body("email").isEmail().withMessage("Email is invalid").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password is required and should be 6 characters long...")
];

const validationNotes = [
  body("title").trim().notEmpty().withMessage("Title Should Not be empty"),

  body("content").trim().isLength({max: 500}).withMessage("Conent should not exceed 500 words")
];

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validationLogin,
  validationNotes : validationNotes,
};
