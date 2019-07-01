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


addLocaleData([...locale_fr, ...locale_rn, ...locale_en]);
