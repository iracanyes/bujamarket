import React,{ Fragment} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import {
  MdDelete,
  MdFilterList,
  MdLocalShipping
} from 'react-icons/md';
import {
  FaShippingFast,
  FcPaid,
  IoMdCloseCircle,
  GiReturnArrow,
  IoMdCheckboxOutline,
  FaBox,
  FcShipped,
  BiMessageRoundedCheck,
  BiMessageMinus,
  FaMoneyCheckAlt,
  FcMoneyTransfer
} from "react-icons/all";
import {
  BiMessageError,
  BiCommentCheck,
  BiCommentX
} from "react-icons/bi";
import {FormattedMessage} from "react-intl";

function createData(id, imageUrl, name, paymentStatus, status, quantity, commented, shipped,  received, address) {
  return { id, imageUrl, name, paymentStatus, status, quantity, commented, shipped,  received,  address};
}

function createRows(orders){
  let rows = [];

  for(let order of orders)
  {
    rows.push(createData(
      order.id,
      order.supplierProduct.images[0].url,
      order.supplierProduct.product.title,
      order.orderSet.billCustomer ? order.orderSet.billCustomer.status : false,
      order.status,
      order.quantity,
      order.commented,
      order.deliveryDetail ? order.deliveryDetail.shipped : false,
      order.deliveryDetail ? order.deliveryDetail.received : false,
      order.orderSet.address
    ));
  }

  return rows;
}


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'imageUrl', numeric: false, disablePadding: true, label: "Image" },
  { id: 'name', numeric: false, disablePadding: true, label: "Nom" },
  { id: 'status', numeric: false, disablePadding: false, label: 'Statut commande' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantité' },
  { id: 'commented', numeric: false, disablePadding: false, label: 'Avis sur le produit' },
  { id: 'address', numeric: false, disablePadding: false, label: 'Adresse' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions'}

];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const [ mySelected, setMySelected] = React.useState(0);

  const toggleCheckbox = () =>{
    onSelectAllClick({ target: { checked: mySelected !== 0 ? 0 : rowCount }});
    setMySelected(mySelected !== 0 ? 0 : rowCount);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={mySelected === rowCount}
            onClick={() => toggleCheckbox()}
            inputProps={{ 'aria-label': 'Choisir toutes les commandes' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Commandes
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Supprimer" placement={'top'}>
          <IconButton aria-label="delete">
            <MdDelete />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filtres"  placement={'top'}>
          <IconButton aria-label="filter list">
            <MdFilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  iconGreen: {
    color: 'green',
  },
  iconRed: {
    color: 'red',
  },
  iconSecurePayment:{
    color: '#30baff',
  },
  iconContact: {
    color: '#fcb900'
  },
  tableCollapsed: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
}));

function TableSubRow(props){
  const classes = useStyles();
  const [ open, setOpen ] = React.useState(false);
  return (
    <Fragment>
      <TableRow key={props.index}>
        <TableCell component={'th'} scope={'row'}>
          <Avatar
            alt={props.item.supplierProduct.product.title}
            src={props.item.supplierProduct.images[0].url}
            variant={'rounded'}
          />
        </TableCell>
        <TableCell>
          {props.item.supplierProduct.product.title}
        </TableCell>
        <TableCell align={'center'}>
          {(props.row.paymentStatus === false || props.row.paymentStatus === "pending") && (
            <Tooltip
              placement={'top'}
              title={'En attente'}
            >
              <IconButton>
                <FaBox color={'secondary'}/>
              </IconButton>
            </Tooltip>
          )}
          {props.row.shipped && (
            <Tooltip
              placement={'top'}
              title={'En transit'}
            >
              <IconButton>
                <FcShipped color={'secondary'}/>
              </IconButton>
            </Tooltip>
          )}
          {(props.item.deliveryDetail && props.item.deliveryDetail.shipped) && (
            <Tooltip
              placement={'top'}
              title={'En cours de livraison'}
            >
              <IconButton color={'primary'}>
                <FaShippingFast/>
              </IconButton>
            </Tooltip>
          )}
          {(props.item.deliveryDetail && props.item.deliveryDetail.received) && (
            <Tooltip
              placement={'top'}
              title={'Delivré'}
            >
              <IconButton>
                <IoMdCheckboxOutline className={classes.iconGreen}/>
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          {props.item.quantity}
        </TableCell>
        <TableCell style={{padding: 'unset'}}>
          {props.item.supplierProduct.finalPrice.toFixed(2) + ' €'}
        </TableCell>
        <TableCell style={{ display: 'flex'}}>
          {props.item.commented === false && (
            <Tooltip
              placement={'top'}
              title={'Avis sur le produit'}
            >
              <IconButton onClick={() => setOpen(!open)}>
                <BiCommentCheck
                  className={classes.iconGreen}
                />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip
            placement={'top'}
            title={'Retour produit'}
          >
            <IconButton color={'secondary'}>
              <GiReturnArrow />
            </IconButton>
          </Tooltip>
          <Tooltip
            placement={'top'}
            title={'Plainte'}
          >
            <IconButton>
              <BiCommentX
                className={classes.iconRed}
              />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout={'auto'} unmountOnExit>
            <Box margin={1}>
              {/*props.item.supplierProduct.id && (<Create supplierProductId={props.item.supplierProduct.id} orderDetailId={props.item.id}/>)*/}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    </Fragment>
  );
}

TableSubRow.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  key: PropTypes.number.isRequired
};

function TableRowItem(props){
  const classes = useStyles();
  const isItemSelected = props.isSelected(props.row.id);
  const labelId = `enhanced-table-checkbox-${props.index}`;
  const [ collapsed, setCollapsed ] = React.useState(false);
  const [ collapsedForm, setCollapsedForm ] = React.useState(false);

  return (
    <React.Fragment key={props.index}>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={props.row.id}
        selected={isItemSelected}
        className={classes.tableCollapsed}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={(event) => props.handleClick(event, props.row.id)}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        <TableCell component={'th'} scope={'row'}>
          <Avatar
            alt={props.row.name}
            src={props.row.imageUrl}
            variant={'rounded'}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {props.row.name}
        </TableCell>
        <TableCell align={'center'}>
          {(props.row.paymentStatus === false || props.row.paymentStatus === "failed" ) && (
            <Tooltip title={'Echec paiement'} placement={'top'}>
              <IconButton
                component={'span'}
              >
                <IoMdCloseCircle className={classes.iconRed}/>
              </IconButton>
            </Tooltip>
          )}
          {props.row.paymentStatus === "completed" && (
            <Tooltip title={'Paiement confirmé'} placement={'top'}>
              <IconButton
                component={'span'}
              >
                <FcPaid className={classes.iconRed}/>
              </IconButton>
            </Tooltip>
          )}
          {props.row.paymentStatus === "paid" && (
            <Tooltip title={'Paiement confirmé'} placement={'top'}>
              <IconButton
                component={'span'}
              >
                <FcMoneyTransfer/>
              </IconButton>
            </Tooltip>
          )}
          {(props.row.paymentStatus || props.row.paymentStatus === "pending") && (
            <Tooltip
              placement={'top'}
              title={'En attente'}
            >
              <IconButton>
                <FaBox color={'secondary'}/>
              </IconButton>
            </Tooltip>
          )}
          {props.row.shipped && (
            <Tooltip
              placement={'top'}
              title={'En transit'}
            >
              <IconButton>
                <FcShipped color={'secondary'}/>
              </IconButton>
            </Tooltip>
          )}
          {(props.row.deliveryDetail && props.row.deliveryDetail.shipped) && (
            <Tooltip
              placement={'top'}
              title={'En cours de livraison'}
            >
              <IconButton color={'primary'}>
                <FaShippingFast/>
              </IconButton>
            </Tooltip>
          )}
          {(props.row.deliveryDetail && props.row.deliveryDetail.received) && (
            <Tooltip
              placement={'top'}
              title={'Delivré'}
            >
              <IconButton>
                <IoMdCheckboxOutline className={classes.iconGreen}/>
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center">{props.row.quantity}</TableCell>
        <TableCell align="center">
          {props.row.commented
            ? (
              <Tooltip title={"commenté par le client"} placement={'top'}>
                <IconButton>
                  <BiMessageRoundedCheck className={classes.iconGreen}/>
                </IconButton>
              </Tooltip>
            )
            : (
              <Tooltip title={"Aucun commentaire sur la commande"} placement={'top'}>
                <IconButton>
                  <BiMessageMinus className={classes.iconRed}/>
                </IconButton>
              </Tooltip>
            )
          }
        </TableCell>
        <TableCell align="center">
          <p>
            {props.row.address.street + " " + props.row.address.number}
            <br/>
            {props.row.address.zipCode + " " + props.row.address.town}
            <br/>
            {props.row.address.state}
            <br/>
            {props.row.address.country}
          </p>
        </TableCell>
        <TableCell>
          { /*props.row.shipped*/ true && (
            <Tooltip title={'Voir le détail de la livraison'} placement={'top'}>
              <IconButton
                color={'primary'}
                component={'span'}
                onClick={() => setCollapsed(!collapsed)}
              >
                <FaMoneyCheckAlt/>
              </IconButton>
            </Tooltip>
          )}

          {props.row.paymentStatus === "completed" && (
            <Tooltip title={'Confirmer la livraison au transporteur'} placement={'top'}>
              <IconButton
                component={'span'}
                onClick={() => setCollapsedForm(!collapsedForm)}
              >
                <MdLocalShipping className={classes.iconSecurePayment}/>
              </IconButton>
            </Tooltip>
          )}
          {/*(props.row.paymentStatus === "completed" && props.my_orders[props.index].billCustomer) && (
            <DownloadBill url={props.my_orders[props.index].billCustomer.url} />
          )*/}
          <Tooltip title={'Contact'} placement={'top'}>
            <IconButton
              color={'primary'}
              component={'span'}
            >
              <BiMessageError className={classes.iconContact}/>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align={'center'}  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          {/* Table informations de livraison */}
          <Collapse in={collapsed} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant={'h6'} gutterBottom>
                <FormattedMessage
                  id={'app.delivery_detail'}
                  defaultMessage={'Information de livraison'}
                />
              </Typography>
              <Table
                size={'small'}
                aria-label={'purchases'}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.image'}
                        defaultMessage={'Image'}
                        description={'Image'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.name'}
                        defaultMessage={'Nom'}
                        description={'Nom'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.delivery_status'}
                        defaultMessage={'Statut livraison'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.form.quantity'}
                        defaultMessage={'Quantité'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.price'}
                        defaultMessage={'Prix'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.actions'}
                        defaultMessage={'Actions'}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*props.row.orderDetails.map( (item, index) => (
                    <TableSubRow item={item} index={index} row={props.row} key={index}/>
                  ))*/}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
          {/* Formulaire de confirmation de livraison */}
          <Collapse in={collapsedForm} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant={'h6'} gutterBottom>
                <FormattedMessage
                  id={'app.confirm_delivery_to_shipper'}
                  defaultMessage={'Confirmation de livraison au transporteur'}
                />
              </Typography>
              <Table
                size={'small'}
                aria-label={'purchases'}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.image'}
                        defaultMessage={'Image'}
                        description={'Image'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.name'}
                        defaultMessage={'Nom'}
                        description={'Nom'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.delivery_status'}
                        defaultMessage={'Statut livraison'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.form.quantity'}
                        defaultMessage={'Quantité'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.price'}
                        defaultMessage={'Prix'}
                      />
                    </TableCell>
                    <TableCell align={'center'}>
                      <FormattedMessage
                        id={'app.actions'}
                        defaultMessage={'Actions'}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*props.row.orderDetails.map( (item, index) => (
                    <TableSubRow item={item} index={index} row={props.row} key={index}/>
                  ))*/}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function TableSort(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { my_orders } = props;

  // Création des lignes du tableau
  const rows = createRows(my_orders);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Densité affichage"
        />
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              rows={rows}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRowItem
                    key={index}
                    row={row}
                    index={index}
                    handleClick={handleClick}
                    validateOrder={props.validateOrder}
                    my_orders={my_orders}
                    isSelected={isSelected}
                  />
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

    </div>
  );
}

export default withRouter(TableSort);
