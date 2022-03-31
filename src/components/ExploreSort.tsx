import { useState } from "react";

// MUI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { MenuItem, Menu, Button } from "@material-ui/core";

const useStyles = makeStyles(() => ({
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

const ExploreSort = () => {
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
      <Button color="primary" variant="outlined" disableRipple disableFocusRipple onClick={handleClick}>
        Price: Low to High
      </Button>
      <StyledMenu key="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <StyledMenuItem key="faq">Price: Low to High</StyledMenuItem>
        <StyledMenuItem key="discord">Price: High to Low</StyledMenuItem>
      </StyledMenu>
    </div>
  );
};

export default ExploreSort;
