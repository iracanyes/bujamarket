/* eslint-disable no-use-before-define */
import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function AutoCompleteCategoryNamesInput(props) {
  const [value, setValue] = React.useState(props.defaultValue ? props.defaultValue : "");
  const [inputValue, setInputValue] = React.useState('');

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
        //getOptionSelected={(option, value) => value.name === option.name}
        inputValue={inputValue}
        getOptionLabel={(option) => option.name}
        style={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} value={value} name={props.name} label={props.label} variant="outlined" />}
      />
    </Fragment>

  );
}
