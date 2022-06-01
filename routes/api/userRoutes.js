const router = require('express').Router();
const {
  getStudents,
  getSingleUser,
  createUser,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser,
} = require('../../controllers/studentController');

// /api/students
router.route('/').get(getStudents).post(createUser);

// /api/students/:studentId
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

// /api/students/:studentId/assignments
router.route('/:userId/friends').post(addFriend);

// /api/students/:studentId/assignments/:assignmentId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
