import React, {Fragment} from "react";

export function CountryFlag(props)
{
  let retour = null;
  console.log("Language", props.isoCountry)
  switch(props.isoCountry)
  {
    case "BI":
      retour = <div className="bi"></div>;
      break;
    case "EN":
      retour = <div className="england"></div>;
      break;
    default:
      retour = <div className="fr"></div>;
      break;
  }

  return retour;
}
