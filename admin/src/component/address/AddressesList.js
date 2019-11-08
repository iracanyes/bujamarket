/**
 * Author: iracanyes
 *
 * Date: 11/8/19
 * Description:
 */
import React from "react";
import {
  ListGuesser,
  FieldGuesser
} from "@api-platform/admin";

const AddressesList = props => (
  <ListGuesser {...props}>
    <FieldGuesser source="locationName" />
    <FieldGuesser source="street" />
    <FieldGuesser source="number" />
    <FieldGuesser source="state" />
    <FieldGuesser source="country" />
  </ListGuesser>
);

export default AddressesList;
