import Express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import users from './routes/api/users';
import auth from './routes/api/auth';
import profile from './routes/api/profile';
import posts from './routes/api/posts';
import forms from './routes/api/forms';
import db from './config/keys';
import './middleware/mailer';
import './config/passport';

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded());
app.use(fileUpload());

mongoose
  .connect(db.mongoURI, db.options)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use(passport.initialize());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/forms', forms);

app.post('/uploads', (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const { file } = req.files;
    const { user } = req.body;
    const url = `${__dirname}/client/public/uploads/${user}/`;

    if (!fs.existsSync(url)) {
      fs.mkdirSync(url);
    }

    file.mv(`${url + file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({
        fileName: file.name,
        filePath: `/uploads/${user}/${file.name}`,
      });
      return 'Success upload';
    });
  } catch (err) {
    res.json({ msg: 'File with that name exist' });
  }
  return 'Process upload file finished';
});

app.post('/uploads/:company/:id', (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const { file } = req.files;
    const { company } = req.params;
    const user = req.params.id;
    const url = `${__dirname}/client/public/uploads/company/${company}/${user}/`;
    if (!fs.existsSync(url)) {
      fs.mkdirSync(url);
    }

    file.mv(`${url + file.name}`, (err) => {
      if (err) {
        console.error(err);
        res.json({ msg: 'File with that name exist' });
      }
      res.json({
        fileName: file.name,
        filePath: `/uploads/company/${company}/${user}/${file.name}`,
      });
      return 'Success upload to company';
    });
  } catch (err) {
    res.json({ msg: 'File with that name exist' });
  }
  return 'Process upload file to company finished';
});

// Serve static assets if in production

if (process.env.NODE_ENV === 'production') {
  app.use(Express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
