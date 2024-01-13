const Notes = require('../models/Notes');
const {validationResult} = require('express-validator')

exports.getNotes = (req, res) => {
    res.json({notes: req.user.email});
}

exports.postCreateNotes = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    res.json(req.body);
}