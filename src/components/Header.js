import { NavLink, useLocation } from "react-router-dom";

// MUI
import { AppBar, Toolbar, Button, Grid, SvgIcon, Link, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { AddRounded, StarOutlineRounded } from "@material-ui/icons";

// icons
import { ReactComponent as Logo } from "src/styles/images/logo.svg";
import { ReactComponent as Tangible } from "src/styles/images/tangible.svg";

// context
import { useWeb3Context } from "src/hooks/web3Context";
import WalletMenu from "./WalletMenu";

// theme
import { colors } from "src/themes/dark";

const useStyles = makeStyles(theme => ({
  header: {
    top: 0,
    bottom: "auto",
    border: "none",
    position: "fixed",
    boxShadow: "none",
    backgroundColor: "#0000 !important",
  },
  homePageHeader: {
    backgroundColor: "#0000 !important",
  },
  linkLogo: {
    display: "flex",
    alignItems: "flex-end",
    textDecoration: "none",
  },
  container: {
    padding: "10px 0 0",
    position: "relative",
  },
  mainText: {
    marginBottom: "12px",
  },
  iconButton: {
    width: "24px",
    height: "24px",
    margin: "0 10px 0 0 !important",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  menuItem: {
    height: "72px",
    display: "flex",
    alignItems: "center",
  },
  menuItemLink: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    padding: "0px 25px 0 20px",
    position: "relative",
    "&:hover": {
      backgroundColor: "transparent",
      color: colors.blue[500],
      "& > span > svg": {
        color: colors.blue[500],
      },
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  logo: {
    marginLeft: "10px",
  },
}));

const StyledLink = withStyles(theme => ({
  root: {
    fontSize: "16px",
    "&:hover": {
      "& > svg": {
        color: colors.blue[500],
      },
    },
    "&.active": {
      color: colors.blue[500],
      "& > svg": {
        color: colors.blue[500],
      },
      "&:after": {
        backgroundColor: colors.blue[500],
        transition: "background-color 0.4s ease 0s",
        bottom: "0%",
        content: "''",
        display: "block",
        height: "4px",
        left: "0px",
        position: "absolute",
        width: "100%",
      },
    },
  },
}))(Link);

export default function Header() {
  const classes = useStyles();
  const location = useLocation();
  const { connected, connect } = useWeb3Context();
  const isHome = location.pathname.toString() === "/";

  return (
    <AppBar color="primary" className={`${classes.header} ${isHome && classes.homePageHeader}`}>
      <Toolbar>
        <Grid container style={{ top: "auto", bottom: 0, border: "none" }}>
          <Grid item xs={12} sm={8} md={8} xl={8}>
            <NavLink className={classes.linkLogo} to="/">
              <SvgIcon viewBox="0 0 27 24" component={Logo} />
              <SvgIcon viewBox="0 0 150 24" component={Tangible} />
              <Typography variant="caption" align="center" color="textPrimary" className={classes.logo}>
                DAO
              </Typography>
            </NavLink>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} md={4} xl={4} className={classes.buttons}>
          <ul className={classes.menuBar}>
            <li className={classes.menuItem}>
              <StyledLink component={NavLink} className={classes.menuItemLink} to="/explore">
                <StarOutlineRounded className={classes.iconButton} />
                Explore
              </StyledLink>
            </li>
            <li className={classes.menuItem}>
              {connected ? (
                <StyledLink component={NavLink} className={classes.menuItemLink} to="/create-item">
                  <AddRounded className={classes.iconButton} />
                  Create
                </StyledLink>
              ) : (
                <Button className={classes.menuItemLink} onClick={connect}>
                  <AddRounded className={classes.iconButton} />
                  Create
                </Button>
              )}
            </li>
          </ul>
          <WalletMenu />
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
