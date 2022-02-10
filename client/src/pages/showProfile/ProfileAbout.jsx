import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

function ProfileAbout({
  profile: {
    bio,
    user: { name },
  },
}) {
  return (
    <div className="profile-about bg-light">
      {bio && (
      <>
        <h2 className="text-primary">
          {name.trim().split(' ')[0]}
          s Bio
        </h2>
        <p>{bio}</p>
        <div className="line" />
      </>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
