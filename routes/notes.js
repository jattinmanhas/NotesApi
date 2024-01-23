const express = require('express');
const router = express.Router();

const notesController = require('../controllers/notes')
const {validationNotes} = require('../utils/validation');
const authMiddleware = require('../middlewares/authenticateUser');

router.get("/notes", authMiddleware.authentication , notesController.getAllNotes);

router.post("/notes", validationNotes , authMiddleware.authentication, notesController.postCreateNotes);

router.get("/notes/:noteId", authMiddleware.authentication, notesController.getNote);

router.put("/notes/:noteId", validationNotes ,authMiddleware.authentication, notesController.putNote);

router.delete("/notes/:noteId", authMiddleware.authentication, notesController.deleteNote)

router.get("/search", authMiddleware.authentication, notesController.getSearch)


module.exports = router;