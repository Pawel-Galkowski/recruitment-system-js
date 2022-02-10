/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function AdminRoute({
  component: Component,
  auth: { isAuthenticated, loading, isAdmin },
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => (!isAuthenticated && !loading && !isAdmin ? <Redirect to="/login" /> : <Component {...props} />)}
    />
  );
}

AdminRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  component: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminRoute);
