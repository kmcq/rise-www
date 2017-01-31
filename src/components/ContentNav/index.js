import { connect } from 'react-redux';
import ContentNav from './ContentNav';

const mapStateToProps = (state) => {
  return {
    path: state.routing.locationBeforeTransitions.pathname
  };
};

const ConnectedContentNav = connect(mapStateToProps)(ContentNav);
ConnectedContentNav.displayName = 'ContentNav';
export default ConnectedContentNav;
