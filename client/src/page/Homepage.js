/**
 * Description: Home page of this app
 */
import React, {Component, Fragment} from 'react';
import { connect } from "react-redux";
import CarouselCategories from '../components/category/CarouselCategories';
import { reset } from "../actions/user/register";
import { reset as resetConnectedUser } from "../actions/user/login";
import UserAuth from "../layout/UserAuth";
import {FormattedMessage} from "react-intl";
import {toastWelcome} from "../layout/ToastMessage";
import {toast} from "react-toastify";


class Homepage extends Component
{
  constructor(props) {
    super(props);
    this.welcome = this.welcome.bind(this);
  }
  componentWillUnmount() {
    this.props.reset();
    this.props.resetConnectedUser();
  }

  welcome(){
    const { connectedUser, user } = this.props;

    if(user && user.firstname)
      toastWelcome(`Bienvenue ${ user.firstname + " " + user.lastname }, visitez votre boîte de réception pour valider votre inscription!`);

    if(connectedUser && connectedUser.firstname)
      toastWelcome(`Bienvenue ${ connectedUser.firstname + " " + connectedUser.lastname }`);
  }

  render(){
    console.log('render - user register', this.props.user );
    console.log('render - user loggedIn', this.props.connectedUser );

    this.welcome();

    return <Fragment>
      <section>

        {/* Carousel - Categories  */}
        <section id={'home-carousel-categories'} className="mx-auto category-cards bg-transparent pt60 pb60 mb-5">
          <h1>
            <FormattedMessage
              id={'app.products_category'}
              defaultMessage={"Catégories de produit"}
              description={"Products' category"}
            />
          </h1>
          <div className="container-fluid">
            <CarouselCategories />
          </div>

        </section>
        {/* End Carousel - Categories */}

        {/* Parallax image 1 */}
        <div className="parallax parallax-main parallax1 parallax-plus-box">

          <UserAuth />


        </div>





      </section>
    </Fragment>

  }
}

const mapStateToProps = state => {
  const { success: user } = state.user.registration;
  const { login : connectedUser } = state.user.authentication;
  return { user, connectedUser };
};

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  resetConnectedUser: eventSource => dispatch(resetConnectedUser(eventSource))
});
export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
