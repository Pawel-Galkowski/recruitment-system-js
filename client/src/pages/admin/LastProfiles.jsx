import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { deleteUserAccount } from '../../actions/profile';

function AdminProfiles({
  deleteUserAccount,
  profile: {
    user: {
      _id, name, avatar, loading,
    },
    status,
    company,
  },
}) {
  return loading ? (
    <Spinner />
  ) : (
    <div className="profile-admin bg-white">
      <img src={avatar} alt="avatar" className="round-img" />
      <div>
        <h2>{name}</h2>
        <p>
          {status}
          {company && (
          <span>
            at
            {company}
          </span>
          )}
        </p>
        <Link to={`/profile/${_id}`} className="btn btn-primary" target="_blank">
          View Profile
        </Link>
        <button className="btn btn-danger" onClick={() => deleteUserAccount(_id)} type="button">
          Delete User
        </button>
      </div>
    </div>
  );
}

AdminProfiles.propTypes = {
  profile: PropTypes.object.isRequired,
  deleteUserAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteUserAccount })(AdminProfiles);
