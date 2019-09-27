/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description:
 */
import React, {Component, Fragment} from 'react';
import CarouselCategories from '../components/category/CarouselCategories';
import UserAuth from "./UserAuth";
import FlashInfo from "./FlashInfo";


export default class Homepage extends Component
{
  constructor(props)
  {
    super(props);
  }

  render(){


    return <Fragment>
      <section id="main-content" className="float-left">
        <div className="flash-message col-lg-6 mx-auto text-center my-2">
          {sessionStorage.getItem("flash-message") !== null && (
            <FlashInfo color={"success"} message={JSON.parse(sessionStorage.getItem("flash-message")).message}/>
          )}
        </div>

        {/* Carousel - Categories  */}
        <section className="category-cards bg-transparent pt60 pb60">
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
