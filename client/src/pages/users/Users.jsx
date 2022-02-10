import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getUsers } from '../../actions/profile';
import UsersItem from './UsersItem';

function Users({ getUsers, profile: { users, loading } }) {
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  return loading ? (
    <Spinner />
  ) : (
    <div>
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop" />
        Browse and connect with developers
      </p>
      <div className="profiles">
        {users.length > 0 ? (
          users.map((user) => <UsersItem key={user._id} user={user} />)
        ) : (
          <h4>No Users found...</h4>
        )}
      </div>
    </div>
  );
}

Users.propTypes = {
  getUsers: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getUsers })(Users);
