import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Education from './Education';
import Experience from './Experience';

function Dashboard({
  getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading },
}) {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const submitOperation = () => {
    if (window.confirm('Do you really want to remove your account?')) {
      deleteAccount();
    }
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <div className="paddingSection">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" />
        {' '}
        Welcome
        {' '}
        {user && user.name}
      </p>
      {profile ? (
        <>
          {typeof profile.experience !== 'object' || typeof profile.education !== 'object' ? (
            <Spinner />
          ) : (
            <div className="table-center">
              <Experience experience={profile.experience} />
              <Education education={profile.education} />
            </div>
          )}
          <div className="removeUser-section">
            <button className="btn btn-danger" type="submit" onClick={() => submitOperation()}>
              <i className="fas fa-user-minus" />
              Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some informations</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create profile
          </Link>
        </>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
