/**
 * Author: iracanyes
 * Date: 11/8/19
 * Description:
 */
import React, { Component } from 'react';
import {FormattedMessage} from "react-intl";
import {IconButton, Tooltip} from "@material-ui/core";
import {FaDribbble, FaFacebook, FaGooglePlus, FaInstagram, FaLinkedin, FaPinterest, FaTwitter} from "react-icons/all";

class Footer extends Component
{
  render()
  {
    return (

      <footer className="footer">
        <div className="footer-top">
          <div className="col-lg-8 mx-auto">
            <div className="d-inline-flex">
              <div className="col-sm-4 p-2 mr-2">
                <h2>
                  <FormattedMessage
                    id={'app.about'}
                    defaultMessage={"À propos de"}
                    description={"About"}
                  />
                  &nbsp;
                  {String(process.env.REACT_APP_NAME).replace(/"/g, "")}
                </h2>

                <p>{String(process.env.REACT_APP_DESCRIPTION).replace(/"/g, "")}</p>
              </div>
              {/* /.col-* */}

              <div className="col-sm-4 p-2 mr-2">
                <h2>Contact Information</h2>

                <p>
                  {String(process.env.REACT_APP_OWNER_ADDRESS).replace(/"/g, "")}
                  <br/>
                  {String(process.env.REACT_APP_OWNER_PHONE_NUMBER).replace(/"/g, "") +', '}
                  <br/>
                  <span>
                    {String(process.env.REACT_APP_OWNER_CONTACT_EMAIL).replace(/"/g, "")}
                  </span>
                </p>
              </div>
              {/* /.col-* */}

              <div className="col-sm-4 p-2 mr-2">
                <h2>Suivez-nous</h2>

                <ul className="social-links nav nav-pills">
                  <li>
                    <Tooltip title={"Twitter"} placement={'top'}>
                      <IconButton>
                        <FaTwitter />
                      </IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={"Facebook"} placement={'top'}>
                      <IconButton>
                        <FaFacebook />
                      </IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={'Google+'} placement={'top'}>
                      <IconButton>
                        <FaGooglePlus/>
                      </IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={"Linkedin"} placement={'top'}>
                      <IconButton>
                        <FaLinkedin/>
                      </IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={"Dribbble"} placement={'top'}>
                      <IconButton><FaDribbble/></IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={"Instagram"} placement={'top'}>
                      <IconButton><FaInstagram /></IconButton>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title={"Pinterest"} placement={'top'}>
                      <IconButton><FaPinterest /></IconButton>
                    </Tooltip>
                  </li>
                </ul>
                {/* /.header-nav-social */}
              </div>
              {/* /.col-* */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container */}
        </div>
        {/* /.footer-top */}

        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-left">
              &copy; 2020 All rights reserved. Created by <a className={'text-white ml-1'} href="https://iracanyes.com" target={"_blank"} rel="noopener noreferrer">Iracanyes</a>.
            </div>
            {/* /.footer-bottom-left */}

            <div className="footer-bottom-right">
              <ul className="nav nav-pills">
                <li><a href="index.html">Home</a></li>
                <li><a href="pricing.html">Pricing</a></li>
                <li><a href="terms-conditions.html">Termes &amp; Conditions</a></li>
                <li><a href="contact-1.html">Contact</a></li>
              </ul>
              {/* /.nav */}
            </div>
            {/* /.footer-bottom-right */}
          </div>
          {/* /.container */}
        </div>
      </footer>
    );
  }
}

export default Footer;
