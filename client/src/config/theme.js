import { createMuiTheme } from "@material-ui/core"
import { orange, lightBlue } from "@material-ui/core/colors";

export const theme = createMuiTheme((theme) => ({
  palette: {
    primary: orange,
    secondary: lightBlue,
  },
  typography: {
    //fontFamily: "Nunito, Carter One, Kanit, Dosis, Lato, Arial, sans-serif",
    fontFamily: [
      'Raleway',
      'Montserrat',
      'Nunito',
      'Lato',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: '1rem',
    h1: {
      fontFamily: 'Carter One'
    },
    h2: {
      fontFamily: 'Nunito'
    },
    h3: {
      fontFamily: 'MontSerrat'
    },
    h4:{
      fontFamily: 'Lato'
    },
    h5:{
      fontFamily: 'Lato'
    },
    h6:{
      fontFamily: 'Lato'
    },
    body1: {
      fontFamily: 'Nunito, Roboto, sans-serif'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [nunito],
      }
    },
    typography: {
      fontFamily: [
        'Raleway',
        'Nunito',
        'Lato',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h2: {
        fontFamily: 'Nunito'
      },
    }
  },
}));
