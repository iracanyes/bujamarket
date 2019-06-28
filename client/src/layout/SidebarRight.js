/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description: SIDEBAR RIGHT
 */
import React, {Component, Fragment} from 'react';
import ReactDOM from "react-dom";
import {ConnectedRouter, push} from 'connected-react-router';
import {
    Card,
    CardText,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    UncontrolledCollapse
} from 'reactstrap';
import {Provider} from "react-redux";
import {Switch} from "react-router-dom";


export default class SidebarRight extends Component{
    render()
    {
        return (
            <Fragment>
                <div className="accordion" id="accordionAsideRight">
                    <Card className={"border-light"}>
                        <CardHeader id={"headingThree"}>
                            <CardTitle className={"mb-0"}>
                                <Button className={"btn-link btn-light collapsed"}
                                        data-toggle={"collapse"}
                                        aria-expanded={'false'}
                                        id={"collapseThree"}
                                >
                                    Recherche avancée
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#collapseThree"}>
                            <CardBody data-parent={"#accordionAsideRight"}>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1" className="sr-only">Recherche</label>
                                        <input type="email" className="form-control form-control-lg"
                                               id="exampleFormControlInput1" placeholder="Recherche..."/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect1">Example select</label>
                                        <select className="form-control form-control-sm" id="exampleFormControlSelect1">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect2">Example multiple select</label>
                                        <select multiple className="form-control form-control-sm"
                                                id="exampleFormControlSelect2">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </select>
                                    </div>
                                    <div className="col-auto my-1">
                                        <label className="mr-sm-2 sr-only"
                                               htmlFor="inlineFormCustomSelect">Preference</label>
                                        <select className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                            <option selected>Choose...</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Default checkbox
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" disabled/>
                                        <label className="form-check-label" htmlFor="defaultCheck2">
                                            Disabled checkbox
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-primary mb-2">Chercher</button>
                                </form>
                            </CardBody>
                        </UncontrolledCollapse>
                    </Card>
                    <Card className={"border-light"}>
                        <CardHeader id={'headingTwo'}>
                            <CardTitle className={"mb-0"}>
                                <Button className={"btn-link btn-light collapsed"}
                                        data-toggle={'collapse'}
                                        aria-expanded={"false"}
                                        id={"collapseTwo"}
                                >
                                    Articles récents
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#collapseTwo"} aria-labelledby={"heading-two"}>
                            <CardBody data-parent={"#accordionAsideRight"}>
                                {/* Recent Posts */}
                                <div className="mb-7">

                                    <div className="border rounded p-4">
                                        {/* Recent Posts List */}
                                        <ul className="list-unstyled">
                                            <li className="py-1"><a className="text-secondary" href="#">Remote workers,
                                                here's how to dodge distractions</a></li>
                                            <li className="dropdown-divider"></li>
                                            <li className="py-1"><a className="text-secondary" href="#">Create your
                                                adventure</a></li>
                                            <li className="dropdown-divider"></li>
                                            <li className="py-1"><a className="text-secondary" href="#">How to change
                                                careers or start a home-based business?</a></li>
                                            <li className="dropdown-divider"></li>
                                            <li className="py-1"><a className="text-secondary" href="#">Classic design
                                                principles</a></li>
                                        </ul>
                                        {/* End Recent Posts List */}
                                    </div>
                                </div>
                            </CardBody>
                        </UncontrolledCollapse>
                    </Card>
                    <Card className='card-author border-light'>
                        <CardHeader id="headingOne" className={"card-header"}>
                            <CardTitle className={"mb-0"}>
                                <Button className={"btn-link btn-light"}
                                        data-toggle={"collapse"}
                                        id={"collapseOne"}
                                        aria-expanded={"true"}
                                >
                                    Auteur
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#collapseOne"}>
                            <CardBody data-parent={"#accordionAsideRight"}>
                                <div className="media">

                                    <div className="media-body">
                                        <img className="xs-rounded-avatar rounded-circle mr-4 float-left" src="assets/img/icone/thoughtful-man.png" alt="Image Description"/>
                                        <h4 className="h5">Maria Muszynska</h4>
                                        <p>I am an ambitious workaholic, but apart from that, pretty simple person.
                                            Whether it's branding, print, UI + UX I've got you covered. I strive to
                                            figure out the right solutions for your look to stand out amongst the
                                            rest.</p>
                                        <a className="btn btn-sm btn-secondary" href="auteur.html">En savoir plus</a>
                                    </div>
                                </div>
                            </CardBody>
                        </UncontrolledCollapse>
                    </Card>
                    <Card className={"border-light"}>
                        <CardHeader id={"headingFour"}>
                            <CardTitle className={"mb-0"}>
                                <Button className={"btn-link btn-light collapsed"}
                                        data-toggle={'collapse'}
                                        aria-expanded={"false"}
                                        id={"collapseFour"}
                                >
                                    Question & Note sur l'article
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler={"#collapseFour"}>
                            <CardBody data-parent={"#accordionAsideRight"}>
                                <form>
                                    <div className="form-group row">
                                        <label htmlFor="staticEmail" className="col-sm-3 col-form-label">Email</label>
                                        <div className="col-sm-9">
                                            <input type="text" readOnly className="form-control-plaintext" id="staticEmail" value="email@example.com"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Type de message</label>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" id="questionType1" value="question"/>
                                            <label className="form-check-label" htmlFor="questionType1">Question
                                                dans le forum</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" id="questionType2"  value="note"/>
                                            <label className="form-check-label" htmlFor="questionType2">Note sur l'article</label>
                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="question">votre question</label>
                                        <textarea className="form-control" id="question" rows="3"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary mb-2">Envoyer</button>
                                </form>
                            </CardBody>
                        </UncontrolledCollapse>
                    </Card>

                </div>
            </Fragment>
        );
    }
}

ReactDOM.render(
     <SidebarRight/>,
    document.getElementById('aside-right')
);