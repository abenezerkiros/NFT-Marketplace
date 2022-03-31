import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as EmptyTreasure } from "../styles/images/emptyTreasure.svg";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  notFound: {
    position: "absolute",
    width: "312px",
    height: "291px",
    left: "40%",
    top: "232px",
    marginBottom: "29px",
  },
  notFound: {
    position: "absolute",
    width: "312px",
    height: "291px",
    left: "38%",
    top: "232px",
    marginBottom: "29px",
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      position: "absolute",
      width: "229.44px",
      height: "214px",
      left: "31px",
      top: "155px",
    },
  },
  notFoundTitle: {
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      position: "absolute",
      width: "100%",
      height: "56px",
      left: "0px",
      top: "-80px",
      fontFamily: "Roboto Slab",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "4px",
      lineHeight: "52px",
      textAlign: "center",
      color: "#FFFFFF",
    },
  },
  notFoundSubTitle: {
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "95%",
      height: "56px",
      left: "0px",
      top: "0px",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18px",
      lineHeight: "28px",
      textAlign: "center",
      color: "#FFFFFF",
      opacity: "0.5",
    },
  },
  notFoundContent: {
    position: "relative",
    left: "1%",
    top: "452px",
    marginBottom: 600,
  },
  backgroundTreasure: {
    position: "absolute",
    background: "radial-gradient(50.7% 159.39% at 51.37% 46.8%, #232A33 0%, #000000 100%)",
    width: "100%",
    height: "100%",
    filter: "blur(150px)",
    zIndex: "-100",
  },
  backToHome: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    position: "absolute",
    width: "320px",
    height: "58px",
    left: "165px",
    top: "138px",
    background: "linear-gradient(266.21deg, #FF4F4F 5.53%, #2E5CFF 96.43%)",
    borderRadius: "100px",
    color: "#fff",
    fontWeight: "bold",
    ["@media (max-width:600px)"]: {
      width: "320px",
      left: "40px",
      top: "99px",
    },
  },
}));

export default function NoMatch() {
  const classes = useStyles();

  return (
    <div
      className="page"
      style={{ background: "radial-gradient(50.7% 159.39% at 51.37% 46.8%, #232A33 0%, #000000 100%)" }}
    >
      <div className={classes.notFound}>
        <div className={classes.backgroundTreasure} />
        <EmptyTreasure />
      </div>
      <div className={classes.notFoundContent}>
        <Typography
          className={classes.notFoundTitle}
          variant="h1"
          style={{
            fontWeight: "normal",
            marginTop: "29px",
            marginBottom: "10px",
            fontFamily: "Roboto Slab",
            fontSize: "32px",
            textAlign: "center",
          }}
        >
          There is nothing here...
        </Typography>
        <Typography
          variant="h4"
          className={classes.notFoundSubTitle}
          style={{ opacity: 0.5, marginBottom: "40px", fontSize: "20px" }}
        >
          May be the page that you’re looking for is not found or never existed.
        </Typography>
        <Button component={NavLink} to="/" className={classes.backToHome} variant="contained" key={1}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
