import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setAlert from '../../actions/alert';
import { register } from '../../actions/auth';

function AddUsers({ setAlert, register }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: '',
  });

  const {
    name, email, password, password2, role,
  } = formData;

  const onchange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({
        name,
        email,
        password,
        role,
      });
    }
  };

  return (
    <form className="form" onSubmit={(e) => onSubmit(e)}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => onchange(e)}
          required
        />
      </div>
      <div className="form-group">
        <select name="role" value={role} onChange={(e) => onchange(e)} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={(e) => onchange(e)}
          required
        />

      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          name="password"
          minLength="6"
          value={password}
          onChange={(e) => onchange(e)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          name="password2"
          minLength="6"
          value={password2}
          onChange={(e) => onchange(e)}
          required
        />
      </div>
      <input type="submit" className="btn btn-primary" value="Register" />
    </form>
  );
}

AddUsers.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(AddUsers);
