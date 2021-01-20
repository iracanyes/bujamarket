/**
 * Author: iracanyes
 * Description:
 */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { del } from '../../actions/favorite/delete';
import { create, reset } from '../../actions/favorite/create';


export class ButtonAddToFavorite extends React.Component
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

  componentWillUnmount() {
    this.props.reset();
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
    const { tooltipOpen } = this.state;
    this.props.create(this.props.supplierProductId, this.props.history);
    this.setState({tooltipOpen: tooltipOpen, added: true});
  }

  render()
  {
    let { tooltipOpen, added } = this.state;

    let favorites = JSON.parse(localStorage.getItem('favorites'));
    let item = [];

    if(localStorage.getItem('favorites') !== null)
    {

      item = favorites.filter( el => el.id === this.props.supplierProductId);
    }




    return (
      <div>
        {(item.length > 0 || added) && (
          <div>
            <span href="#" id="TooltipFavorite">
              <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'red'}} onClick={this.deleteFavorite}/>
            </span>
            <Tooltip placement="right" isOpen={tooltipOpen} target="TooltipFavorite" toggle={this.toggle}>
              Déjà dans vos favoris
            </Tooltip>
          </div>

        )}
        {item.length === 0 && !added && (
          <div>
            <span href="#" id="TooltipFavorite">
              <FontAwesomeIcon icon="heart" className="menu-top-l1" style={{color: 'gray'}} onClick={this.addToFavorite}/>
            </span>
            <Tooltip placement="right" isOpen={tooltipOpen} target="TooltipFavorite" toggle={this.toggle}>
              Ajouter aux favoris
            </Tooltip>
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
  deleted: state.favorite.del.deleted
});

const mapDispatchToProps = dispatch => ({
  create: (id, history) => dispatch(create(id, history)),
  delete: (id, history) => dispatch(del(id, history)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAddToFavorite);
