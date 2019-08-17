/**
 * Author: iracanyes
 * Date: 17/08/2019
 * Description: Authorization header bearer
 * Ajouter l'en-tête Authorization : Bearer $token
 */

export default  function authHeader() {
  let user = JSON.parse(localStorage.getItem("user"));

  if(user && user.token)
  {
    return {'Authorization': "Bearer " + user.token };
  }else{
    return {};
  }


}
