import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Box, Toolbar, Typography, SvgIcon, Link } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";

// state
import { loadAccountDetails } from "src/slices/AccountSlice";

// context
import { useAddress, useWeb3Context } from "src/hooks/web3Context";

// helpers
import { shortAddress } from "src/helpers";

// icons
import { ReactComponent as Twitter } from "src/styles/icons/twitter.svg";
import { ReactComponent as Medium } from "src/styles/icons/medium.svg";
import { ReactComponent as Avatar } from "src/styles/images/avatar.svg";
import { ReactComponent as LinkIcon } from "../styles/icons/link.svg";

// theme
import { colors } from "src/themes/dark";

const useStyles = makeStyles(() => ({
  imagesGrid: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: "65px",
  },
  headOfPage: {
    flexDirection: "column",
    display: "flex",
    justifyContent: "space-between",
    minHeight: "125px",
    margin: "40px 0",
    width: "100%",
  },
  userInfo: {
    alignItems: "center",
    display: "contents",
  },
  tab: {
    marginBottom: 0,
  },
  tabIcon: {
    width: "24px",
    height: "24px",
    margin: "0 10px 0 0 !important",
  },
  tabPanel: {
    display: "contents",
  },
  totalEarnings: {
    marginTop: "2rem",
    border: "1px solid #344750",
    borderRadius: "6px",
  },
  socialRow: {
    marginTop: "1.4rem",
    display: "flex",
    flexFlow: "row",
    gap: "10px",
    justifyContent: "center",
    "& a": {
      height: "36px",
      width: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      "&:hover": {
        transform: "scale(1.1)",
      },
    },
  },
  shareText: {
    opacity: 0.5,
  },
  imgContainer: {
    position: "relative",
    padding: "0.25rem",
    borderRadius: "100%",
    height: "100px",
    width: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      borderColor: "rgb(229 231 235)",
    },
  },
  imgBox: {
    "-webkit-box-align": "center",
    "-webkit-box-pack": "center",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
    borderRadius: "100%",
  },
  mockImage: {
    zIndex: 2,
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    width: "480px",
    marginBottom: "4rem",
  },
  link: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
    color: "#FFF",
    textDecoration: "none",
    fontSize: 12,
  },
}));

const Profile = () => {
  // @ts-ignore
  const { connected, provider, chainID } = useWeb3Context();
  // @ts-ignore
  const address = useAddress();
  const classes = useStyles();
  const dispatch = useDispatch();

  const profileInfo = useSelector(state => {
    // @ts-ignore
    return state?.account && state.account.profileInfo;
  });

  useEffect(() => {
    // @ts-ignore
    if (connected) dispatch(loadAccountDetails({ networkID: chainID, address, provider }));
  }, []);

  let shortedAddress;

  if (connected) {
    shortedAddress = shortAddress(address);
  }

  console.log("profileInfo", profileInfo);

  return (
    <div className="page">
      <Box display="flex" justifyContent="center" alignItems="center" marginY={4}>
        <Typography variant="h2">My Profile</Typography>
      </Box>
      <Paper className={classes.paper}>
        <NavLink className={classes.link} to="/edit-profile">
          Edit Profile
        </NavLink>
        <Toolbar className={classes.headOfPage}>
          <div className={classes.imgContainer}>
            {profileInfo?.imageURL ? (
              <div className={classes.imgBox}>
                <img width="100" height="100" className="image-create-nft" src={profileInfo?.imageURL} />
              </div>
            ) : (
              <div className={classes.mockImage}>
                <SvgIcon width="100" height="100" component={Avatar} viewBox="0 0 200 200" />
              </div>
            )}
          </div>
          <div className={classes.userInfo}>
            {Boolean(profileInfo?.name) && (
              <Typography variant="h1" style={{ margin: "8px 0" }}>
                {profileInfo?.name}
              </Typography>
            )}
            <Typography variant="h6" color="textSecondary" style={{ margin: "8px 0" }}>
              {window.location.origin}/profile/{profileInfo.deeplink}
            </Typography>
            {Boolean(profileInfo?.description) && (
              <Typography style={{ margin: "8px 0", color: colors.dark[600] }}>{profileInfo?.description}</Typography>
            )}
          </div>
          <Box display="flex" flexDirection="column">
            <Box className={classes.socialRow}>
              {Boolean(profileInfo.twitter) && (
                <Link href={`https://twitter.com/${profileInfo.twitter}`} target="_blank">
                  <SvgIcon viewBox="0 0 20 18" color="primary" component={Twitter} />
                </Link>
              )}
              {Boolean(profileInfo.instagram) && (
                <Link href={`https://instagram.com/${profileInfo.instagram}`} target="_blank">
                  <InstagramIcon color="primary" style={{ width: "22px" }} />
                </Link>
              )}
              {Boolean(profileInfo.medium) && (
                <Link href={`https://medium.com/${profileInfo.medium}`} target="_blank">
                  <SvgIcon viewBox="0 0 18 16" color="primary" component={Medium} />
                </Link>
              )}
              {Boolean(profileInfo.url) && (
                <Link href={`https://${profileInfo.url}`} target="_blank">
                  <SvgIcon viewBox="0 0 18 16" color="primary" component={LinkIcon} />
                </Link>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Paper>
    </div>
  );
};

export default Profile;
