/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description: Home page of this app
 */
import React, {Component, Fragment} from 'react';
import CarouselCategories from '../components/category/CarouselCategories';
import UserAuth from "../layout/UserAuth";



export default class Homepage extends Component
{


  render(){


    return <Fragment>
      <section>

        {/* Carousel - Categories  */}
        <section className="mx-auto category-cards bg-transparent pt60 pb60">
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
