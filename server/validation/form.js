import Validator from 'validator';
import isEmpty from './is-empty';

export default {
  validateFormInput: (data) => {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (Validator.isEmpty(data.text)) {
      errors.text = 'Field is required';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },
};
