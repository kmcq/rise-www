import React from 'react';

export default ({ addLink, onChange, value }) => {
  return (
    <div className="sans">
      <input
        onChange={onChange}
        placeholder="https://www.example.com"
        value={value}
      />
      <button onClick={addLink}>
        Add link
      </button>
    </div>
  );
};
