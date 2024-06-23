const express = require('express');
const Fetchuser = require('../middleware/Fetchuser');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Note = require('../models/Note');

//Route : 1 Get all notes 
router.get('/fetchallnotes', Fetchuser, async (req, res) => {
    try{
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
      }
    
})

//Route : 2 Add a new note
router.post('/addnote', Fetchuser, [
    body('title','Enter a valid title').isLength({ min: 3 }),
    body('description', 'Decription must be on min 5 length').isLength({ min: 5 }),
], async (req, res) => {

    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags } = req.body;
    const note = new Note({
        title, description, tags, user : req.user.id
    })

    const savedNote = await note.save();

    res.json(savedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
    
});


//Route : 3 Update a note
router.put('/updatenote/:id', Fetchuser, async (req, res) => {

    try {
        const {title, description, tags} = req.body;

    //create a newNote objects
    const newNote = {};
    if(title) {newNote.title = title};
    if(description) {newNote.description = description};
    if(tags) {newNote.tags = tags};

    //Find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if(!note) { return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set : newNote}, {new:true})
    res.json({note});
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
    
}
)

//Route : 4 Update a note
router.delete('/deletenote/:id', Fetchuser, async (req, res) => {

    try {
        const {title, description, tags} = req.body;

    //Find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if(!note) { return res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json("Deleted successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
}
)
module.exports = router;