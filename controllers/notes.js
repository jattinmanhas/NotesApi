const Notes = require("../models/Notes");
const { validationResult } = require("express-validator");

exports.getAllNotes = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User Does not Exist" });
  }

  try {
    const allNotes = await Notes.find({ user: user.userId });
    if (allNotes) {
      return res.status(200).json(allNotes);
    }
  } catch (err) {
    return res.status(400).json({ message: "Nothing to get Here" });
  }
};

exports.postCreateNotes = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;
  const user = req.user.userId;

  Notes.create({
    title: title,
    content: content,
    user: user,
  })
    .then((note) => {
      return res
        .status(200)
        .json({ note: note, message: "Note Created Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ errors: err.message });
    });
};

exports.getNote = async (req, res) => {
  const noteId = req.params.noteId;

  if (!noteId) {
    return res.status(400).json({ message: "Empty Notes Id" });
  }

  try {
    const note = await Notes.find({ _id: noteId });

    return res
      .status(200)
      .json({ note: note, message: "Note Fetched Successfully..." });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.putNote = async (req, res) => {
  const noteId = req.params.noteId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;

  const note = await Notes.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  return res
    .status(200)
    .json({ note: note, message: "Note Updated Successfully" });
};

exports.deleteNote = async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const note = await Notes.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not Found" });
    }

    Notes.deleteOne({ _id: noteId, user: req.user.userId })
      .then(() => {
        return res.status(200).json({ messge: "Success in deleting note" });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Deleting product failed." });
      });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getSearch = async (req, res) => {
  const { q } = req.query;

  try{
    const searchResults = await Notes.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    
      if(searchResults.length > 0){
        return res.status(200).json({searchResults: searchResults, message : "Notes fetched Successfully"})
      }

      return res.status(200).json({message: "NO NOTES FOUND"})
  }
  catch(err){
    res.status(500).json({error : err.message});
  }
  
};
