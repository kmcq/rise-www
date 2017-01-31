import React from 'react';
import Link from 'react-router/lib/Link';
import { href, isActiveLink, isIndexFor } from '../../lib/navMethods';

class ContentNav extends React.Component {
  constructor() {
    super();
    this.href = href.bind(this);
    this.isActiveLink = isActiveLink.bind(this);
    this.isIndexFor = isIndexFor.bind(this);
  }

  linkClass(link) {
    if (this.isActiveLink(link)) {
      return 'ContentNav-link-active';
    }
    return 'ContentNav-link';
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
    if (!this.props.links.length) { return null; }

    return (
      <div className="ContentNav sans">
        <div className="ContentNav-header">
          {this.props.sectionTitle}
        </div>
        {this.renderLinks()}
      </div>
    );
  }
}

ContentNav.propTypes = {
  links: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    path: React.PropTypes.string
  })).isRequired,
  sectionTitle: React.PropTypes.string.isRequired,
  withDonate: React.PropTypes.bool
};

ContentNav.defaultProps = {
  links: [],
  relativePath: '',
  withDonate: false
};

export default ContentNav;
