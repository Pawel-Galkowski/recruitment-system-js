import Validator from 'validator';
import isEmpty from './is-empty';

export default function validateEducationImput(data) {
  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (!Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  if (!Validator.isEmpty(data.degree)) {
    errors.degree = 'School degree field is required';
  }

  if (!Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is required';
  }

  if (!Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
