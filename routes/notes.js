const express = require('express');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


const router = express.Router();
var fetchuser = require('../Middleware/fetchuser');

// Route 1 : Get All notes using : POST "/api/notes /fetchallnotes". No login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try{
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
    }catch (error) {
        console.error(error.message); 
        res.error(500).send("Some error occured");
       }
})
// Route 2 : Add new note using : POST "/api/notes/addnote". No login required

router.post('/addnote', fetchuser, [

    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a description must be 5 char ').isLength({ min: 5 })
], async (req, res) => {
    try{
    const { title, description, tag    } = req.body; ///desturcturing concept
    // if there is errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
        title,description,tag,user:req.user.id
    })
    const savenote= await note.save();
    res.json(savenote);
    }catch (error) {
        console.error(error.message); 
        res.error(500).send("Some error occured");
       }
})
// Route 3 : Updatae note using : PUT "/api/notes/updatenote". No login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try{
    const {title,description,tag}=req.body;
    //create newNote object
    const newNote={};
    if(title){
        newNote.title=title;
    }
    if(description){
        newNote.description=description;
    }if(tag){
        newNote.tag=tag;
    }
    ///find to the to Updated and update it
    let note = await Notes.findById(req.params.id);    /// jo para
    if(!note){
        return res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id){
        return res.status(404).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
    res.json({note})
}catch (error) {
    console.error(error.message); 
    res.error(500).send("Some error occured");
   }
})
// Route 4 : Delete a note using : Delete "/api/notes/deletenote". No login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try{
    const {title,description,tag}=req.body;
    
    ///find to the to Updated and update it
    let note = await Notes.findById(req.params.id);    /// jo para
    if(!note){
        return res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id){
        return res.status(404).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note will be deleted",note:note})
}catch (error) {
    console.error(error.message); 
    res.error(500).send("Some error occured");
   }
})
module.exports = router 