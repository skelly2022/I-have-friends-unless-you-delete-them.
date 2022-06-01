const { response } = require("express");
const { Thought, User } = require("../models");

module.exports = {
  // Get all courses
  getThoughts(req, res) {
    Thought.find()
      .then((courses) => res.json(courses))
      .catch((err) => res.status(500).json(err));
  },
  // Get a course
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((course) =>
        !course
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(course)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a course
  createThought(req, res) {
    Thought.create(req.body)
      .then((course) => course)
      .then((thoughtData) => {
        return User.findByIdAndUpdate(req.body.userId, {
          $push: { thoughts: thoughtData._id }
          ,
        },{new:true});
      })
      .then((response) => res.json(response))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updatedUser) => res.json(updatedUser))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a course
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((course) =>
        !course
          ? res.status(404).json({ message: "No thought with that ID" })
          : User.deleteMany({ _id: { $in: course.thoughts } })
      )
      .then(() => res.json({ message: "Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a course
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {$push:{reactions:req.body}}, {
      runValidators: true,
      new: true,
    })
      .then((course) =>
        !course
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(course)
      )
      .catch((err) => res.status(500).json(err.message));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {$pull:{reactions:{reactionId:req.params.reactionId}}}, {
      runValidators: true,
      new: true,
    })
      .then((course) =>
        !course
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(course)
      )
      .catch((err) => res.status(500).json(err.message));
  },
};

