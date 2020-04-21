/**
 * Author: iracanyes
 * Date: 24/06/19
 * Description:
 */
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { FormattedMessage, injectIntl } from "react-intl";

class Credits extends Component
{
  constructor(props)
  {
    super(props);
  }

  render(){
    return <Fragment>
      <div className="col-lg-6 mx-auto">
        <div style={{textAlign:"center"}}>
          <h1>Remerciements</h1>
          <p>
            Remerciement sincères aux personnes et entités suivantes:
          </p>
        </div>
        <div>
          <ul>
            <li>
              ISL
              <ul>
                <li>

                </li>
                <li>

                </li>
                <li>

                </li>
              </ul>
            </li>
            <li>
              <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"             title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"             title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
            </li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>


    </Fragment>
  }
}

export default injectIntl(Credits);
