const mongoose = require('mongoose');

const NotesSchema = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    image : {
        type : String,
        default: '/images/notes.jpg',
        required: false
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, { timestamps: true })

module.exports = mongoose.model('Notes', NotesSchema);