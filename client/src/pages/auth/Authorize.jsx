import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { authorize } from '../../actions/auth';
import Alert from '../layout/Alert';

function Authorize({ authorize }) {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;
  const fullUrl = window.location.href;
  const token = fullUrl.replace(/([^]+)confirmation\//g, '');

  const onchange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    authorize(email, token);
  };

  return (
    <div className="center-box">
      <div className="flex-box">
        <div className="additionalBG">&nbsp;</div>
        <div className="user bg-dark">
          <div className="form-wrap">
            <div className="tabs-content">
              <Alert />
              <div id="register-tab-content" className="active">
                <p className="lead">
                  <i className="fas fa-user" />
                  {' '}
                  Write your email to confirm account
                </p>
                <form className="register-form" onSubmit={(e) => onSubmit(e)}>
                  <div className="form-group">
                    <input
                      className="input"
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={email}
                      onChange={(e) => onchange(e)}
                      required
                    />
                  </div>
                  <input type="submit" className="button-change" value="Verify" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Authorize.propTypes = {
  authorize: PropTypes.func.isRequired,
};

export default connect(null, { authorize })(Authorize);
