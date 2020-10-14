import React, { Fragment } from "react";
import { Rating } from "@material-ui/lab";
import {
  MdSentimentVeryDissatisfied,
  MdSentimentDissatisfied,
  MdSentimentSatisfied,
  MdSentimentVerySatisfied
} from 'react-icons/md';


const customIcons = {
  1: {
    icon: <MdSentimentVeryDissatisfied />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <MdSentimentDissatisfied />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <MdSentimentSatisfied />,
    label: 'Neutral',
  },
  4: {
    icon: <MdSentimentSatisfied />,
    label: 'Satisfied',
  },
  5: {
    icon: <MdSentimentVerySatisfied />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function CustomizedRating(props){
  return (<Fragment>
    <Rating
      name="customized-icons"
      defaultValue={2}
      getLabelText={(value) => customIcons[value].label}
      IconContainerComponent={IconContainer}
    />
  </Fragment>);
}
