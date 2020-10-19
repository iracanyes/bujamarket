import React from 'react';
import { withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import { MdStarBorder } from "react-icons/all";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "inherit",
    height: "inherit",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

function formatData(suppliersProduct){
  let rows = [];
  suppliersProduct.forEach((el, index) => rows.push({
    id:el.id,
    img: el.images[0].url,
    title: el.product.title,
    author: el.supplier.brandName,
    featured: ((index + 1) % 5 === 0) ,
  }));
  return rows;
}

/**
 * Material-UI Grid - Advanced grid list
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *     featured: true,
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
function SupplierProductGridList(props) {
  const classes = useStyles();
  const tileData = formatData(props.data);
  const history = props.history;

  return (
    <div className={classes.root}>
      <GridList cellHeight={200} spacing={1} className={classes.gridList}>
        {tileData.map((tile, index) => (
          <GridListTile key={index} cols={tile.featured ? 2 : 1} rows={tile.featured ? 2 : 1}>
            <img src={tile.img} alt={tile.title} />
            <GridListTileBar
              title={tile.title}
              titlePosition="top"
              actionIcon={
                <IconButton aria-label={`star ${tile.title}`} className={classes.icon}>
                  <MdStarBorder />
                </IconButton>
              }
              actionPosition="left"
              className={classes.titleBar}
              onClick={() => history.push({pathname: "supplier_product/show/" + tile.id })}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default withRouter(SupplierProductGridList);