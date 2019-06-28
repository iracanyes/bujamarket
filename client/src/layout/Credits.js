/**
 * Author: iracanyes
 * Date: 24/06/19
 * Description:
 */
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

class Credits extends Component
{
  constructor(props)
  {
    super(props);
  }

  render(){
    return <Fragment>
      <h4>Credits</h4>
      <p>
        Special thanks to this ones:
      </p>
      <ul>
        <li>
          <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"             title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"             title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </li>
        <li></li>
        <li></li>
      </ul>
    </Fragment>
  }
}
