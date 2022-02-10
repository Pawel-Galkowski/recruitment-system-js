import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Momment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { deletePost } from '../../actions/post';

function PostItem({
  auth,
  deletePost,
  post: {
    _id, text, name, avatar, user, comments, date, loading,
  },
  showActions,
}) {
  return loading ? (
    <Spinner />
  ) : (
    <div className="post-users bg-white p-1 my-4">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt="avatar" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on
          <Momment format="YYYY/MM/DD">{date}</Momment>
        </p>
        {showActions && (
        <>
          <Link to={`/posts/${_id}`} className="btn btn-primary">
            Discussion
            {comments.length > 0 && (
            <span className="comment-count">
              {comments.length}
            </span>
            )}
          </Link>
          {!auth.loading && (
          <button onClick={() => deletePost(_id)} type="button" className="btn btn-danger">
            <i className="fas fa-times" />
          </button>
          )}
        </>
        )}
      </div>
    </div>
  );
}

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deletePost })(PostItem);
