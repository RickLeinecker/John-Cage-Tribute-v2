const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const Composition = require('../../models/Composition');
const User = require('../../models/User');

// GridFS requirements in another file in order to keep everything clean
require('./uploaddownload')(router);

// Edit a composition, but only if the editor is its composer
router.put('/edit/:id', async (req, res) => {
  try {
    console.log(`A composition is being edited by user ${req.body.user}!`);

    const composition = await Composition.findById(req.params.id);

    if (!composition) {
      return res.status(404).json({ msg: "Composition to edit not found." });
    }

    const validUser = await User.findById(req.body.user).select('-password');

    if (!validUser || !validUser._id.equals(composition.user)) {
      return res.status(401).json({ msg: "Not authorized to edit this composition." });
    }

    if (req.body.title.length > 64) {
      return res.status(400).json({ msg: "Title is too long." });
    }

    if (req.body.description.length > 256) {
      return res.status(400).json({ msg: "Description is too long." });
    }

    composition.title = req.body.title.trim();
    if (composition.title.length == 0) {
      composition.title = "(Untitled)";
    }

    composition.description = req.body.description.trim();
    if (composition.description.length == 0) {
      composition.description = "(No description has been added)";
    }

    composition.private = req.body.private;
    composition.tags = req.body.tags;

    await composition.save();
    res.status(200).json({ msg: "Success!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while editing composition." });
  }
});

// Obtains all public compositions.
router.get('/', async (req, res) => {
  try {
    const compositions = await Composition.find({ private: false }).sort({ start: -1 });
    if (!compositions) {
      res.json("Be the first to create a composition");
    }
    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving all compositions.");
  }
});

// Filters search by composition title.
router.post('/title', async (req, res) => {
  try {
    const validUser = await User.findById(req.body.user).select('-password');
    let compositions;

    // Search for one's own compositions.
    if (validUser) {
      compositions = await Composition.find({ user: validUser._id, title: { $regex: new RegExp(req.body.query, 'i') }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    // Search for any compositions.
    else {
      compositions = await Composition.find({ private: false, title: { $regex: new RegExp(req.body.query, 'i') }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while searching by title.");
  }
});

// Filters search by composer name.
router.post('/composer', async (req, res) => {
  try {
    const validUser = await User.findById(req.body.user).select('-password');
    let compositions;

    // Search own compositions.
    if (validUser) {
      compositions = await Composition.find({ user: validUser._id, composer: { $regex: new RegExp(req.body.query, 'i') }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    // Search all compositions.
    else {
      compositions = await Composition.find({ private: false, composer: { $regex: new RegExp(req.body.query, 'i') }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while searching by composer.");
  }
});

// Filters search by performer name.
router.post('/performer', async (req, res) => {
  try {
    const validUser = await User.findById(req.body.user).select('-password');
    let compositions;

    if (validUser) {
      compositions = await Composition.find({ user: validUser._id, performers: { $in: [new RegExp(req.body.query, 'i')] }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    else {
      compositions = await Composition.find({ private: false, performers: { $in: [new RegExp(req.body.query, 'i')] }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while searching by performer.");
  }
});

// Filters search by composition tags.
router.post('/tags', async (req, res) => {
  try {
    const validUser = await User.findById(req.body.user).select('-password');
    let compositions;

    // Search for user's own compositions.
    if (validUser) {
      compositions = await Composition.find({ user: validUser._id, tags: { $in: [new RegExp(req.body.query, 'i')] }, file_id: { $ne: null } }).sort({ start: -1 });
    }
    // Search for any compositions.
    else {
      compositions = await Composition.find({ private: false, tags: { $in: [new RegExp(req.body.query, 'i')] }, file_id: { $ne: null } }).sort({ start: -1 });
    }

    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server erro while searching by tagsr.");
  }
});

// Generates an ID for a new composition of a specific user.
// The user's ID is specified in the endpoint.
router.get('/generate/:id', async (req, res) => {
  try {
    console.log("Generating new composition!");

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      res.status(404).send("User not authorized to generate a composition.");
    }

    const compId = new mongoose.mongo.ObjectId;
    const composition = new Composition({
      _id: compId,
      user: new ObjectId(req.params.id),
    });

    await composition.save();
    res.json({ 'id': compId });
  }
  catch (e) {
    console.error(e.message);
    res.status(500).send("Server error while generating a composition.");
  }
});

// Retrieves the ID of the latest composition of a specific user.
// The user's ID is specified in the endpoint.
router.get('/newest/:id', async (req, res) => {
  try {
    console.log(`Retrieving newest composition!`);
    const composition = await Composition.findOne({ user: req.params.id, file_id: { $ne: null } }).sort({ $natural: -1 });

    if (!composition) {
      res.status(404).send("Could not retrieve a composition for this user.");
    }

    console.log(composition);

    res.json(composition._id.toString());
  }
  catch (e) {
    console.error(e.message);
    res.status(500).send("Server error while searching newest composition.");
  }
});

// Obtain a list of your own compositions.
router.get('/usercompositions/', auth, async (req, res) => {
  try {
    let compositions = await Composition.find({ user: req.user.id, }).sort({ start: -1 });
    res.json(compositions);
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Views a specific composition's information.
router.get('/:id', async (req, res) => {
  try {
    const composition = await Composition.find({ _id: req.params.id, private: false, file_id: { $ne: null } }).sort({ start: -1 });

    if (!composition) {
      return res.status(404).json({ msg: "composition not found" });
    }

    res.json(composition);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while viewing a specific composition.");
  }
});

// Obtains a list of a user's compositions.
router.get('/user/:id', async (req, res) => {
  try {
    const composition = await Composition.find({ user: req.params.id, private: false, file_id: { $ne: null } }).sort({ start: -1 });
    res.json(composition);
  }

  catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while obtaining a user's compositions.");
  }
});

module.exports = router;

