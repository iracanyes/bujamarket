import React, {useEffect, useState} from 'react';
import Dropzone from 'react-dropzone';
import {
  Col
} from "reactstrap";

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

/*
export function DropzoneWithPreviews(props) {
  const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}
*/

class DropzoneWithPreviews extends React.Component
{
  constructor() {
    super();

    this.onDrop = (files) => {
      this.setState({files}, () => {files.map( file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))});


    };

    this.state = {
      files: [],
    }
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));

  }

  render (){
    const files = this.state.files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          {console.log("file", file)}
          {console.log("file", JSON.stringify(file))}
          {console.log("file", URL.createObjectURL(file))}

          <img src={URL.createObjectURL(file)} style={img}/>
          <div>
            {file.name} - {file.size} bytes
          </div>
        </div>
      </div>
    ));

    console.log("files", this.state.files);

    return (
      <Dropzone onDrop={this.onDrop} accept={'image/*'}>
        {({ getRootProps, getInputProps }) => (
          <Col className={"container"}>
            <label htmlFor="">{this.props.label}</label>
            <div {...getRootProps({className:"dropzone" })}>
              <input {...getInputProps({multiple: this.props.multiple ? true : false})} name={'images'}/>
              <p>Glisser et Déposer votre image ici, ou Cliquer pour choisir votre image</p>
            </div>
            <aside>
              <label>Image uploadée</label>
              <div  style={thumbsContainer}>{files}</div>
            </aside>
          </Col>

        )}
      </Dropzone>
    );
  }
}

export default DropzoneWithPreviews;
