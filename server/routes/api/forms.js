import express from 'express';
import { check, validationResult } from 'express-validator';

import auth from '../../middleware/auth';
import User from '../../models/User';
import Form from '../../models/Form';

const router = express.Router();

// @route   Post api/Form
// @desc    Post company to Form
// @access  Private

router.post(
  '/',
  [auth, [check('company', 'Company is required').not().isEmpty(), check('nip', 'NIP is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newCompany = new Form({
        company: req.body.company,
        nip: req.body.nip,
      });

      if (req.body.admins) {
        const admins = req.body.admins.slice();
        admins.push(user.id);
        newCompany.admins = admins.slice();
      } else newCompany.admins.push(user.id);

      const form = await newCompany.save();

      return res.json(form);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   GET api/Form
// @desc    Get all Form
// @access  Private

router.get('/', auth, async (req, res) => {
  try {
    const form = await Form.find().sort({ date: -1 });
    res.json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/Form/:company
// @desc    Get current form by id
// @access  Private

router.get('/:company', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.company);
    res.json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Post api/Form/:company
// @desc    Add new form to company by id
// @access  Private

router.post(
  '/:company',
  auth,
  [check('questions', 'Questions are required').not().isEmpty()],
  [check('body', 'Body of form is required').not().isEmpty()],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const company = await Form.findById(req.params.company);
      const user = await User.findById(req.user.id).select('-password');

      const newForm = {
        creator: user._id,
        questions: req.body.questions,
        body: req.body.body,
      };

      company.formTable.unshift(newForm);
      await company.save();
      return res.json(company);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   GET api/Form/:company/:id
// @desc    GET form by id
// @access  Private

router.get('/:company/:id', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);
    const onceForm = company.formTable.find((form) => form.id === req.params.id);
    if (!onceForm) {
      return res.status(404).json({
        msg: 'Form does not exist',
      });
    }

    return res.json(onceForm);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   Post api/Form/res/:company/:id
// @desc    Add new form responses by form id
// @access  Private

router.post(
  '/res/:company/:id',
  auth,
  [check('responses', 'Responses are required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const company = await Form.findById(req.params.company);
      const onceForm = company.formTable.find((form) => form.id === req.params.id);
      const user = await User.findById(req.user.id).select('-password');

      const newRes = {
        user: user._id,
        answer: req.body.responses,
        file: req.body.file ? req.body.file : '',
      };

      onceForm.responses.unshift(newRes);
      await company.save();
      return res.json(onceForm);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

router.post(
  '/res/:company/:id',
  auth,
  [check('responses', 'Responses are required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const company = await Form.findById(req.params.company);
      const onceForm = company.formTable.find((form) => form.id === req.params.id);
      const user = await User.findById(req.user.id).select('-password');

      const newRes = {
        user: user._id,
        answer: req.body.responses,
      };

      const response = onceForm.responses.unshift(newRes);
      await company.updateOne(company);
      return response.json(company);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

// @route   GET api/Form/asks/:company/:id/:asks
// @desc    Get form asks by id form by id company
// @access  Private

router.get('/asks/:company/:id', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);
    const onceForm = company.formTable.find((form) => form.id === req.params.id);

    if (!onceForm.questions) {
      return res.status(404).json({
        msg: 'Questions not created yet',
      });
    }

    return res.json(onceForm.questions);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/Form/asks/:company/:id/:res
// @desc    Get form response by res id by form by id company
// @access  Private

router.get('/res/:company/:id/:res', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);
    const response = company.formTable.find((ask) => ask.id === req.params.id);
    const responses = response.responses.find((resp) => resp.id === req.params.res);
    if (!responses) {
      return res.status(404).json({
        msg: 'Response does not exist',
      });
    }

    return res.json(responses);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   GET api/Form/res/:company/:id
// @desc    Get all form response by form by id company
// @access  Private

router.get('/res/:company/:id', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);
    const response = company.formTable.find((ask) => ask.id === req.params.id);

    const allRes = response.responses;
    if (!allRes) {
      return res.status(404).json({
        msg: 'Form does not have any responses yet',
      });
    }

    return res.json(allRes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE api/Form/:company
// @desc     Delete company by id
// @access   Private

router.delete('/:company', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    const authorize = company.admins.find((userId) => userId.toString());

    if (!authorize.includes(req.user.id)) {
      return res.status(404).json({ msg: 'User not authorized' });
    }

    // Only admins can remove companies
    // const logged = await User.findById(req.user.id);
    // if (logged.role !== "admin") {
    //   return res.status(404).json({ msg: "User not authorized" });
    // }

    await company.remove();
    return res.json([{ msg: 'Company removed' }]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE api/Form/:company/:id
// @desc     Delete FORM by id from company
// @access   Private

router.delete('/:company/:id', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    const formObject = company.formTable.find((form) => form.id === req.params.id);

    if (!formObject) {
      return res.status(404).json({ msg: 'Form not found' });
    }

    const authorize = company.admins.find((userId) => userId.toString());
    const formAdmins = authorize.includes(req.user.id);

    const globalAdmin = await User.findById(req.user.id);

    if (!formAdmins && globalAdmin.role !== 'admin') {
      return res.status(404).json({ msg: 'User not authorized' });
    }
    const removeIndex = company.formTable.map((form) => form._id.toString()).indexOf(formObject.id);

    company.formTable.splice(removeIndex, 1);

    await company.save();
    return res.json([{ msg: 'Form removed' }]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   Delete api/form/asks/:company/:id/:response
// @desc    Remove form response by res id by form by id company
// @access  Private

router.delete('/res/:company/:id/:response', auth, async (req, res) => {
  try {
    const company = await Form.findById(req.params.company);
    const resp = company.formTable.find((ask) => ask.id === req.params.id);
    const response = resp.responses.find((item) => item.id === req.params.response);
    if (!response) {
      return res.status(404).json({
        msg: 'Response does not exist',
      });
    }

    const authorize = company.admins.find((userId) => userId.toString());
    const formAdmins = authorize.includes(req.user.id);

    const globalAdmin = await User.findById(req.user.id);

    if (!formAdmins && globalAdmin.role !== 'admin') {
      return res.status(404).json({ msg: 'User not authorized' });
    }

    const removeIndex = resp.responses.map((item) => item._id.toString())
      .indexOf(req.params.response);

    resp.responses.splice(removeIndex, 1);

    await company.save();
    const otherResp = company.formTable.find((ask) => ask.id === req.params.id);
    return res.json(otherResp);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   Post api/forms/res/:company/:id
// @desc    Add new form responses by form id
// @access  Private

router.post(
  '/post/:company/:id',
  auth,
  [check('title', 'Title is required').not().isEmpty()],
  [check('skills', 'Skills are required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const company = await Form.findById(req.params.company);
      const form = company.formTable.find((item) => item.id === req.params.id);
      const user = await User.findById(req.user.id).select('-password');

      const newCompanyPost = {
        user: user._id,
        title: req.body.title,
        skills: req.body.skills,
        body: req.body.body,
      };

      form.body = newCompanyPost;

      await company.save();
      return res.json(company);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  },
);

export default router;
