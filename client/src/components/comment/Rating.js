import React from 'react';
import { Rating } from '@material-ui/lab';
import {MdStarBorder} from 'react-icons/md';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(1),
    },
  },
}));

export default function HalfRating(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
        <Rating name={props.name} defaultValue={2.5} precision={0.5} />
    </div>
  );
}
