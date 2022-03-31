import { useState } from "react";

// MUI
import { Box, Button, MenuItem, Menu, SvgIcon, Link } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// hooks
import { useCopyToClipboard } from "src/hooks/useCopyToClipboard";

// Icons
import { ReactComponent as Share } from "src/styles/icons/share.svg";
import { ReactComponent as LinkIcon } from "src/styles/icons/link.svg";
import { ReactComponent as Twitter } from "src/styles/icons/twitter.svg";
import FacebookIcon from "@material-ui/icons/Facebook";

const useStyles = makeStyles(() => ({
  actions: {
    display: "flex",
    flexFlow: "row",
    gap: "10px",
    justifyContent: "center",
  },
  linkMenuItem: {
    width: "100%",
  },
  paper: {
    minWidth: "247px",
    border: "1px solid #344750",
    backgroundColor: "#182328",
    color: "#fff",
    marginTop: "10px",
    padding: "10px 0",
  },
  actionButton: {
    position: "relative",
    top: -3,
    marginTop: 0,
    width: 14,
    maxHeight: 14,
    border: "none",
  },
}));

const StyledMenu = withStyles({
  paper: {
    minWidth: "247px",
    border: "1px solid #344750",
    backgroundColor: "#182328",
    color: "#fff",
    marginTop: "10px",
    padding: "10px 0",
  },
})(Menu);

const StyledMenuItem = withStyles(() => ({
  root: {
    padding: "10px 19px",
    "&:hover": {
      backgroundColor: "#00000000",
      color: "#FFBC45",
      "& .MuiListItemIcon-button": {
        backgroundColor: "#00000000",
      },
    },
  },
}))(MenuItem);

const ShareButton = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button variant="outlined" className={classes.actionButton} onClick={handleClick}>
        <SvgIcon viewBox="0 0 24 24" color="primary" component={Share} />
      </Button>
      <StyledMenu key="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <StyledMenuItem key="twitter">
          <Link
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}
            href={`http://twitter.com/share?text=Look at this Passive Income NFT at Nidhi&url=${window.location.href} &hashtags=nidhi,nidhiDAO,GURU`}
            target="_blank"
          >
            <SvgIcon viewBox="0 0 20 18" color="primary" component={Twitter} /> Twitter
          </Link>
        </StyledMenuItem>
        <StyledMenuItem key="twitter">
          <Link
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
          >
            <FacebookIcon color="primary" style={{ width: "22px" }} /> Facebook
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

const DetailsActions = () => {
  const classes = useStyles();
  const [copyStatus, copy] = useCopyToClipboard(window.location.href);
  return (
    <Box className={classes.actions}>
      <ShareButton />
    </Box>
  );
};

export default DetailsActions;
