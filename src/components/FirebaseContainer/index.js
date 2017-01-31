import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchData } from '../../reducers/firebase';

class FirebaseContainer extends Component {
  componentDidMount() {
    this.subscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataType !== nextProps.dataType) {
      this.subscribe(nextProps);
    }
  }

  hasReceivedData(props = this.props) {
    const dataType = props.dataType;
    return props[dataType] && props[dataType].hasReceivedData;
  }

  subscribe(props = this.props) {
    const { dataType, dispatch } = props;
    if (!this.hasReceivedData(props)) {
      // Since we don't have this data yet, get it!
      dispatch(fetchData(dataType, props.options));
    }
  }

  render() {
    const { loading, children } = this.props;
    if (loading || !this.hasReceivedData()) {
      return <div className="Loading">Loading...</div>;
    }
    return children || null;
  }
}

FirebaseContainer.propTypes = {
  children: PropTypes.node,
  dataType: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  options: PropTypes.object,
};

FirebaseContainer.defaultProps = {
  options: {},
};

function mapStateToProps(state, ownProps) {
  const { dataType } = ownProps;
  return {
    [dataType]: state.firebase && state.firebase[dataType],
    loading: state.firebase.loading,
  };
}

export default connect(mapStateToProps)(FirebaseContainer);
