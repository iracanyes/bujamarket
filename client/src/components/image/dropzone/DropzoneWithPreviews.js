import React, {useEffect, useState} from 'react';
import Dropzone from 'react-dropzone';
import {
  Col
} from "reactstrap";


const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


class DropzoneWithPreviews extends React.Component
{
  constructor(props) {
    super(props);

    this.onDrop = (files) => {
      if(files.length === 0)
        return;



      const myFiles = this.props.multiple ? this.state.files.concat(files) : files;

      if(myFiles.length >= 10)
        return;

      this.setState(
        {files: myFiles},
        () => {files.map( file => Object.assign(file, {
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
      <div className={"dropzone-thumb"} key={file.name}>
        <div className={"dropzone-thumb-inner"}>
          {console.log("file", file)}
          {console.log("file", JSON.stringify(file))}
          {console.log("file", URL.createObjectURL(file))}

          <div>
            <img src={URL.createObjectURL(file)} />
          </div>
          <div className={"dropzone-preview-img-title"}>
            {file.name} - {file.size} bytes
          </div>
        </div>
      </div>
    ));

    return (
      <Dropzone
        onDrop={this.onDrop}
        accept={'image/*'}
        multiple={this.props.multiple ? true : false}
        max
      >
        {({ getRootProps, getInputProps }) => (
          <Col className={"container"}>
            <label htmlFor={this.props.label}>{this.props.label}</label>
            <div {...getRootProps({className:"dropzone" })}>
              <input {...getInputProps()} name={'images'}/>
              <p>Glisser et Déposer votre image ici, ou Cliquer pour choisir votre image</p>
            </div>
            <aside>
              <label>Images uploadées</label>
              <div id={"dropzone-preview"} >{files}</div>
            </aside>
          </Col>

        )}
      </Dropzone>
    );
  }
}

export default DropzoneWithPreviews;
