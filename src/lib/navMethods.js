export function href(link) {
  if (!link.root && this.props.relativePath) {
    return `${this.props.relativePath}${link.path}`
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
  }
  return link.path;
}

export function isIndexFor(link) {
  if (!link.indexLevels) return false;

  let isIndex = false;
  const pathLevels = this.href(link).split('/');
  link.indexLevels.forEach((indexLevel) => {
    if (indexLevel >= pathLevels.length) {
      // We're allowing this link to match paths deeper than its own
      const propsPathLevels = this.props.path.split('/');
      const propsPathToLinkSize = propsPathLevels.slice(0, pathLevels.length).join('/');
      if (propsPathToLinkSize === link.path) {
        isIndex = true;
      }
    } else {
      let indexPathForIndexLevel = pathLevels.slice(0, indexLevel + 1).join('/');
      indexPathForIndexLevel = indexPathForIndexLevel || '/';
      if (this.props.path === indexPathForIndexLevel) {
        isIndex = true;
      }
    }
  });

  return isIndex;
}

export function isActiveLink(link) {
  return this.href(link) === this.props.path || this.isIndexFor(link);
}
