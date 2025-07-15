import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner" />
      <p className="loader-text">Loading, please wait...</p>
    </div>
  );
};

export default Loader;
