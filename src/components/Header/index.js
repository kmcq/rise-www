import { connect } from 'react-redux';
import Header from './Header';

const mapStateToProps = (state) => {
  return {
    path: state.routing && state.routing.locationBeforeTransitions.pathname
  };
};

export default connect(mapStateToProps)(Header);
