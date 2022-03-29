import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Davatar from "@davatar/react";

// MUI
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { MenuItem, Divider, Menu, Button, ListItemText, Link } from "@material-ui/core";
import { MenuRounded, AccountBalanceWalletOutlined } from "@material-ui/icons";

// hooks
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { useENS } from "src/hooks/useENS";

// helpers
import { shortAddress } from "src/helpers";

// theme
import { colors } from "src/themes/dark";

const useStyles = makeStyles(theme => ({
  linkMenuItem: {
    width: "100%",
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
})(props => (
  <Menu
    elevation={1}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    padding: "10px 19px",
    "&:hover": {
      backgroundColor: "#00000000",
      color: colors.blue[500],
      "& > a": {
        color: colors.blue[500],
      },
      "& .MuiListItemIcon-button": {
        backgroundColor: "#00000000",
      },
    },
  },
}))(MenuItem);

export default function WalletMenu() {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();
  const address = useAddress();
  const classes = useStyles();
  const { ensName } = useENS(address);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);

  let shortedAddress;

  if (isConnected) {
    shortedAddress = ensName || shortAddress(address);
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        color="primary"
        disableRipple
        disableFocusRipple
        onClick={handleClick}
        startIcon={<MenuRounded id="menu" style={{ width: "20px", height: "20px", marginLeft: 0 }} />}
      >
        {isConnected ? (
          <Davatar size={20} address={address} />
        ) : (
          <AccountBalanceWalletOutlined style={{ width: "20px", height: "20px" }} />
        )}
      </Button>
      <StyledMenu
        id="customized-menu"
        key="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!connected && [
          <div key="connect" style={{ padding: "10px 19px" }}>
            <Button
              variant="contained"
              fullWidth
              key={1}
              onClick={() => {
                connect();
                handleClose();
              }}
            >
              Connect Wallet
            </Button>
          </div>,
        ]}
        {connected && [
          <Link key="tokens" component={NavLink} to="/items">
            <StyledMenuItem>My NFTs</StyledMenuItem>
          </Link>,
        ]}

        <Divider key="divider1" style={{ margin: "9px 0" }} />

        <StyledMenuItem key="faq">
          <Link className={classes.linkMenuItem} href="https://docs.nidhidao.finance/basics/faq" target="_blank">
            FAQ
          </Link>
        </StyledMenuItem>

        <StyledMenuItem key="discord">
          <Link className={classes.linkMenuItem} href="https://discord.com/invite/NidhiDAO" target="_blank">
            Discord
          </Link>
        </StyledMenuItem>

        <StyledMenuItem key="docs">
          <Link className={classes.linkMenuItem} href="https://docs.nidhidao.finance/basics" target="_blank">
            Docs
          </Link>
        </StyledMenuItem>

        <StyledMenuItem key="help">
          <ListItemText className={classes.linkMenuItem} primary="Help & support" />
        </StyledMenuItem>

        {connected && [
          <Divider key="divider2" style={{ margin: "9px 0" }} />,
          <StyledMenuItem
            key="logout"
            button
            onClick={() => {
              disconnect();
              handleClose();
            }}
          >
            {`Logout ${shortedAddress}`}
          </StyledMenuItem>,
        ]}
      </StyledMenu>
    </div>
  );
}
