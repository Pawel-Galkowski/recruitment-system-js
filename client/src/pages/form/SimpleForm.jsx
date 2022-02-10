import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCompanyForms } from '../../actions/form';
import CompanyFormsSimple from './CompanyFormsSimple';
import Spinner from '../layout/Spinner';

function SimpleForm({
  auth, getCompanyForms, forms: { forms, loading }, match,
}) {
  useEffect(() => {
    getCompanyForms(match.params.company);
  }, [getCompanyForms, match]);

  const { company } = match.params;

  return loading || !forms || !auth.user ? (
    <Spinner />
  ) : (
    <div className="paddingSection">
      <Link to={`/api/forms/${company}`} className="btn btn-light">
        Back to forms
      </Link>
      {!forms.formTable || forms.formTable.length < 1 ? (
        <h2>Form not available</h2>
      ) : (
        forms.formTable.map((form) => (
          <Fragment key={form._id}>
            {form._id === match.params.id ? (
              <CompanyFormsSimple
                formTable={form}
                company={match.params.company}
                admins={forms.admins}
                name={forms.company}
              />
            ) : (
              <div />
            )}
          </Fragment>
        ))
      )}
    </div>
  );
}

SimpleForm.propTypes = {
  getCompanyForms: PropTypes.func.isRequired,
  forms: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  forms: state.forms,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCompanyForms })(SimpleForm);
