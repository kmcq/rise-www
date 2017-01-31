import { connect } from 'react-redux';
import SignIn from './SignIn';
import { signInByEmailPassword } from '../../reducers/firebase';

const mapStateToProps = (state) => {
  if (state.firebase) {
    return {
      currentUser: state.firebase.currentUser,
      loading: state.firebase.loading,
    };
  }
  return {};
};

const mapDispatchToProps = (dispatch => (
  {
    signInByEmailPassword(email, password) {
      dispatch(signInByEmailPassword(email, password));
    },
  }
));

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
