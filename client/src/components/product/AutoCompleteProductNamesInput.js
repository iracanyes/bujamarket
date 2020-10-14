/* eslint-disable no-use-before-define */
import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function AutoCompleteProductNamesInput(props) {
  const [value, setValue] = React.useState( props.defaultValue ? props.defaultValue : "");
  const [inputValue, setInputValue] = React.useState(props.defaultValue ? props.defaultValue.title : "");

  return (
    <Fragment>
      {props.defaultValue && (
        <div>{`valeur actuelle: ${value !== null ? `'${value.title ? value.title : value.name}'` : 'null'}`}</div>
      )}
      <Autocomplete
        id={props.id}
        name={props.name}
        options={props.data}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        //getOptionSelected={(option, value) => value.title === option.title}
        inputValue={inputValue}
        getOptionLabel={(option) => option.title }
        style={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} value={value} name={props.name} label={props.label} variant="outlined" />}
      />
    </Fragment>

  );
}
