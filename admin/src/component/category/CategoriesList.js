import React, { Fragment } from "react";
import {
  ListGuesser,
  FieldGuesser
} from "@api-platform/admin";
import {
  ImageField,
  TextField,
  ReferenceField,
  Datagrid,
  BulkDeleteButton,
  ShowButton,
  EditButton,
  ListButton
} from "react-admin";
import { Button } from "@material-ui/core";
import ResetViewsButton from "./ResetViewsButton";

const PostBulkActionButtons = props => (
  <Fragment>
    <ResetViewsButton label="Reset Views" {...props} />
    {/* default bulk delete action */}
    <BulkDeleteButton {...props} />
  </Fragment>
);

const CategoriesList = props => (
  <ListGuesser
    {...props}
    title={'Catégories de produits'}
    //bulkActionButtons={PostBulkActionButtons}
  >
    {console.log('props', props)}

      <ReferenceField label={'Image'} source={'image'} reference={'images'}>
        <ImageField source="url" title={"title"} />
      </ReferenceField>

      <TextField source="name" label={'Nom'} />
      <TextField source="description" label={'Description'} />
      {/*<FieldGuesser source="isValid" />*/}
      <FieldGuesser source="platformFee" />
      <FieldGuesser source={null} label={'Actions'}>
        <ShowButton/>
        <EditButton/>
      </FieldGuesser>


    {/* While deprecated fields are hidden by default, using an explicit FieldGuesser component allows to add them back. */}

  </ListGuesser>
);

export default CategoriesList;
