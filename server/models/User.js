import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmedKey: {
    type: String,
  },
  recoveryToken: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
  },
});

UserSchema.methods.summary = () => {
  const summary = {
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    timestamp: this.timestamp,
    confirmed: this.confirmed,
    confirmedKey: this.confirmedKey,
    recoveryToken: this.recoveryToken,
    id: this._id.toString(),
    role: this.role,
  };

  return summary;
};

const User = mongoose.model('users', UserSchema);

export default User;
