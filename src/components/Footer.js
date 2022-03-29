import { AppBar, Container, Grid, Toolbar, SvgIcon, Typography } from "@material-ui/core";
import React from "react";
import Social from "./Social";
import { makeStyles } from "@material-ui/core/styles";
import Subscribe from "./Subscribe";

// icons
import { ReactComponent as Logo } from "src/styles/images/logo.svg";
import { ReactComponent as Tangible } from "src/styles/images/tangible.svg";
import { colors } from "../themes/dark";

const useStyles = makeStyles(theme => ({
  footer: {
    top: "auto",
    bottom: 0,
    border: "none",
    position: "relative",
    boxShadow: "none",
    backgroundColor: colors.black[1000],
  },
  container: {
    width: "100%",
    padding: "43px 0",
    [theme.breakpoints.down("sm")]: {
      padding: "43px 20px",
    },
  },
  gridContainer: {
    top: "auto",
    bottom: 0,
    border: "none",
  },
  mainText: {
    marginTop: "40px",
    textAlign: "right",
    color: "gray",
    opacity: "0.4",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
    },
  },
  logo: {
    marginLeft: "10px",
  },
  footerContent: {
    marginTop: "25px",
    maxWidth: "493px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  socials: {
    marginTop: "0",
    [theme.breakpoints.down("sm")]: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <AppBar className={classes.footer}>
      <Toolbar className={`${classes.container} page-section-content`}>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} sm={10} md={10} xl={11}>
            <SvgIcon viewBox="0 0 27 24" component={Logo} />
            <SvgIcon viewBox="0 0 150 24" component={Tangible} />
            <Typography variant="caption" align="center" color="textPrimary" className={classes.logo}>
              DAO
            </Typography>
            <Typography variant="subtitle1" className={classes.footerContent}>
              Tangible converts real world assets into tangible NFTs (TNFTs) that can be redeemed for the physical
              product at any time.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} md={2} xl={1} className={classes.socials}>
            <Social />
            <Typography variant="subtitle2" className={classes.mainText}>
              © 2021 Tangible
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
