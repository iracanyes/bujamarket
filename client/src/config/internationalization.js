/**
 * Author: iracanyes
 * Date: 27/06/19
 * Description: Internationalisation - Données traduit localement
 */
import { addLocaleData } from "react-intl";
import locale_fr from "react-intl/locale-data/fr";
import locale_en from "react-intl/locale-data/en";
/* Remarque : Kirundi en IETF code & ISO 639-1 : rn  */
import locale_rn from "react-intl/locale-data/rn";

import messages_fr from "../translations/fr";
import messages_en from "../translations/en";
import messages_rn from "../translations/rn";

/* Ajout des données d'internationalisation  */
addLocaleData([...locale_fr, ...locale_rn, ...locale_en]);

/* Liste JSON des messages de l'application par langue
*  rn => pour la langue : Kirundi
*  */
const messages = {
  "en": messages_en,
  "fr": messages_fr,
  "rn": messages_rn
};

const language = navigator.language.split(/[-...]/)[0];

export { addLocaleData, messages, language };
