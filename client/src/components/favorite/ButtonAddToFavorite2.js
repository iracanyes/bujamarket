/**
 * Author: iracanyes
 * Date: 21/04/20
 * Description:
 */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { del, reset as resetDelete } from '../../actions/favorite/delete';
import { create, reset } from '../../actions/favorite/create';
import { retrieveIds, reset as resetList } from '../../actions/favorite/list';
import {toastSuccess} from "../../layout/ToastMessage";


export class ButtonAddToFavorite2 extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      tooltipOpen: false,
      added: false
    };

    this.toggle = this.toggle.bind(this);
    this.addToFavorite = this.addToFavorite.bind(this);
    this.deleteFavorite = this.deleteFavorite.bind(this);
  }

  componentDidMount() {
    if(localStorage.getItem('token') !== null)
      this.props.list(this.props.history, this.props.location);
  }

  componentWillUnmount() {
    this.props.resetCreate();
    this.props.resetDelete();
    this.props.resetList();
  }

  toggle = () => {
    let { tooltipOpen } = this.state;
    this.setState({tooltipOpen: !tooltipOpen});
  };

  deleteFavorite()
  {
    const { tooltipOpen } = this.state;
    this.props.delete(this.props.supplierProductId, this.props.history, this.props.location);
    this.setState({tooltipOpen: tooltipOpen, added: false});
  }

  addToFavorite()
  {
    const { tooltipOpen } = this.state;

    if(localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites')).filter( el => el.id === this.props.supplierProductId).length > 0)
      return;
    if(localStorage.getItem('token') !== null)
    {
      this.props.create(this.props.supplierProductId, this.props.history, this.props.location);
      this.setState({tooltipOpen: tooltipOpen, added: true});
    }else{
      this.props.history.push({path:"../../login", state: { from: window.location.pathname }});
    }
  }

  render()
  {
    let { tooltipOpen, added } = this.state;
    const { notification, created, deleted } = this.props;

    (notification && notification.length > 0 ) && toastSuccess(notification);


    // Création de la liste des favoris à partir des données DB
    if(deleted === null && created === null)
      this.props.retrieved && localStorage.setItem('favorites', JSON.stringify(this.props.retrieved.favorites));

    // Vérification de l'existence du produit proposé par le fournisseur dans la liste des favoris
    let item = [];
    let favorites = [];
    if(localStorage.getItem('favorites')){
      favorites =  JSON.parse(localStorage.getItem('favorites'));

      if(this.props.retrieved)
      {
        item = favorites.filter( el => el.id === this.props.supplierProductId);
      }
    }




    console.log('render - this.props.supplierProductId', this.props.supplierProductId);
    console.log('render - notification', notification);
    console.log('render - created', created);
    console.log('render - deleted', deleted);
    console.log('render - favorites', favorites);
    console.log('render - favorite exist', item);

    return (
      <div>
        {deleted !== null
          ? (
            <div onClick={() => this.addToFavorite()}>
              <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'white'}} />
              <span className="ml-1">Ajouter aux favoris</span>
            </div>
          )
          : (item.length > 0 || created !== null)
            ? (
              <div onClick={() => this.deleteFavorite()}>
                <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'red'}} />
                <span className="ml-1">Déjà dans vos favoris</span>
              </div>

            )
            :(
              <div onClick={() => this.addToFavorite()}>
                <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'white'}} />
                <span className="ml-1">Ajouter aux favoris</span>
              </div>
            )

        }


      </div>
    );
  }


}

const mapStateToProps = state => ({
  created: state.favorite.create.created,
  error: state.favorite.del.error,
  loading: state.favorite.del.loading,
  notification: state.favorite.del.notification,
  eventSourceCreate: state.favorite.del.eventSource,
  deleted: state.favorite.del.deleted,
  retrieved: state.favorite.list.retrieved,
  errorList: state.favorite.list.error,
  loadingList: state.favorite.list.loading,
  eventSourceList: state.favorite.list.eventSource
});

const mapDispatchToProps = dispatch => ({
  create: (id, history, location) => dispatch(create(id, history, location)),
  delete: (id, history, location) => dispatch(del(id, history, location)),
  resetDelete: () => dispatch(resetDelete()),
  resetCreate: () => dispatch(reset()),
  list: (history, location) => dispatch(retrieveIds( history, location )),
  resetList: eventSourceList => dispatch(reset(eventSourceList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonAddToFavorite2));
