/**
 * Author: iracanyes
 * Date: 15/09/2019
 * Description:
 */
/* rating */
import  React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarChecked, faStarHalfAlt } from  "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

export default function Rating(props) {
    let n = Math.abs(props.rating) / 2;
    let n_entier = Math.floor(n);
    let n_decimal = n - n_entier;
    let retour = [];
    let key = 0;

    if(n > 0)
    {
      /* partie entière */
      for(let i = 0; i < n_entier; i++)
      {
        retour.push(<FontAwesomeIcon key={++key} icon={faStarChecked}/>);
      }

      if(n_decimal > 0.0)
      {
        if(n_decimal >= 0.5){

          retour.push(<FontAwesomeIcon key={++key} icon={faStarHalfAlt}/>);

          for(let i= 0; i < 5 - n_entier - 1 ; i++)
          {
            retour.push(<FontAwesomeIcon key={++key} icon={faStar}/>)
          }

        }else{
          for(let i= 0; i < 5 - n_entier ; i++)
          {
            retour.push(<FontAwesomeIcon key={++key} icon={faStar}/>)
          }
        }


      }else{
        for(let i= 0; i < 5 - n_entier ; i++)
        {
          retour.push(<FontAwesomeIcon key={++key} icon={faStar}/>)
        }
      }
    }else{
      for(let i = 0; i < 5; i++)
      {
        retour.push(<FontAwesomeIcon key={++key} icon={faStar}/>);
      }
    }




    return retour;

}
