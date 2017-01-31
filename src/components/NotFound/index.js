import React from 'react';
import Link from 'react-router/lib/Link';

export default () => {
  return (
    <div className="NotFound container readable center">
      <div>
        <h1>
          Oops, looks like we don't know what you're looking for there.
        </h1>
        <div>
          Please try going to our <Link to="/">home page</Link>.
        </div>
      </div>
    </div>
  );
};
