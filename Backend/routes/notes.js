const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');


//ROUTE 1::get request to fetch all notes Get:"api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured")
    }
})


//ROUTE 2::Add new notes using Post:"api/notes/addnotes"
router.post('/addnotes', fetchuser, [
    body('title', 'enter altleat 5 character title').isLength({ min: 3 }),
    body('description', 'enter at least 5 charcter description').isLength({ min: 5 })
], async (req, res) => {
    const { title, description, tag } = req.body;
    //seee if there is error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notes = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await notes.save();
        res.json(savedNotes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured")
    }

})

//ROUTE 3:Update notes using Put:"api/notes/updatenote"  login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //creating a new note object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }

        //Allow the updation only when user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured")
    }




})
//ROUTE 4:Delete notes using Put:"api/notes/updatenote"  login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("not found") }

        //Allow the deletion only when user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Not deleted", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("internal server error occured")
    }


})
module.exports = router