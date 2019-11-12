/**
 * Author: dashouney
 * Date: 11/12/19
 * Description:
 */
import React, { createElement } from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';
import { withRouter } from 'react-router-dom';
import LabelIcon from '@material-ui/icons/Label';
import {
  Button
} from "@material-ui/core";

//import Responsive from '../layout/Responsive';

const SidebarLeftMenuLayout = ({ resources, onMenuClick, logout }) => (
  <div>
    {resources.map(resource => (
      <MenuItemLink
        key={resource.name}
        to={`/${resource.name}`}
        primaryText={resource.options && resource.options.label || resource.name}
        leftIcon={createElement(resource.icon)}
        onClick={onMenuClick}
      />
    ))}
    <MenuItemLink
      to="/custom-route"
      primaryText="Miscellaneous"
      leftIcon={<LabelIcon />}
      onClick={onMenuClick}
    />
    {/*
      <Responsive
        small={logout}
        medium={null} // Pass null to render nothing on larger devices
      />
    */}

  </div>
);

const mapStateToProps = state => ({
  resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(SidebarLeftMenuLayout));
