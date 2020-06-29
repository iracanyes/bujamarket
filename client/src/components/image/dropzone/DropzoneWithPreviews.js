import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import Dropzone from 'react-dropzone';
import {
  Col,
  Button
} from "reactstrap";
import {toastError} from "../../../layout/ToastMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfileImage  } from "../../../actions/image/profile";


class DropzoneWithPreviews extends React.Component
{
  constructor(props) {
    super(props);

    this.onDrop = (files) => {
      // Si aucun fichier présent => retour
      if(files.length === 0)
        return;

      //
      if(!this.props.multiple && document.getElementById('uploadedImage'))
        document.getElementById('uploadedImage').style.display = "none";

      // Récupération de(s) image(s)
      const myFiles = this.props.multiple ? this.state.files.concat(files) : files;

      if(myFiles.length >= 10)
      {
        toastError("Maximum 10 images!");
        return;
      }


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

  componentDidMount() {
    if(this.props.data && this.props.data.length === 1)
      this.props.getProfileImage()

  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    // Revoke data uris for images given by the client
    this.state.files.forEach(file => URL.revokeObjectURL(file.preview));
    // Revoke data uris for all images received from API
    this.props.data && this.props.data.map((file) => {
      URL.revokeObjectURL(file.src);
    });

  }

  deleteNewFile(newFile){

    //Supprimer le fichier temporaire
    URL.revokeObjectURL(newFile.preview);

    // Supprimer le fichier de la liste des nouvelles images à ajouter
    this.setState(state => ({
      files: state.files.filter(file => file.preview !== newFile.preview )
    }));
  }

  render (){
    const { retrieved, loading, error, data } = this.props;

    console.log('files retrieved', retrieved);
    console.log('files state', this.state.files);

    const retrievedProfileImage = this.props.data && this.props.data.map(item => (
      <div id={"uploadedImage"} className={"dropzone-thumb"} key={item.filename}>
        <div className={"dropzone-thumb-inner"}>
          <div>
            <img src={retrieved} />
          </div>
          <div className={"dropzone-preview-img-title"}>
            { item.filename }
            <br/>
            { item.size && (item.size + " bytes") }
          </div>
        </div>
        <Button className={"btn-outline-danger"}>
          <FontAwesomeIcon icon={"backspace"} />
        </Button>
      </div>
    ));

    const files = this.state.files.map(file => (
      <div className={"dropzone-thumb"} key={file.name}>
        <div className={"dropzone-thumb-inner"}>
          <div>
            <img src={URL.createObjectURL(file)} />
          </div>
          <div className={"dropzone-preview-img-title"}>
            {file.name}
            <br/>
            {file.size && (file.size + " bytes")}
          </div>
        </div>
        <Button className={"btn-outline-danger"} onClick={() => this.deleteNewFile(file)}>
          <FontAwesomeIcon icon={"backspace"}/>
        </Button>
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
              <div id={"dropzone-preview"} >
                { retrievedProfileImage && retrievedProfileImage }
                { files }
              </div>
            </aside>
          </Col>

        )}
      </Dropzone>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error } = state.image.profile;
  return { retrieved, loading, error };
};

const mapDispatchToProps = dispatch => ({
  getProfileImage: () => dispatch(getProfileImage())
});

export default connect(mapStateToProps, mapDispatchToProps)(DropzoneWithPreviews);
