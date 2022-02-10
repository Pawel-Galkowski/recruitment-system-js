import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteUserAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';

function AdminUsers({
  usrs: {
    confirmed, _id, name, email, date, role, loading,
  }, deleteUserAccount,
}) {
  if (confirmed === true) {
    let adminDanger = false;
    const normalDate = date.substring(0, 10);
    const timeDate = date.substring(11, 16);
    return loading ? (
      <Spinner />
    ) : (
      <div className="bg-white padding2 margin-2ud">
        <h3>
          <strong>
            {name}
            {' '}
            -
          </strong>
          {role === 'admin' ? (adminDanger = true) : (adminDanger = false)}
          {adminDanger ? (
            <span className="dangerRole">
              {' '}
              {role}
            </span>
          ) : (
            <span>
              {' '}
              {role}
            </span>
          )}
        </h3>
        <div className="margin-2ud">
          <p>
            Email:
            {' '}
            <b>{email}</b>
          </p>
          <p>
            Creation date:
            {' '}
            <b>{normalDate}</b>
          </p>
          <p>
            Creation time:
            {' '}
            <b>{timeDate}</b>
          </p>
        </div>
        <button className="btn btn-danger" onClick={() => deleteUserAccount(_id)} type="button">
          Delete Account
        </button>
      </div>
    );
  }
  return '';
}

AdminUsers.propTypes = {
  deleteUserAccount: PropTypes.func.isRequired,
  usrs: PropTypes.object.isRequired,
};

export default connect(null, { deleteUserAccount })(AdminUsers);
