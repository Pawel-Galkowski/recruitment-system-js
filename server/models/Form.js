import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FormSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  nip: {
    type: String,
    required: true,
  },
  admins: {
    type: Array,
  },
  formTable: [
    {
      creator: {
        type: Schema.Types.ObjectId,
        ref: `users`,
      },
      questions: [
        {
          type: Array,
        },
      ],
      responses: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: `users`,
          },
          answer: {
            type: Object,
          },
          file: {
            type: String,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      body: {
        type: Object,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Form = mongoose.model('form', FormSchema);

export default Form
