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
import { del } from '../../actions/favorite/delete';
import { create, reset } from '../../actions/favorite/create';
import { retrieveIds, reset as resetList } from '../../actions/favorite/list';


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
      this.props.list(this.props.history);
  }

  componentWillUnmount() {
    this.props.resetCreate();
    this.props.resetList();
  }

  toggle = () => {
    let { tooltipOpen } = this.state;
    this.setState({tooltipOpen: !tooltipOpen});


  };

  deleteFavorite()
  {
    const { tooltipOpen } = this.state;
    this.props.delete(this.props.supplierProductId, this.props.history);
    this.setState({tooltipOpen: tooltipOpen, added: false});
  }

  addToFavorite()
  {
    if(localStorage.getItem('token') !== null)
    {
      const { tooltipOpen } = this.state;
      this.props.create(this.props.supplierProductId, this.props.history);
      this.setState({tooltipOpen: tooltipOpen, added: true});
    }else{
      this.props.history.push({path:"../../login", state: { from: window.location.pathname }});
    }

  }

  render()
  {
    let { tooltipOpen, added } = this.state;


    this.props.retrieved && localStorage.setItem('favorites', JSON.stringify(this.props.retrieved.favorites));
    let favorites = JSON.parse(localStorage.getItem('favorites'));

    let item = [];

    if(this.props.retrieved && localStorage.getItem('favorites') !== null)
    {

      item = favorites.filter( el => el.id === this.props.supplierProductId);
    }


    return (
      <div>
        {(item.length > 0 || added) && (
          <div onClick={this.deleteFavorite}>
            <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'red'}} />
            <span className="ml-1">Déjà dans vos favoris</span>
          </div>

        )}
        {item.length === 0 && !added && (
          <div onClick={this.addToFavorite}>
            <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'white'}} />
            <span className="ml-1">Ajouter aux favoris</span>
          </div>
        )}


      </div>
    );
  }


}

const mapStateToProps = state => ({
  created: state.favorite.create.created,
  error: state.favorite.del.error,
  loading: state.favorite.del.loading,
  eventSourceCreate: state.favorite.del.eventSource,
  deleted: state.favorite.del.deleted,
  retrieved: state.favorite.list.retrieved,
  errorList: state.favorite.list.error,
  loadingList: state.favorite.list.loading,
  eventSourceList: state.favorite.list.eventSource
});

const mapDispatchToProps = dispatch => ({
  create: (id, history) => dispatch(create(id, history)),
  delete: (id, history) => dispatch(del(id, history)),
  resetCreate: eventSourceCreate => dispatch(reset(eventSourceCreate)),
  list: history => dispatch(retrieveIds( history)),
  resetList: eventSourceList => dispatch(reset(eventSourceList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonAddToFavorite2));
