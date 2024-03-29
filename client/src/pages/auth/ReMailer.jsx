import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { recoveryPassword } from '../../actions/auth';
import setAlert from '../../actions/alert';

function ReMailer({ recoveryPassword }) {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onchange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    recoveryPassword(email).then(setAlert('Email send', 'success'));
  };

  return (
    <div className="center-box">
      <div className="flex-box">
        <div className="additionalBG">&nbsp;</div>
        <div className="user bg-dark">
          <div className="form-wrap">
            <div className="tabs-content">
              <div id="register-tab-content" className="active">
                <p className="lead">
                  <i className="fas fa-user" />
                  Write your email to recovery account
                </p>
                <form className="register-form" onSubmit={(e) => onSubmit(e)} method="post">
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
                  <input type="submit" className="button-change" value="Change Password" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReMailer.propTypes = {
  recoveryPassword: PropTypes.func.isRequired,
};

export default connect(null, { recoveryPassword })(ReMailer);
