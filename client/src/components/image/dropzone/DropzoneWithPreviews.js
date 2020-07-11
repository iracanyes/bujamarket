import React, {useEffect, useState} from 'react';
import { withRouter } from "react-router";
import {connect} from "react-redux";
import Dropzone from 'react-dropzone';
import {
  Col,
  Button
} from "reactstrap";
import {toastError, toastSuccess} from "../../../layout/ToastMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProfileImage, reset  } from "../../../actions/image/profile";
import { del } from "../../../actions/image/delete";
import {injectIntl, FormattedMessage } from "react-intl";
import _ from "lodash";

class DropzoneWithPreviews extends React.Component
{
  constructor(props) {
    super(props);

    this.onDrop = (files) => {
      // Si aucun fichier présent => retour
      if(files.length === 0)
        return;

      const nbImages = this.state.files.length + files.length;
      if( nbImages > 10)
      {
        toastError(`Maximum 10 images! (${nbImages} images présentes.`);
        return;
      }

      //
      if(!this.props.multiple && document.getElementById('uploadedImage'))
        document.getElementById('uploadedImage').style.display = "none";

      // Récupération de(s) image(s)
      const myFiles = this.props.multiple ? this.state.newFiles.concat(files) : files;
      if(myFiles.length > 10)
      {
        toastError(`Maximum 10 images par produit! ${myFiles.length} images sélectionnées!`);
        return;
      }

      // Modification du nombre d'images dans le dropzone
      const dt = new DataTransfer();

      for(let i = 0; i < myFiles.length ; i++){
        if(myFiles[i].hasOwnProperty('path'))
          dt.items.add(myFiles[i]);
      }
      document.getElementsByName('images')[0].files =  dt.files;

      /* Mise à jour de l'état du composant */
      this.setState(
        state => ({
          ...state,
          newFiles: myFiles
        }),
        () => {files.map( file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))});


    };

    this.state = {
      files: [],
      newFiles: []
    }
  }

  componentDidMount() {
    if(this.props.data && this.props.data.length === 1)
      this.props.getProfileImage()

    if(this.props.images)
      this.setState(state => ({
        ...state,
        files: this.props.images
      }))

  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    // Revoke data uris for images given by the client
    this.state.newFiles.forEach(file => URL.revokeObjectURL(file.preview));
    // Revoke data uris for all images received from API
    this.props.data && this.props.data.map((file) => {
      URL.revokeObjectURL(file.src);
    });

    this.props.reset(this.props.eventSource);

  }

  deleteFile(file){

    // Si nouvelle image
    if(file.preview){
      //Supprimer le fichier temporaire
      file.preview && URL.revokeObjectURL(file.preview);

      // Supprimer l'image de la liste d'images du formulaire (FileList en readonly)
      const dt = new DataTransfer();
      const files = document.getElementsByName('images')[0].files;
      for(let i = 0; i < files.length; i++){
        if(files[i].hasOwnProperty('path') && files[i].path !== file.path)
          dt.items.add(files[i]);
      }
      document.getElementsByName('images')[0].files =  dt.files;

    }


    // Si image existante, supprimer de la DB
    file.url && this.props.deleteImage(file, this.props.history, this.props.location);

    // Supprimer le fichier de la liste des nouvelles images à ajouter
    this.setState(state => ({
      files: typeof file.url !== 'undefined' ? state.files.filter(my_file => my_file.url !== file.url ) : state.files,
      newFiles : typeof file.preview !== 'undefined' ? state.newFiles.filter(my_file => my_file.preview !== file.preview ) : state.newFiles
    }));
  }

  render (){
    const { retrieved, loading, error, data, deleted, deleteImageError, deleteImageLoading, intl } = this.props;

    deleteImageError && toastError(deleteImageError);
    deleted && toastSuccess(intl.formatMessage({
      id: 'app.image.deleted',
      defaultMessage: "Image supprimée!",
      description: "Image - Deleted"
    }));

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

    const files = this.state.files.map((file, index) => (
      <div className={"dropzone-thumb"} key={index}>
        <div className={"dropzone-thumb-inner"}>
          <div>
            <img src={file.url ? file.url : URL.createObjectURL(file)} />
          </div>
          <div className={"dropzone-preview-img-title"}>
            {_.truncate(file.title ? file.title : file.name, {length: 24, separator: " "}) }
            <br/>
            {file.size && ((file.size /1000 ) + " Kb")}
          </div>
        </div>
        <Button className={"btn-outline-danger"} onClick={() => this.deleteFile(file)}>
          <FontAwesomeIcon icon={"backspace"}/>
        </Button>
      </div>
    ));

    const newFiles = this.state.newFiles.map((file, index) => (
      <div className={"dropzone-thumb"} key={index}>
        <div className={"dropzone-thumb-inner"}>
          <div>
            <img src={file.url ? file.url : URL.createObjectURL(file)} />
          </div>
          <div className={"dropzone-preview-img-title"}>
            {_.truncate(file.title ? file.title : file.name, {length: 24, separator: " "}) }
            <br/>
            {file.size && ((file.size /1000 ) + " Kb")}
          </div>
        </div>
        <Button className={"btn-outline-danger"} onClick={() => this.deleteFile(file)}>
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
              <input {...getInputProps()} name={this.props.inputName ? this.props.inputName : 'images'}/>
              <p>Glisser et Déposer vo(tre|s) image ici, ou Cliquer pour choisir vo(tre|s) image(s)</p>
            </div>
            <aside>
              <label>Images uploadées</label>
              <div id={"dropzone-preview"} >
                { retrievedProfileImage && retrievedProfileImage }
                { files && files }
                { newFiles && newFiles }
              </div>
            </aside>
          </Col>

        )}
      </Dropzone>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error, eventSource } = state.image.profile;
  const { deleted, loading: deleteImageLoading, error: deleteImageError } = state.image.del;

  return { retrieved, loading, error, eventSource, deleted, deleteImageError, deleteImageLoading };
};

const mapDispatchToProps = dispatch => ({
  getProfileImage: () => dispatch(getProfileImage()),
  deleteImage: (item, history, location) => dispatch(del(item, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(DropzoneWithPreviews)));
