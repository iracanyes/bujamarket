import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  TabContent,
  TabPane,
  NavLink,
  NavItem,
  Nav,
  CardBody,
  Card,
  Media,
} from "reactstrap";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ProfileForumsWidget extends Component{
  constructor(props) {
    super(props);

    this.state = { activeTab: '1' };

    this.toggle = this.toggle.bind(this);
  }

  toggle = tab => {
    if(this.state.activeTab !== tab) this.setState({ activeTab: tab });
  }

  render(){
    const { activeTab } = this.state;

    return (
      <Fragment>
        <Card id={'profile-relation-widget'}>
          <CardBody>
            <div>
              <h3>
                <FormattedMessage id={"app.comments"} defaultMessage={"Tous les commentaires reçus"} />
              </h3>
            </div>
            <div className={"mt-2"}>
              <div>
                <div>
                  <Nav tabs>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === '1'})}
                               onClick={() => this.toggle('1')}
                      >
                        <FormattedMessage id={"app.all"} defaultMessage={"Tous"} description={"Forums - All"} />
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === '2'})}
                               onClick={() => this.toggle('2')}
                      >
                        <FormattedMessage id={"app.recent"} defaultMessage={"Commentaires récents"} description={"Comment - Recent comments"} />
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === '3'})}
                               onClick={() => this.toggle('3')}
                      >
                        <FormattedMessage id={"app.forum.chat_customer"} defaultMessage={"Chat client"} description={"Forum - Customer chat"} />
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === '4'})}
                               onClick={() => this.toggle('4')}
                      >
                        <FormattedMessage id={"app.forum.chat_customer"} defaultMessage={"Chat administrateur"} description={"Forum - Customer chat"} />
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={classnames({ active: activeTab === '5'})}
                               onClick={() => this.toggle('5')}
                      >
                        <FormattedMessage id={"app.forum.chat_customer"} defaultMessage={"Chat client"} description={"Forum - Customer chat"} />
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <div className={"mt-2"}>
                  <TabContent activeTab={ activeTab }>
                    <TabPane tabId={'1'}>
                      <div className={'form-group position-relative'}>
                        <input type="text" className="form-control"/>
                        <FontAwesomeIcon icon={"search"} className={'text-primary'}/>
                      </div>
                      <div>
                        <Media>
                          <img className={'rounded-circle'} src="https://picsum.photos/1200/800" alt="user image" title={"user image"}/>
                          <div className="media-body">
                            <h5>azer</h5>
                            <p>
                              azer qdfqqdfsdf qdfqfsq
                            </p>
                          </div>
                        </Media>
                      </div>
                    </TabPane>
                    <TabPane tabId={'2'}>

                    </TabPane>
                    <TabPane tabId={'3'}>

                    </TabPane>
                    <TabPane tabId={'4'}>

                    </TabPane>
                    <TabPane tabId={'5'}>

                    </TabPane>
                  </TabContent>
                </div>
              </div>
              <Col>

              </Col>
              <Col>

              </Col>
            </div>

          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

export default connect()(ProfileForumsWidget);
