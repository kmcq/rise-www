import React from 'react';
import Link from 'react-router/lib/Link';
import Nav from '../Nav';

export default function Header({ path }) {
  const links = [
    { name: 'ABOUT US', path: '/about', indexLevels: [1, 2] },
    { name: 'OUR CAMPAIGNS', path: '/campaigns', indexLevels: [1, 2] },
    { name: 'GET INVOLVED', path: '/get-involved', indexLevels: [1, 2] }
  ];
  return (
    <div className="Header container">
      <div className="Header-content">
        <Link to="/" className="Header-title primary-foreground">
          <div className="Header-content-item">
            {/* removed logo from here, to be replaced later */}
          </div>
          <div className="Header-content-item">
            <h1>
              Resisting Injustice &amp; Standing for Equality
            </h1>
          </div>
        </Link>
        <div className="Header-nav">
          <Nav links={links} path={path} withDonate />
        </div>
      </div>
    </div>
  );
}
