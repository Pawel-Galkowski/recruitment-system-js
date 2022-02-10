const Promise = require('bluebird');
const Form = require('../models/Forms');
const Profile = require('../models/Profile');
const validation = require('../validation');

function checkErrors(user, params, callback) {
  const { errors, isValid } = validation.form.validateFormInput(params);
  if (!isValid) {
    callback(errors, null);
    return;
  }

  const newCompany = {
    company: params.company,
    nip: params.nip,
    admins: {
      id: user.id,
    },
  };

  callback(null, newCompany);
}

module.exports = {
  post: (user, params) => new Promise((resolve, reject) => {
    checkErrors(user, params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Form.create(data, (error, form) => {
        if (error) {
          return reject(error);
        }
        return resolve(form);
      });
    });
  }),
  get: (params) => new Promise((resolve, reject) => {
    Form.find(params)
      .sort({
        timestamp: -1,
      })
      .exec((err, forms) => {
        if (err) {
          return reject(new Error('No forms found'));
        }
        return resolve(forms);
      });
  }),
  getById: (params) => new Promise((resolve, reject) => {
    Form.findById(params, (err, form) => {
      if (err) {
        return reject(new Error('No form found with that ID'));
      }
      return resolve(form);
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
        Form.findById(params, (error, form) => {
          if (error) {
            reject(error);
            return;
          }
          if (form.company.admins.id.toString() !== user.id) {
            errors.notAuthorized = 'User not authorized';
            reject(errors);
            return;
          }
          form.remove((e, item) => {
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
  addAnswer: (user, id, params) => new Promise((resolve, reject) => {
    checkErrors(user, params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Form.findById(id, (error, form) => {
        if (error) {
          reject(new Error('No form found'));
          return;
        }
        form.comments.unshift(data);
        form.save((e, item) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(item);
        });
      });
    });
  }),
  addQuestions: (user, id, params) => new Promise((resolve, reject) => {
    checkErrors(user, params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      Form.findById(id, (error, form) => {
        if (error) {
          reject(new Error('No form found'));
          return;
        }
        form.comments.unshift(data);
        form.save((e, item) => {
          if (e) {
            reject(e);
            return;
          }
          resolve(item);
        });
      });
    });
  }),
};
