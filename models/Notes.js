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


NotesSchema.pre('save', async function (next) {
    try {
      await this.createIndexes({ title: 'text', content: 'text' },
         { weights: { content: 2, title: 5 } });
      next();
    } catch (err) {
      console.error('Error creating indexes:', err);
      next(err);
    }
  });
  

module.exports = mongoose.model('Notes', NotesSchema);