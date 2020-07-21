import React from 'react';
import { AppBar, UserMenu } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles({
  avatar: {
    height: 30,
    width: 30,
  },
});

const MyCustomIcon = () => {
  const classes = useStyles();
  return (
    <Avatar
      className={classes.avatar}
      src="https://marmelab.com/images/avatars/adrien.jpg"
    />
  )
};

const MyUserMenu = props => (<UserMenu {...props} icon={<MyCustomIcon />} />);


const MyAppBar = props => (
  <AppBar {...props}>
    <Toolbar>
      <Typography variant="h6" component={"h2"} id="react-admin-title" >
        Buja Market
      </Typography>
    </Toolbar>
    <MyUserMenu />
  </AppBar>
);

export default MyAppBar;

