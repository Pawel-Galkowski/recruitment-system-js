const Promise = require('bluebird');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const validation = require('../validation');

function checkErrors(user, params, callback) {
  const { errors, isValid } = validation.post.validatePostInput(params);
  if (!isValid) {
    callback(errors, null);
    return;
  }
  const newPost = {
    text: params.text,
    name: params.name,
    avatar: params.avatar,
    user: user.id,
  };
  callback(null, newPost);
}

function postLikeUnlike(user, post, action, callback) {
  const errors = {};
  if (action === 'like') {
    if (post.likes.filter((like) => like.user.toString() === user.id).length > 0) {
      errors.alreadyLiked = 'User has already liked this post';
      callback(errors, null);
      return;
    }
    post.likes.unshift({
      user: user.id,
    });
    callback(null, post);
  }
  if (action === 'unlike') {
    if (post.likes.filter((like) => like.user.toString() === user.id).length === 0) {
      errors.notLiked = 'You have not yet liked this post';
      callback(errors, null);
      return;
    }
    const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(user.id);
    post.likes.splice(removeIndex, 1);
    callback(null, post);
  }
}

module.exports = {
  post: (user, params) => new Promise((resolve, reject) => {
    checkErrors(user, params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Post.create(data, (error, post) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(post);
      });
    });
  }),
  get: (params) => new Promise((resolve, reject) => {
    Post.find(params)
      .sort({
        timestamp: -1,
      })
      .exec((err, posts) => {
        if (err) {
          reject(new Error('No posts found'));
          return;
        }
        resolve(posts);
      });
  }),
  getById: (params) => new Promise((resolve, reject) => {
    Post.findById(params, (err, post) => {
      if (err) {
        reject(new Error('No post found with that ID'));
        return;
      }
      resolve(post);
    });
  }),
  delete: (user, params) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne(
      {
        user: user.id,
      },
      (err, profile) => {
        if (err) {
          reject(err);
          return;
        }
        if (!profile) {
          errors.profile = 'There is no profile for this user';
          reject(errors);
          return;
        }
        Post.findById(params, (error, post) => {
          if (error) {
            reject(error);
            return;
          }
          if (post.user.toString() !== user.id) {
            errors.notAuthorized = 'User not authorized';
            reject(errors);
            return;
          }
          post.remove((e, item) => {
            if (e) {
              reject(e);
              return;
            }
            resolve(item);
          });
        });
      },
    );
  }),
  save: (user, params, action) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne(
      {
        user: user.id,
      },
      (err, profile) => {
        if (err) {
          reject(err);
          return;
        }
        if (!profile) {
          errors.profile = 'No profile found for this user';
          reject(errors);
          return;
        }
        Post.findById(params, (error, post) => {
          if (error) {
            reject(error);
            return;
          }
          postLikeUnlike(user, post, action, (e, updatedPost) => {
            if (e) {
              reject(e);
              return;
            }
            updatedPost.save((problem, item) => {
              if (problem) {
                reject(problem);
                return;
              }
              resolve(item);
            });
          });
        });
      },
    );
  }),
  addcomment: (user, id, params) => new Promise((resolve, reject) => {
    checkErrors(user, params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Post.findById(id, (error, post) => {
        if (error) {
          reject(new Error('No post found'));
          return;
        }
        post.comments.unshift(data);
        post.save((e, item) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(item);
        });
      });
    });
  }),
  deletecomment: (id, commentid) => new Promise((resolve, reject) => {
    const errors = {};
    Post.findById(id, (err, post) => {
      if (err) {
        reject(err);
        return;
      }
      if (post.comments.filter((comment) => comment._id.toString() === commentid).length === 0) {
        errors.commentnotfound = 'comment not found';
        reject(errors);
        return;
      }
      const removeIndex = post.comments.map((item) => item._id.toString()).indexOf(commentid);
      post.comments.splice(removeIndex, 1);
      post.save((error, item) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(item);
      });
    });
  }),
};
