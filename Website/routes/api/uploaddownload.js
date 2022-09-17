// This file exists to uncomplicate things
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const config = require('config');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const auth = require('../../middleware/auth.js');

const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const Composition = require('../../models/Composition');
const User = require('../../models/User');
const ObjectId = require('mongodb').ObjectID;

const conn = mongoose.connection;

// Uploading the MP3 File
module.exports = router => {

  let gfs;

  conn.once('open', () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
  });

  const storage = new GridFsStorage({
    url: config.get('mongoURI'),
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          // Randomize the filename
          const filename = buf.toString('hex') + path.extname(file.originalname);
          // Add file to the bucket
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

  const upload = multer({ storage });

  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      console.log(`Composition and file metadata are being written!`);

      const file = req.file;
      const data = JSON.parse(req.body.data);
      const validUser = await User.findById(data.user).select('-password');
      let composition = await Composition.findById(data.composition.id);

      if (!composition) {
        res.status(404).send({ msg: "Composition not found." });
      }
      else if (!validUser || !validUser._id.equals(composition.user)) {
        res.status(401).send({ msg: "Not authorized to set comp. file metadata!" });
      }
      else {
        composition.composer = validUser.name;
        composition.runtime = data.composition.time;
        composition.file_id = file.id;
        composition.filelength = file.size;
        composition.filename = file.filename;
        composition.filetype = file.contentType;
        composition.performers = data.composition.performers;
      }

      await composition.save();
      console.log(`Composition saved successfully!`);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error while uploading composition file metadata.");
    }
  });

  // View compositions from database
  router.get('/view/:id', async (req, res) => {
    console.log(`Viewing composition of ObjectID: ${JSON.stringify(req.params.id)}`);
    try {
      const composition = await Composition.findById(req.params.id);
      if (!composition) {
        return res.status(404).json({ msg: "Composition to view not found." });
      }
      const file = gfs.find({ _id: ObjectId(composition.file_id) })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "File not Found"
            });
          }
          gfs.openDownloadStream(ObjectId(composition.file_id)).pipe(res);
        });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send("Server error while retrieving composition for viewing.");
    }
  });

  router.delete('/remove/:id', auth, async (req, res) => {
    try {
      const composition = await Composition.findById(req.params.id);
      if (!composition) {
        return res.status(404).json({ msg: "Composition to delete not found." })
      }

      if (composition.user.toString() != req.user.id) {
        return res.status(401).json({ msg: "User not authorized to delete this composition." });
      }
      const goaway = ObjectId(composition.file_id);
      gfs.delete(goaway);
      await composition.remove();
      res.json({ success: true });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send("Server error while deleting composition.");
    }
  });

  router.delete('/removeuser', auth, async (req, res) => {
    try {
      const user = User.findById(req.user.id);

      if (!user) {
        res.status(402).send({ msg: 'Your account information was not found.' });
      }

      const compositions = await Composition.find({ user: ObjectId(req.user.id) }).sort({ date: -1 });

      while (compositions) {
        // Delete every user composition that the user had made
        const composition = await Composition.findOne({ user: ObjectId(req.user.id) });

        if (!composition) {
          break;
        }

        const goaway = ObjectId(composition.file_id);
        // get rid of it
        gfs.delete(goaway);
        await composition.remove();
      }

      // Remove user after removing all of user's compositions.
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: 'Success!' });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send({ msg: "Server error while deleting composition." });
    }
  });
}

