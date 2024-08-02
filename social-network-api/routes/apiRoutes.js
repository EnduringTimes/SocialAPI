const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../controllers/userController');

const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../controllers/thoughtController');

// User routes
router.route('/users').get(getUsers).post(createUser);
router.route('/users/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/users/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

// Thought routes
router.route('/thoughts').get(getThoughts).post(createThought);
router.route('/thoughts/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);
router.route('/thoughts/:thoughtId/reactions').post(addReaction).delete(removeReaction);

module.exports = router;
