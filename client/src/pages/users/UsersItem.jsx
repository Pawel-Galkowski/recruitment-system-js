import React from 'react';
import PropTypes from 'prop-types';

function UsersItem({
  profile: {
    user: { name, avatar },
  },
}) {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="avatar" className="round-img" />
      <div>
        <h2>{name}</h2>
      </div>
    </div>
  );
}

UsersItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default UsersItem;
