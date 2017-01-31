import React from 'react';
import Home from '../Home';

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = { email: '', password: '' };
  }

  onChange(type, value) {
    this.setState({ [type]: value });
  }

  onSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;
    this.props.signInByEmailPassword(email, password);
  }

  render() {
    if (this.props.currentUser) {
      return <Home />;
    } else if (this.props.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="center">
        <h2>Please sign in</h2>
        <form onSubmit={e => this.onSubmit(e)}>
          <label>Email</label>
          <div>
            <input
              type="email"
              onChange={e => this.onChange('email', e.target.value)}
              placeholder="you@nwforestworkers.org"
              value={this.state.email}
            />
          </div>
          <label>Password</label>
          <div>
            <input
              type="password"
              onChange={e => this.onChange('password', e.target.value)}
              value={this.state.password}
            />
          </div>
          <div>
            <button className="button secondary-background" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

SignIn.propTypes = {
  currentUser: React.PropTypes.object,
  children: React.PropTypes.node,
  loading: React.PropTypes.bool,
  signInByEmailPassword: React.PropTypes.func,
};

export default SignIn;
