import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import { MdStarBorder } from "react-icons/all";
import {Paper, Tooltip, Typography} from "@material-ui/core";
import {orange} from "@material-ui/core/colors";
import {Rating} from "@material-ui/lab";
import {MdMoreVert} from "react-icons/md";

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
  gridImg: {
    width: '100%',
    height: '100%'
  },
  titleBar: {
    fontFamily: 'Montserrat',
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    "& .MuiGridListTileBar-title": {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: orange[700]
    },
    "& .MuiGridListTileBar-subtitle": {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: orange[700]
    }

  },
  title: {
    fontFamily: 'Montserrat'
  },
  subtitleContent:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subtitlePrice:{
    display: 'flex',
    alignItems: 'center'
  },
  subtitleRating: {
    color: orange[700]
  },
  icon: {
    color: 'white',
  },
}));

function formatData(suppliersProduct){
  let rows = [];
  const types= [ 6, 4, 3 ];
  let indexType = -1;
  let startIndex = 0;
  let currentType = 0;
  let randomIndex = 3;
  let rowsCount = 1;

  suppliersProduct.forEach((el, index) => {
    // set startIndex
    startIndex = (indexType === -1 && index === 0) ? 0 : startIndex;
    startIndex = (indexType === -1 && index > 0) ? index : startIndex;
    // get a random type
    do{
      randomIndex = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    }while (randomIndex === indexType);
    // set index
    indexType = (indexType === -1) ? randomIndex : indexType;
    // set current type
    currentType = (indexType === -1) ? types[indexType] : types[indexType];

    rows.push({
      id:el.id,
      img: (el.images && el.images.length >= 1) ? el.images[0].url : "",
      title: el.product.title,
      author: el.supplier.brandName,
      finalPrice: el.finalPrice,
      rating: el.rating,
      featured: ((index + 1) % 5 === 0) ,
      cols: currentType
    });

    switch(true){
      case currentType === 6 && index === startIndex + indexType + 1:
      case currentType === 4 && index === startIndex + indexType + 1:
      case currentType === 3 && index === startIndex + indexType + 1:
        indexType = -1;
        rowsCount++;
        break;
      default:
        break;
    }

  });
  rows.rowsCount = rowsCount;

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

  return (
    <div className={classes.root}>
      <GridList cellHeight={200} cols={12} spacing={10} className={classes.gridList}>
        {tileData.map((tile, index, tiledata) => (
          <GridListTile key={index} cols={tile.cols} rows={1}>
            <Paper elevation={3}>
              <Link to={`supplier_product/show/${tile.id}`}>
                <img src={tile.img} alt={tile.title} className={classes.gridImg}/>
                <GridListTileBar
                  title={
                    <Tooltip title={tile.title}>
                      <Typography variant={'subtitle2'} className={classes.title}>
                        {tile.title}
                      </Typography>
                    </Tooltip>
                  }
                  subtitle={
                    <div className={classes.subtitleContent}>
                      <div className={classes.subtitleRating}>
                        <Rating name={'product-rating'} defaultValue={tile.rating} precision={0.5} readOnly/>
                      </div>
                      <div className={classes.subtitlePrice}>
                        {(Math.round((tile.finalPrice + Number.EPSILON) * 100) / 100) + ' €'}
                      </div>
                    </div>
                  }
                  titlePosition="bottom"
                  actionIcon={
                    <IconButton aria-label={`star ${tile.title}`} className={classes.icon}>
                      <MdMoreVert />
                    </IconButton>
                  }
                  actionPosition="left"
                  className={classes.titleBar}
                  //onClick={() => history.push({pathname: "supplier_product/show/" + tile.id })}
                />
              </Link>
            </Paper>



          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default withRouter(SupplierProductGridList);
