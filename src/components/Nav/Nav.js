import React from 'react';
import Link from 'react-router/lib/Link';
import { href, isActiveLink, isIndexFor } from '../../lib/navMethods';

class Nav extends React.Component {
  constructor() {
    super();
    this.href = href.bind(this);
    this.isActiveLink = isActiveLink.bind(this);
    this.isIndexFor = isIndexFor.bind(this);
  }

  linkClass(link) {
    if (this.isActiveLink(link)) {
      return 'Nav-link-active';
    }
    return 'Nav-link';
  }

  renderLinks() {
    return this.props.links.map((link) => {
      const linkClass = this.linkClass(link);
      return (
        <Link
          key={link.path}
          to={this.href(link)}
          className={linkClass}
        >
          {link.name}
        </Link>
      )
    });
  }

  render() {
    return (
      <div className="Nav sans">
        {this.renderLinks()}
      </div>
    );
  }
}

Nav.propTypes = {
  links: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    path: React.PropTypes.string
  })).isRequired,
  withDonate: React.PropTypes.bool
};

Nav.defaultProps = {
  links: [],
  relativePath: '',
  withDonate: false
};

export default Nav;
