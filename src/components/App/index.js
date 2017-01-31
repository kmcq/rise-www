import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

export default function({ children }) {
  return (
    <div className="App">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
