import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const activationMailer = async (user, secretKey) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const aUser = user.email;
    const userId = user.id;

    const msgStyle = 'background-color: #F0F0F0; padding: 25px 0; font-size: 15px; font-family: Georgia; line-height: 25px;';
    const buttonStyle = 'padding: 10px 20px; width: 250px; height: 60px; background-color: #00BFFF; border-radius:10px; border: none; color: white; font-size: 20px; font-weight: bold; text-decoration:none;';

    const secretToken = await bcrypt.hash(user.id, secretKey);

    jwt.sign(
      { user: userId },
      secretToken,
      { expiresIn: '1d' },
      (err, token) => {
        const url = `http://localhost:3000/api/users/confirmation/${token}`;
        transporter.sendMail({
          to: aUser,
          subject: 'Confirmation Email',
          // html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`
          html: `<div style="${msgStyle}">
          <div style="max-width: 600px; min-width: 300px: width: auto; margin: 0 auto; text-align: center;">
              <p style="text-align: left;">
                  Hello ${user.name},<br />
      
                  Thanks for signing up with JoinJobs! <br />
                  In order to activate your account, we require that you confirm your email address.
              </p>
              <a href="${url}" style="${buttonStyle}">Confirmation</a>
              <p style="text-align: left;">
                  If you did not sign up to JoinJobs, you can safely ignore this email.
              </p>
              <p style="text-align: left;">
                  JoinJobs Team<br />
                  https://joinjobs.com
              </p>
          </div>
              </div>`,
        });
      },
    );
    return true;
  } catch (err) {
    return err;
  }
};

export default activationMailer;
