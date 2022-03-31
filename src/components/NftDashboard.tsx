import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { colors } from "../themes/dark";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: colors.black[1000],
    [theme.breakpoints.down("sm")]: {
      backgroundColor: colors.black[900],
    },
  },
  container: {
    height: "465px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
  },
  passiveIncomeTitle: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "80px",
  },
  passiveIncomeBlock: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  passiveIncomeItem: {
    width: "405px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1px solid #FFFFFF33",
    background: "rgba(255, 255, 255, 0.05)",
    [theme.breakpoints.down("sm")]: {
      backgroundColor: colors.black[800],
      width: "340px",
    },
  },
  viewDetailsLink: {
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
    color: colors.blue[500],
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px",
    marginBottom: "75px",
    textTransform: "uppercase",
  },
  blockTitle: {
    fontWeight: 400,
  },
  blockValue: {
    paddingTop: "10px",
    fontSize: "32px",
    fontWeight: 700,
  },
}));

const NftDashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={`${classes.container} page-section-content`}>
        <Typography variant="h3" className={classes.passiveIncomeTitle}>
          3,3+ NFT Dashboard
        </Typography>
        <Grid container xs={12} spacing={2} className={classes.passiveIncomeBlock}>
          <Grid item>
            <div className={classes.passiveIncomeItem}>
              <Typography>TNGBL locked in 3,3+ NFTs</Typography>
              <Typography variant="h4" className={classes.blockValue}>
                76%
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.passiveIncomeItem}>
              <Typography>Average lock period</Typography>
              <Typography variant="h4" className={classes.blockValue}>
                492 days
              </Typography>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.passiveIncomeItem}>
              <Typography>Number of 3,3+ NFTs</Typography>
              <Typography variant="h4" className={classes.blockValue}>
                24,251
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Link className={classes.viewDetailsLink} to="#">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default NftDashboard;
