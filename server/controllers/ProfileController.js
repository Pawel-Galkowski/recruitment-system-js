import Promise from 'bluebird';
import Profile from '../models/Profile';
import User from '../models/User';
import validation from '../validation';

function checkExpEdu(params, action, callback) {
  if (action === 'experience') {
    const { errors, isValid } = validation.experience.validateExperienceInput(params);

    if (!isValid) {
      callback(errors, null);
      return;
    }

    const newExp = {
      title: params.title,
      company: params.company,
      location: params.location,
      from: params.from,
      to: params.to,
      current: params.current,
      description: params.description,
    };
    callback(null, newExp);
    return;
  }
  if (action === 'education') {
    const { errors, isValid } = validation.education.validateEducationInput(params);

    if (!isValid) {
      callback(errors, null);
      return;
    }

    const newEdu = {
      school: params.school,
      degree: params.degree,
      fieldofstudy: params.field,
      from: params.from,
      to: params.to,
      current: params.current,
      description: params.description,
    };
    callback(null, newEdu);
  }
}

export default {
  find: (params) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.find(params)
      .populate('user', ['name', 'avatar'])
      .exec((err, profiles) => {
        if (err) {
          reject(new Error('There are no profiles'));
          return;
        }
        if (profiles.length === 0) {
          errors.noprofile = 'There are no profiles';
          reject(errors);
          return;
        }
        resolve(profiles);
      });
  }),
  findOne: (params) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne(params)
      .populate('user', ['name', 'avatar'])
      .exec((err, profile) => {
        if (err) {
          reject(err);
          return;
        }
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          reject(errors);
          return;
        }
        resolve(profile);
      });
  }),
  findByUserId: (params) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne(params, (err, profile) => {
      if (err) {
        reject(new Error('There is no profile for this user'));
        return;
      }
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        reject(errors);
        return;
      }
      resolve(profile);
    });
  }),
  save: (user, params) => new Promise((resolve, reject) => {
    const { errors, isValid } = validation.profile.validateProfileInput(params);

    if (!isValid) {
      reject(errors);
      return;
    }

    params.user = user.id;

    if (typeof params.skills !== 'undefined') {
      const skillsArray = [];
      const skills = params.skills.split(',');
      skills.forEach((skill) => {
        skillsArray.push(skill.trim());
      });
      params.skills = skillsArray;
    }

    const social = {};
    const socialMedia = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
    socialMedia.forEach((media) => {
      if (params[media]) {
        social[media] = params[media];
      }
    });
    params.social = social;

    Profile.findOne({ user: user.id }, (err, profile) => {
      if (err) {
        reject(err);
        return;
      }

      // update profile
      if (profile) {
        Profile.findByIdAndUpdate(profile._id, params, { new: true }, (error, object) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(object);
        });
        return;
      }

      // check if handle exists
      Profile.findOne({ handle: params.handle }, (error, object) => {
        if (error) {
          reject(error);
          return;
        }
        if (object) {
          errors.handle = 'That handle already exists';
          reject(errors);
          return;
        }

        // create profile
        Profile.create(params, (e, item) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(item);
        });
      });
    });
  }),
  add: (user, params, action) => new Promise((resolve, reject) => {
    const errors = {};
    checkExpEdu(params, action, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Profile.findOne({ user: user.id }, (error, profile) => {
        if (error) {
          reject(error);
          return;
        }
        if (!profile) {
          errors.profile = 'No profile found for this user';
          reject(errors);
          return;
        }

        profile[action].unshift(data);
        profile.save((e, object) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(object);
        });
      });
    });
  }),
  remove: (user, id, action) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne({ user: user.id }, (err, profile) => {
      if (err) {
        reject(err);
        return;
      }
      if (!profile) {
        errors.profile = 'No profile found for this user';
        reject(errors);
        return;
      }
      const removeIndex = profile[action].map((item) => item.id).indexOf(id);
      profile[action].splice(removeIndex, 1);
      profile.save((error, object) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(object);
      });
    });
  }),
  delete: (params) => new Promise((resolve, reject) => {
    const errors = {};
    Profile.findOne(params, (err, profile) => {
      if (err) {
        reject(err);
        return;
      }
      if (!profile) {
        errors.profile = 'No profile found for this user';
        reject(errors);
        return;
      }

      Profile.findByIdAndRemove(profile._id, (error, object) => {
        if (error) {
          reject(error);
          return;
        }
        User.findByIdAndRemove(object.user, (e, user) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(user);
        });
      });
    });
  }),
};
