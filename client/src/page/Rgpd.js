/**
 * Author: iracanyes
 * Date: 24/06/19
 * Description:
 */
import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { FormattedMessage, injectIntl } from "react-intl";

class Rgpd extends Component
{
  constructor(props)
  {
    super(props);
  }

  render(){
    return <Fragment>
      <div className="col-lg-6 mx-auto">
        <div className={{textAlign:"center"}}>
          <h1>Règlement général sur la protection des données (RGPD)</h1>
          <p>
            Le RGPD décrit vos droits lorsque vos données sont traitées.
          </p>
        </div>

        <div>

          <h5>Gardez le contrôle sur vos données !</h5>
          <p>
            Poster sur les réseaux sociaux, demander une carte de fidélité dans un magasin, remplir un formulaire sur Internet ou tout simplement participer à un concours sont désormais des activités de la vie courante. On envoie toutefois ainsi des données à caractère personnel à toutes sortes de personnes ou d’entités que l'on appelle généralement le "responsable du traitement".
          </p>
          <p>
            Vous avez des droits sur ces données que vous transmettez. Il est important que vous en soyez conscient afin d’éviter de mauvaises surprises.
          </p>
          <p>
            Ne vous êtes-vous pas déjà dit, lors de la réception d’une publicité pour un produit ou un service, "comment ont-ils eu mon adresse" ? C'est donc bien de cela qu'il s’agit : garder le contrôle de vos données.
          </p>
          <p>
            L'ancienne loi vie privée belge, qui était en fait la transposition en droit belge de la Directive 95/46/CE, vous donnait déjà certains droits spécifiques que vous pouviez faire valoir vous-même.
          </p>
          <p>
            Le RGPD, qui est d’application depuis mai 2018, va encore plus loin en mettant l’accent sur une plus grande transparence et un meilleur contrôle de vos données. Cette nouvelle législation renforce donc les droits existants et crée aussi un nouveau droit qui est le droit à la portabilité des données
          </p>
          <p>
            Pour plus d'informations : <a href="https://www.autoriteprotectiondonnees.be/reglement-general-sur-la-protection-des-donnees-citoyen">Règlement général sur la protection des données citoyen</a>
          </p>
        </div>
      </div>
    </Fragment>
  }
}

export default injectIntl(Rgpd);
