import { connect } from 'react-redux';
import ContentPiece from './ContentPiece';
import { dataAt, onChange, sortByOrder, writePost } from '../../reducers/firebase';
import createNewPost from '../../lib/createNewPost';

const mapStateToProps = (state, ownProps) => {
  const category = ownProps.route.path.split('/')[1];
  const currentUser = state.firebase.currentUser;

  let posts = sortByOrder(dataAt(state, `posts/${category}`));
  if (currentUser) {
    posts = posts.set('new', createNewPost());
  } else {
    posts = posts.filter(post => post.published);
  }

  const paramsSlug = ownProps.routeParams.slug;
  const post = posts.find(p => p.slug === paramsSlug) || posts.first();
  return {
    category,
    posts,
    post,
    signedIn: !!currentUser
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(category, post, oldSlug) {
      dispatch(onChange(category, post, oldSlug));
    },
    onSave(databaseAccessPoint, post) {
      dispatch(writePost(databaseAccessPoint, post));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentPiece);
