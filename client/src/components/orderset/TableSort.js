import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
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
  MdFilterList
} from 'react-icons/md';
import {
  FaBoxOpen,
  FaShippingFast,
  FcPaid,
  GoStop,
  IoMdCloseCircle,
  RiSecurePaymentLine,
  RiSlideshowLine,
} from "react-icons/all";
import {
  BiMessageError,
  BiCommentCheck
} from "react-icons/bi";
import { Link } from 'react-router-dom';

function createData(id, dateCreated, paymentStatus, allShipped,  allReceived, nbPackage, totalWeight, totalCost) {
  return { id, dateCreated, paymentStatus, allShipped,  allReceived, nbPackage, totalWeight, totalCost};
}

function createRows(orders){
  let rows = [];

  for(let order of orders)
  {
    rows.push(createData(
      order.id,
      order.dateCreated,
      order.billCustomer ? order.billCustomer.status : false,
      order.deliverySet.allShipped,
      order.deliverySet.allReceived,
      order.nbPackage,
      order.totalWeight,
      order.totalCost
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
  { id: 'dateCreated', numeric: false, disablePadding: true, label: "Date d'achat" },
  { id: 'status', numeric: false, disablePadding: false, label: 'Statut' },
  { id: 'nbPackage', numeric: true, disablePadding: false, label: 'Nombre de paquet' },
  { id: 'totalWeight', numeric: true, disablePadding: false, label: 'Poids total (g)' },
  { id: 'totalCost', numeric: true, disablePadding: false, label: 'Prix (g)' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions'}

];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, rows } = props;
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
  iconSuccess: {
    color: 'green',
  },
  iconDanger: {
    color: 'red',
  },
  iconSecurePayment:{
    color: '#30baff',
  },
  iconContact: {
    color: '#fcb900'
  }
}));

export default function TableSort(props) {
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
    console.log('handleSelectAllClick - checked', event.target);
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      console.log('handleSelectAllClick - newSelecteds', newSelecteds);
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
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {new Date(row.dateCreated).toLocaleString('fr-FR', {timeZone: 'UTC'})}
                      </TableCell>
                      <TableCell align="center">
                        {!row.paymentStatus && (
                          <Tooltip title={'Echec paiement'} placement={'top'}>
                            <IconButton
                              component={'span'}
                            >
                              <IoMdCloseCircle className={classes.iconDanger}/>
                            </IconButton>
                          </Tooltip>
                        )}
                        {row.paymentStatus && (
                          <Tooltip title={'Paiement confirmé'} placement={'top'}>
                            <IconButton
                              component={'span'}
                            >
                              <FcPaid className={classes.iconDanger}/>
                            </IconButton>
                          </Tooltip>
                        )}
                        {row.allShipped && (
                          <Tooltip title={'Envoi confirmé'} placement={'top'}>
                            <IconButton
                              component={'span'}
                            >
                              <FaShippingFast className={classes.iconSuccess}/>
                            </IconButton>
                          </Tooltip>
                        )}
                        {row.allReceived && (
                          <Tooltip title={'Réception confirmé'} placement={'top'}>
                            <IconButton
                              component={'span'}
                            >
                              <FaBoxOpen className={classes.iconSuccess}/>
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="center">{row.nbPackage}</TableCell>
                      <TableCell align="center">{Math.round(row.totalWeight)}</TableCell>
                      <TableCell align="center">{`${row.totalCost.toFixed(2)} €`}</TableCell>
                      <TableCell>
                        <Tooltip title={'Voir'} placement={'top'}>
                          <IconButton
                            color={'primary'}
                            component={'span'}
                          >
                            <RiSlideshowLine/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Payer'} placement={'top'}>
                          <IconButton
                            component={'span'}
                          >
                            <RiSecurePaymentLine className={classes.iconSecurePayment}/>
                          </IconButton>
                        </Tooltip>
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
                  );
                })}
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Densité affichage"
      />
    </div>
  );
}
