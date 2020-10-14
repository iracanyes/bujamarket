import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { injectIntl, FormattedMessage } from "react-intl";

class PublicationRules extends Component
{
  render() {
    return (
      <Fragment>
        <div className="container">
          <h1>
            <FormattedMessage
              id={"app.publication_rules"}
              defaultMessage={"Règles de publication"}
              description={"Page - Publication rules title"}
            />
          </h1>
          <div>
            <h3>1. Droit et publication en ligne</h3>
            <h4>1.1 Droit et publication en ligne</h4>
            <p>
              Utilisation de ce documentCe   document   est   distribué   sous   licence  Creative   CommonsBY-NC  (http://creativecommons.org/licenses/by-nc-nd/2.0/fr/) par  Laurent Delineau  (laurent.delineau@ac-poitiers.fr) qui en est l'auteur original et le détenteur du droitd'auteur.Vous êtes libres de reproduire, distribuer et communiquer ce document au public selon les conditions suivantes :      Paternité — Vous devez citer le nom de l'auteur.
            </p>
            <p>
              Pas d'Utilisation Commerciale — Vous n'avez pas le droit d'utiliser cette création à des fins commerciales.1. L'édition et la publication sur le Web1.1. Les informations obligatoiresUn   se   site   Web   est   considéré   légalement   comme   un   «service de communication au public en ligne»   et   doitobligatoirement afficher des informations (mentions légales) sur les personnes qui l’éditent et qui l’hébergent (article 6-III de la loi pour la confiance dans l’économie numérique du 21 juin 2004)On distingue deux cas selon que l’éditeur est ou non un professionnel.Les éditeurs considérés comme professionnelsLes   éditeurs     professionnels   (dont   font   partie   les   établissements   scolaires)   sont   soumis   à   l’obligation   de   mettre   àdisposition du public :1.si l'éditeur est une personne physique : nom, prénom, domicile et numéro de téléphone et le cas échéant,numéro d'inscription au registre du commerce et des sociétés ou au répertoire des métiers.2.si l'éditeur est une  personne morale  (cas d'un établissement scolaire) :  dénomination  ou raison sociale etsiège   social,   numéro   de  téléphone   et   le  cas   échéant,   le  capitale  et   le   numéro   d'inscription   au   registre  ducommerce et des sociétés ou au répertoire des métiers.3.le nom du directeur ou du codirecteur de la publication (souvent le chef d’établissement dans le cas d'unétablissement scolaire) et, le cas échéant, celui du responsable de la rédaction au sens de l'article 93-2 de la loin° 82-652 du 29 juillet 1982 (souvent l’enseignant en charge du suivi du site);4.le nom, la dénomination ou la raison sociale et l'adresse et le numéro de téléphone de son hébergeur.Si le directeur de publication n'est pas la personne qui gère et organise le site («producteur» au sens géal ou encore«webmestre» ou «responsable de publication»), il est conseillé de faire également figurer le nom de la personne encharge de cette fonction (voir plus bas).Les éditeurs non professionnels Les éditeurs non professionnels peuvent ne mettre  à la disposition du public, pour préserver leur anonymat, que le nom,la dénomination ou la raison sociale et l'adresse de leur hébergeur.L’intérêt de ces mentions obligatoires est de faciliter la mise en œuvre de la responsabilité en cas de préjudice suite à lapublication d’informations sur le site WebRemarque : Légalement, le rectorat est considéré comme un hébergeur de sites. En tant qu'hébergeur, le rectorat ne peut donc pasêtre poursuivi si, à son insu, des sites qu'il héberge contiennent des propos négationnistes et des messages incitant à lahaine raciale. De façon générale, l'hébergeur n'est pas soumis à une obligation de surveillance des informations qu'il transmet ou stocke
            </p>
          </div>

        </div>

      </Fragment>
    );
  }
}

export default withRouter(injectIntl(PublicationRules));
