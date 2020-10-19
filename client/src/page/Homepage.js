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
import {LovedByCustomers} from "../components/supplierproduct";


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
    const { registerNotification, loginNotification } = this.props;
    const user = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) :  null;

    (user !== null && registerNotification.length > 0) && toastWelcome(registerNotification);
    (user !== null && loginNotification.length > 0) && toastWelcome(loginNotification);
  }

  render(){
    const { registerNotification, loginNotification } = this.props;

    (registerNotification || loginNotification ) && this.welcome();

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
        {/*--- Best rated products ---*/}
        <section className={'my-5'}>
          <h1>
            <FormattedMessage
              id={"app.supplier_product.best_rated"}
              defaultMessage={"Produits préférés par nos clients"}
              description={"Supplier Product - Best rated"}
            />
          </h1>
          <LovedByCustomers />
        </section>
        {/*--- Best rated products ---*/}
      </section>
    </Fragment>

  }
}

const mapStateToProps = state => {
  const { notify: registerNotification } = state.user.registration;
  const { notify: loginNotification } = state.user.authentication;
  return { registerNotification, loginNotification };
};

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  resetConnectedUser: eventSource => dispatch(resetConnectedUser(eventSource))
});
export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
