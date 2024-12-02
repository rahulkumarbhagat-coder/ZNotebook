const express = require("express");
const router = express.Router();
const Notes = require("../modules/Notes");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

//Route 1 : Fetch all notes using : Get "api/notes/fetchallnotes". login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2 : Add a new note using : Post "api/notes/addnote". login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }), //adding validation details
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      //result is empty means there's no error
      try {
        const { title, description, tag } = req.body;

        const notes = new Notes({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const saveNote = await notes.save();
        res.json(saveNote);

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
    } else {
      //if result is not empty , return Bad Request
      res.status(400).send({ errors: result.array() });
    }
  }
);

//Route 3 : Update an existing note using : PUT "api/notes/updatenote". login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //Create a newNote object
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find a note to be updated and update it
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }
    //Allow updation only if the user own the note

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed by this user");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 4 : Delete an existing note using : Delete "api/notes/deletenote". login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find a note to be deleted and delete it
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }

    //Allow deletion only if the user own the note

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed by this user");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Successfully Deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
