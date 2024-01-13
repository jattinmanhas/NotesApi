const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes')
const {validationNotes} = require('../utils/validation');
const authMiddleware = require('../middlewares/authenticateUser');

router.get("/notes", authMiddleware.authentication ,notesController.getNotes);
router.post("/notes", validationNotes , authMiddleware.authentication, notesController.postCreateNotes);

module.exports = router;