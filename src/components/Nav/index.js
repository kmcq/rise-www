import { connect } from 'react-redux';
import Nav from './Nav';

const mapStateToProps = (state) => {
  return {
    path: state.routing.locationBeforeTransitions.pathname
  };
};

const ConnectedNav = connect(mapStateToProps)(Nav);
ConnectedNav.displayName = 'Nav';
export default ConnectedNav;
