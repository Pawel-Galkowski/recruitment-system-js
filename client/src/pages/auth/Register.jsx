import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import setAlert from '../../actions/alert';
import { register } from '../../actions/auth';

function Register({ setAlert, register, isAuthenticated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user',
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

  return isAuthenticated ? (
    <Redirect to="/dashboard" />
  ) : (
    <div className="center-box">
      <div className="flex-box">
        <div className="additionalBG">&nbsp;</div>
        <div className="user bg-dark">
          <div className="form-wrap">
            <div className="tabs-content">
              <h3>Register Form</h3>
              <div id="register-tab-content" className="active">
                <form className="register-form" onSubmit={(e) => onSubmit(e)} method="post">
                  <div className="input-box">
                    <div className="form-group">
                      <input
                        type="text"
                        className="input"
                        placeholder="Full Name"
                        name="name"
                        value={name}
                        onChange={(e) => onchange(e)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="input"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => onchange(e)}
                        required
                      />
                      <small>Gravatar is supported on this page.</small>
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="input"
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
                        className="input"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={(e) => onchange(e)}
                        required
                      />
                    </div>
                  </div>
                  <input type="submit" className="button" value="Login" />
                </form>
                <div className="help-action">
                  <p className="forgot">
                    Already have an account?
                    {' '}
                    <Link to="/login">
                      <i className="fas fa-arrow-right" />
                      {' '}
                      Sign In
                      {' '}
                      <i className="fas fa-arrow-left" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
