/**
 * Author: iracanyes
 * Date: 09/08/2019
 * Description: User Authentication
 *
 */
import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";

class UserAuth extends Component
{
  render(){
    return (<Fragment>
      <div className={"container parallax-card bg-white "}>
        <h4 className={"text-center"}>
          Devenez membre et profitez de promotions exceptionnelles
        </h4>
        <div className="">
          <div className="mx-auto text-center">
            <Link to={'/register'}
                  color="primary" id="signin-form" className={"btn btn-outline-primary m-3"} style={{ marginBottom: '1rem' }}>
              Devenez membre
            </Link>
            <Link to={'/login'} color="primary" id="login-form" className={"btn btn-outline-primary m-3"} style={{ marginBottom: '1rem' }}>
              Connexion
            </Link>
          </div>

        </div>
      </div>

    </Fragment>);
  }
}

export default UserAuth;
