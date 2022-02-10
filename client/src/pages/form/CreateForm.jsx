import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { addCompanyForm } from '../../actions/form';

function CreateForm({ addCompanyForm, match }) {
  const [formData, setFormData] = useState([]);
  const [newData, setData] = useState({
    title: '',
    skills: '',
    body: '',
    question: '',
  });

  const onSubmit = () => {
    if (formData < 1) {
      alert('You need to add at least one question');
    } else {
      const fullObject = {
        questions: formData,
        body: {
          title: newData.title,
          skills: newData.skills,
          body: newData.body,
        },
      };
      addCompanyForm(match.params.company, fullObject);
    }
  };

  const removeInput = (ind) => {
    formData.splice(ind, 1);
    setFormData([...formData]);
  };

  const {
    title, skills, body, question,
  } = newData;

  const onChange = (e) => setData({
    ...newData,
    [e.target.name]: e.target.value,
  });
  // sprawdz czy mozna wyslac do bazy

  const generateFormObject = () => {
    if (newData !== '') {
      setFormData([newData.question, ...formData]);
      setData({
        title: newData.title,
        skills: newData.skills,
        body: newData.body,
        question: '',
      });
    }
  };

  const { company } = match.params;

  return (
    <div className="paddingSection">
      <Link to={`/api/forms/${company}`} className="btn btn-light">
        Back to forms
      </Link>
      <div className="marginTop-2">
        <h1>Create new form</h1>
        <div className="form-box">
          <form className="form" id="createCompanyForm">
            <div className="boxed">
              <h2>Post informations</h2>
              <label htmlFor="recruitmentPostTitle">
                Title of post
                <input
                  type="text"
                  className="inputMargin"
                  name="title"
                  value={title}
                  id=""
                  placeholder="Title of post"
                  onChange={(e) => onChange(e)}
                  required
                />
              </label>
              <label htmlFor="recruitmentSkills">
                Skills (write with &quot;,&quot;)
                <input
                  type="text"
                  className="inputMargin"
                  name="skills"
                  id="recruitmentSkills"
                  value={skills}
                  placeholder="Skills"
                  onChange={(e) => onChange(e)}
                  required
                />
              </label>
              <label htmlFor="mainRecruitmentInformations">
                Your full informations about recrutiment
                <textarea
                  type="text"
                  className="inputMargin"
                  name="body"
                  id="mainRecruitmentInformations"
                  value={body}
                  placeholder="Your full informations about recrutiment"
                  onChange={(e) => onChange(e)}
                  required
                />
              </label>
            </div>
            <div className="boxed">
              <label htmlFor="recruitmentQuestions">
                Recruitment questions
                <input
                  type="text"
                  name="question"
                  id="recruitmentQuestions"
                  value={question}
                  placeholder="Write new question"
                  onChange={(e) => onChange(e)}
                />
              </label>
              <button type="button" className="btn btn-success" onClick={() => generateFormObject()}>
                Add question
              </button>
            </div>
            <div id="Added questions">
              {formData
                && formData.map((el, index) => (
                  <Fragment key={index}>
                    <div id={`inp${index}`} className="boxed-box">
                      <input
                        type="text"
                        className="inputBase"
                        value={el}
                        placeholder={el.question}
                        name={index}
                        readOnly
                      />
                      <button type="button" className="trashBase" onClick={() => removeInput(index)}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </Fragment>
                ))}
            </div>
            <div className="paddingSection">
              <input type="submit" className="btn btn-dark margin-button" value="Submit" onClick={() => onSubmit()} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CreateForm.propTypes = {
  addCompanyForm: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(null, { addCompanyForm })(withRouter(CreateForm));
