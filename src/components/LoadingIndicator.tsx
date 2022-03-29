// MUI
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  loadingIndicator: {
    position: "relative",
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "black",
    color: "black",
    animation: "$dotFlashing 1s infinite linear alternate",
    animationDelay: ".5s",
    "&::before, &::after": {
      content: "''",
      display: "inline-block",
      position: "absolute",
      top: "0",
    },
    "&::before": {
      left: "-15px",
      width: "10px",
      height: "10px",
      borderRadius: "5px",
      backgroundColor: "black",
      color: "black",
      animation: "$dotFlashing 1s infinite alternate",
      animationDelay: "0s",
    },
    "&::after": {
      left: "15px",
      width: "10px",
      height: "10px",
      borderRadius: "5px",
      backgroundColor: "black",
      color: "black",
      animation: "$dotFlashing 1s infinite alternate",
      animationDelay: "1s",
    },
  },
  "@keyframes dotFlashing": {
    "0%": { backgroundColor: "black" },
    "50%": { backgroundColor: "#777" },
    "100%": { backgroundColor: "#777" },
  },
}));

const LoadingIndicator = () => {
  const classes = useStyles();
  return <div className={classes.loadingIndicator} />;
};

export default LoadingIndicator;
