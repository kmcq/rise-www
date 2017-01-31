import React from 'react';
import DonateCTA from './DonateCTA';

export default function Footer() {
  return (
    <div className="Footer primary-background">
      <div className="Footer-donate-mobile only-phone">
        <DonateCTA />
      </div>
      <div className="Footer-content container">
        <div className="center">
          <h2 className="Footer-title">
            Resisting Injustice and Standing for Equality (RISE)
          </h2>
          <div className="Footer-addresses">
            <div className="Footer-address">
              <div>Address?</div>
            </div>
          </div>
          <div>
            contact info here
          </div>
        </div>
        <div className="no-phone">
          <DonateCTA />
        </div>
      </div>
    </div>
  );
}
