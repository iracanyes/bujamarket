import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {Redirect, withRouter} from "react-router";
import { unsubscribe } from "../../actions/user/unsubscribe";
import {injectIntl, FormattedMessage } from "react-intl";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Unsubscribe extends Component
{
  constructor(props) {
    super(props);
    this.state= {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  toggle()
  {
    this.setState(state => ({
      ...state,
      modal: !state.modal
    }))
  }

  unsubscribe()
  {
    this.props.unsubscribe(this.props.history, this.props.location);
  }

  render() {
    const user = localStorage.getItem('token')
                  ? JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
                  : null;

    if(user === null || !user.roles.includes('ROLE_MEMBER'))
      return (
        <Redirect to={{ pathname: '../login', state: { from: this.props.location.pathname }} } />
      );

    if(this.props.unsubscribed)
      return (<Redirect to={ { pathname: '../' } } />)

    return (
      <Fragment>
        <div id={'unsubscribe'} className={'container'}>
          <h1>
            <FormattedMessage
              id={'app.unsubscribe'}
              defaultMessage={"Désinscription"}
              description={"Unsubscribe"}
            />
          </h1>
          <div>
            <p>
              1. La personne concernée a le droit d'obtenir du responsable du traitement l'effacement, dans les meilleurs délais, de données à caractère personnel la concernant et le responsable du traitement a l'obligation d'effacer ces données à caractère personnel dans les meilleurs délais, lorsque l'un des motifs suivants s'applique:

              a) les données à caractère personnel ne sont plus nécessaires au regard des finalités pour lesquelles elles ont été collectées ou traitées d'une autre manière;

              b) la personne concernée retire le consentement sur lequel est fondé le traitement, conformément à l'article 6, paragraphe 1, point a), ou à l'article 9, paragraphe 2, point a), et il n'existe pas d'autre fondement juridique au traitement;

              c) la personne concernée s'oppose au traitement en vertu de l'article 21, paragraphe 1, et il n'existe pas de motif légitime impérieux pour le traitement, ou la personne concernée s'oppose au traitement en vertu de l'article 21, paragraphe 2;

              d) les données à caractère personnel ont fait l'objet d'un traitement illicite;

              e) les données à caractère personnel doivent être effacées pour respecter une obligation légale qui est prévue par le droit de l'Union ou par le droit de l'État membre auquel le responsable du traitement est soumis;

              f) les données à caractère personnel ont été collectées dans le cadre de l'offre de services de la société de l'information visée à l'article 8, paragraphe 1.

              2. Lorsqu'il a rendu publiques les données à caractère personnel et qu'il est tenu de les effacer en vertu du paragraphe 1, le responsable du traitement, compte tenu des technologies disponibles et des coûts de mise en oeuvre, prend des mesures raisonnables, y compris d'ordre technique, pour informer les responsables du traitement qui traitent ces données à caractère personnel que la personne concernée a demandé l'effacement par ces responsables du traitement de tout lien vers ces données à caractère personnel, ou de toute copie ou reproduction de celles-ci.

              3. Les paragraphes 1 et 2 ne s'appliquent pas dans la mesure où ce traitement est nécessaire:

              a) à l'exercice du droit à la liberté d'expression et d'information;

              b) pour respecter une obligation légale qui requiert le traitement prévue par le droit de l'Union ou par le droit de l'État membre auquel le responsable du traitement est soumis, ou pour exécuter une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement;

              c) pour des motifs d'intérêt public dans le domaine de la santé publique, conformément à l'article 9, paragraphe 2, points h) et i), ainsi qu'à l'article 9, paragraphe 3;


              d) à des fins archivistiques dans l'intérêt public, à des fins de recherche scientifique ou historique ou à des fins statistiques conformément à l'article 89, paragraphe 1, dans la mesure où le droit visé au paragraphe 1 est susceptible de rendre impossible ou de compromettre gravement la réalisation des objectifs dudit traitement; ou

              e) à la constatation, à l'exercice ou à la défense de droits en justice.
            </p>
          </div>
          <div className="d-flex">
            <div className={'button-actions'}>
              <button
                className="btn btn-outline-danger mr-3"
                onClick={() =>  this.toggle()}
              >
                <FormattedMessage
                  id={"app.button.confirm_unsubscribe"}
                  defaultMessage={"Confirmer la dés-inscription"}
                  description={"Confirm unsubscribe"}
                />
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => this.props.history.push(this.props.location.state.from)}
              >
                <FormattedMessage
                  id={"app.button.cancel"}
                />
              </button>
            </div>

          </div>
          <Modal isOpen={this.state.modal} toggle={() => this.toggle()} className={'modal-unsubscribe'} backdrop={'static'} keyboard={true}>
            <ModalHeader toggle={ () => this.toggle()}>
              <FontAwesomeIcon icon={'frown-open'} className={'mr-2'}/>
              <FormattedMessage
                id={"app.sad_to_see_you_living_us"}
                defaultMessage={"Nous sommes triste de vous voir nous quitter!"}
              />

            </ModalHeader>
            <ModalBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => this.unsubscribe()}>
                <FormattedMessage
                  id={"app.button.confirm"}
                  defaultMessage={"Confirmer"}
                />
              </Button>{' '}
              <Button
                color="secondary"
                onClick={() => this.toggle()}
              >
                <FormattedMessage
                  id={'app.button.cancel'}
                  defaultMessage={"Annuler"}
                />
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  unsubscribed: state.user.unsubscribe.unsubscribed,
  error: state.user.unsubscribe.error,
  loading: state.user.unsubscribe.loading
});

const mapDispatchToProps = dispatch => ({
  unsubscribe: (history, location) => dispatch(unsubscribe(history, location))
});

export default connect( mapStateToProps, mapDispatchToProps)(
  withRouter(injectIntl(Unsubscribe))
);
