/**
 * Author: iracanyes
 * Date: 09/08/2019
 * Description: User Authentication
 *
 */
import React, {Component, Fragment} from "react";
import RegisterForm from "../components/user/RegisterForm";
import {
  Row,
  Col,
  UncontrolledCollapse,
  Button,
  Card,
  CardBody,
} from "reactstrap";

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
            <Button color="primary" id="signin-form" className={"toggler-all"} style={{ marginBottom: '1rem' }}>
              Devenez membre
            </Button>
            <Button color="primary" id="login-form" className={"toggler-all"} style={{ marginBottom: '1rem' }}>
              Connexion
            </Button>
          </div>

          <Row>
            <Col>
              <UncontrolledCollapse toggler="#signin-form">

                <RegisterForm/>

              </UncontrolledCollapse>
            </Col>
            <Col>
              <UncontrolledCollapse toggler="#login-form">

                <Card>
                  <CardBody>
                    2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magni, voluptas debitis
                    similique porro a molestias consequuntur earum odio officiis natus, amet hic, iste sed
                    dignissimos esse fuga! Minus, alias.
                  </CardBody>
                </Card>

              </UncontrolledCollapse>
            </Col>
          </Row>

        </div>
      </div>

    </Fragment>);
  }
}

export default UserAuth;
