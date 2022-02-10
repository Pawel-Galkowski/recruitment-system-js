import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function DashboardActions({ profile }) {
  return (
    <div className="dash-buttons">
      {profile !== null ? (
        <Link className="nav-link" to="/edit-profile">
          <div className="nav-link-icon">
            <i className="fas fa-user-circle" />
          </div>
          Edit Profile
          {' '}
        </Link>
      ) : (
        <div />
      )}
      <Link className="nav-link" to="/education">
        <div className="nav-link-icon">
          <i className="fas fa-graduation-cap" />
        </div>
        Add Education
        {' '}
      </Link>
      <Link className="nav-link" to="/experience">
        <div className="nav-link-icon">
          <i className="fab fa-black-tie" />
        </div>
        Add Experience
        {' '}
      </Link>
    </div>
  );
}

DashboardActions.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default DashboardActions;
