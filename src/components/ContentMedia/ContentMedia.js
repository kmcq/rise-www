import React from 'react';
import Dropzone from 'react-dropzone';
import FirebaseContainer from '../FirebaseContainer';

const TABS = ['Images', 'PDFs'];

class ContentMedia extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: TABS[0]
    };
  }

  onChange(type, value) {
    this.setState({ [type]: value });
  }

  onDrop(type, acceptedFiles, rejectedFiles) {
    acceptedFiles.forEach((file) => {
      this.props.uploadFile(type, file);
    });
  }

  renderImages() {
    const images = this.props.images;
    if (!images) return;
    const imageComponents = images.valueSeq().map((image, index) => {
      return (
        <div
          key={index}
          className="ContentMedia-image-container"
          onClick={() => this.props.addImage(image.url)}
        >
          <img src={image.url} className="ContentMedia-image" role="presentation" />
        </div>
      );
    });
    return (
      <div>
        <div>
          To add an image to this document, put your cursor where you want it
          to appear and select it below.
        </div>
        <br />
        {imageComponents}
      </div>
    );
  }

  renderPDFs() {
    const pdfs = this.props.pdfs;
    if (!pdfs) return;
    const pdfComponents = pdfs.valueSeq().map((pdf, index) => {
      return (
        <li
          key={index}
          className="ContentMedia-PDF-link"
          onClick={() => this.props.addPDF(pdf.url)}
        >
          {pdf.name}
        </li>
      );
    });
    return (
      <div>
        <div>
          To add a PDF to this document, select the text you want to link in the
          document and then click the PDF's name below.
        </div>
        <br />
        <ul>
          {pdfComponents}
        </ul>
      </div>
    );
  }

  renderMedia(type) {
    switch (type) {
      case 'image':
        return this.renderImages();
      case 'PDF':
        return this.renderPDFs();
      default:
        return null;
    }
  }

  renderMediaSelect(type) {
    return (
      <div>
        <br />
        <Dropzone
          activeClassName="ContentMedia-dropzone-active"
          className="ContentMedia-dropzone"
          onDrop={(accepted, rejected) => this.onDrop(type, accepted, rejected)}
        >
          <div>
            To upload a {type}, either drag and drop it here or click to choose a file.
          </div>
        </Dropzone>
        <div className="ContentMedia-media">
          {this.renderMedia(type)}
        </div>
      </div>
    );
  }

  renderTabHeaders() {
    const activeTab = this.state.activeTab;
    const tabHeaders = TABS.map((tab) => {
      const active = tab === activeTab;
      return (
        <span
          key={tab}
          className={`Nav-link${active ? '-active' : ''}`}
          onClick={() => this.setState({ activeTab: tab })}
        >
          {tab}
        </span>
      );
    });
    return (
      <div className="Nav">
        {tabHeaders}
      </div>
    );
  }

  renderTabs() {
    switch (this.state.activeTab) {
      case 'Images':
        return this.renderMediaSelect('image');
      case 'PDFs':
        return this.renderMediaSelect('PDF');
      default:
        return null;
    }
  }

  render() {
    return (
      <FirebaseContainer dataType="media/image">
        <FirebaseContainer dataType="media/PDF">
          <div className="ContentMedia">
            <h2 className="center callout">
              Add media
            </h2>
            {this.renderTabHeaders()}
            {this.renderTabs()}
          </div>
        </FirebaseContainer>
      </FirebaseContainer>
    );
  }
}

ContentMedia.propTypes = {
};

export default ContentMedia;
