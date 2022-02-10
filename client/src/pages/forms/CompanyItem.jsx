import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { removeCompany } from '../../actions/form';

function CompanyItem({
  auth,
  removeCompany,
  forms: {
    _id,
    company,
    formTable,
    admins: [admins],
    loading,
  },
}) {
  return loading || !auth.user ? (
    <Spinner />
  ) : (
    <div className="formItem bg-white">
      <div>
        <Link to={`/api/forms/${_id}`}>
          <i className="far fa-building fa-3x" />
          <h4>{company}</h4>
        </Link>
      </div>
      <div>
        <h4>
          Available forms:
          {' '}
          <Link to={`/api/forms/${_id}`}>
            {formTable.length}
            <br />
            Check all positions
          </Link>
        </h4>
      </div>
      <div>
        {admins.includes(auth.user._id) || auth.user.role === 'admin' ? (
          <button onClick={() => removeCompany(_id)} type="button" className="btn btn-danger">
            Remove &nbsp;
            <i className="fas fa-trash-alt" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

CompanyItem.propTypes = {
  forms: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeCompany: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeCompany })(CompanyItem);
