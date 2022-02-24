import Express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'file-system';
import {
  Auth, Forms, Posts, Profile, Users,
} from './routes/index.ts';
import db from './config/keys';
import './middleware/mailer';
import './config/passport';

dotenv.config();

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded());
app.use(fileUpload());

mongoose
  .connect(db.mongoURI, db.options)
  .then(() => console.log('MongoDB Connected'))
  .catch((err: any) => console.log(err));

app.use(passport.initialize());
app.use('/api/users', Users);
app.use('/api/auth', Auth);
app.use('/api/profile', Profile);
app.use('/api/posts', Posts);
app.use('/api/forms', Forms);

app.post('/uploads', (req: Express.Request, res: Express.Response) => {
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

    file.mv(`${url + file.name}`, (err: any) => {
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

app.post('/uploads/:company/:id', (req: Express.Request, res: Express.Response) => {
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

    file.mv(`${url + file.name}`, (err: any) => {
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

  app.get('*', (req: Express.Request, res: Express.Response) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

console.log('asdasd');

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
