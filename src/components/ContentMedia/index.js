import { connect } from 'react-redux';
import ContentMedia from './ContentMedia';
import { dataAt, uploadFile } from '../../reducers/firebase';

const mapStateToProps = (state) => {
  let images = dataAt(state, 'media/image');
  let pdfs = dataAt(state, 'media/PDF');
  return {
    images,
    pdfs
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile(fileType, file) {
      dispatch(uploadFile(fileType, file));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentMedia);
