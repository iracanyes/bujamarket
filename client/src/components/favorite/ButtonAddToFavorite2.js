/**
 * Author: iracanyes
 * Date: 21/04/20
 * Description:
 */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { del, reset as resetDelete } from '../../actions/favorite/delete';
import { create, reset } from '../../actions/favorite/create';
import { retrieveIds, reset as resetList } from '../../actions/favorite/list';
import {toastSuccess} from "../../layout/component/ToastMessage";
import { Button } from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {GiBrokenHeartZone, RiHeartAddFill} from "react-icons/all";


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

    return (
      <div>
        {deleted === null && (item.length === 0 && created === null)
          ? (
            <Button
              color={'primary'}
              variant={'contained'}
              startIcon={<RiHeartAddFill/>}
              onClick={() => this.addToFavorite()}
            >
              <FormattedMessage
                id={"app.button.add_favorite"}
                defaultMessage={'Ajouter aux favoris'}
                description={'Button - Add to favorite'}
              />
            </Button>
          )
          : (
            <Button
              color={'secondary'}
              variant={'contained'}
              startIcon={<GiBrokenHeartZone />}
              onClick={() => this.deleteFavorite()}
            >
              <FormattedMessage
                id={"app.button.delete_favorite"}
                defaultMessage={'Retirer des favoris'}
                description={"Button - Delete from favorite"}
              />
            </Button>
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
  resetList: eventSourceList => dispatch(resetList(eventSourceList))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ButtonAddToFavorite2));
