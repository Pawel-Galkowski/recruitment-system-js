import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addCompany } from '../../actions/form';

function CreateCompany({ addCompany }) {
  const [formData, setFormData] = useState({
    company: '',
    nip: '',
  });

  const { company, nip } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = () => {
    addCompany(formData);
    setFormData('');
  };

  return (
    <div className="form-box">
      <h1>Create your company profile</h1>
      <form className="form" id="createCompanyForm" onSubmit={(e) => onSubmit(e)}>
        <input
          type="text"
          placeholder="Company name"
          name="company"
          value={company}
          onChange={(e) => onChange(e)}
          required
        />
        <input type="text" name="nip" placeholder="NIP" value={nip} onChange={(e) => onChange(e)} required />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
}

CreateCompany.propTypes = {
  addCompany: PropTypes.func.isRequired,
};

export default connect(null, { addCompany })(withRouter(CreateCompany));
