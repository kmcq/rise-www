import React from 'react';
import { DONATE_LINK } from '../../lib/constants';

export default function DonateCTA() {
  return (
    <div className="DonateCTA center">
      <div className="container">
        <div className="DonateCTA-content">
          <h3>
            Excellent stewardship requires excellent working conditions. Please help us create both in America's forests.
          </h3>
          <a
            className="button secondary-background sans"
            href={DONATE_LINK}
            target="_blank"
          >
            <h2>Please donate now</h2>
            <div className="DonateCTA-disclaimer">
              Secure donations through Network for Good
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
