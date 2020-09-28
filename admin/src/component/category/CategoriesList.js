import React, { Fragment } from "react";
import {
  ListGuesser,
  FieldGuesser
} from "@api-platform/admin";
import {
  ImageField,
  TextField,
  ReferenceField,
  NumberField,
  List,
  BooleanField,
  Datagrid,
  BulkDeleteButton,
  ShowButton,
  EditButton,
  ListButton
} from "react-admin";
import { Button } from "@material-ui/core";
import {
  BsBookmarkCheck
} from "react-icons/bs";
import {
  ToastContainer
} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ValidateButton from "./ValidateButton";

const PostBulkActionButtons = props => (
  <Fragment>
    <ValidateButton label="Valider" {...props} />
    {/* default bulk delete action */}
    <BulkDeleteButton {...props} />
  </Fragment>
);

const CategoriesList = props => (
  <ListGuesser
    {...props}
    title={'Catégories de produits'}
    bulkActionButtons={<PostBulkActionButtons/>}
  >
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    {/* Same as */}
    <ToastContainer />
    {console.log('CategoriesList - props', props)}
      <ReferenceField label={'Image'} source={'image'} reference={'images'}>
        <ImageField source="url" title={"title"} />
      </ReferenceField>
      <TextField source="name" label={'Nom'} />
      <TextField source="description" label={'Description'} />
      {/*<FieldGuesser source="isValid" />*/}
      <NumberField source="platformFee" />
      <BooleanField source={'isValid'} label={'Valider'} />
    {/* While deprecated fields are hidden by default, using an explicit FieldGuesser component allows to add them back. */}

  </ListGuesser>
);

export default CategoriesList;
