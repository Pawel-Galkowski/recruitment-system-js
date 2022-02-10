const ProfileController = require('./ProfileController');
const UserController = require('./UserController');
const PostController = require('./PostController');

module.exports = {
  profile: ProfileController,
  post: PostController,
  user: UserController,
};
