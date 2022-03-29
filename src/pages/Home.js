import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Box, Grid, Link, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowWave } from "src/styles/images/arrowWave.svg";
import { RecentlyDropped, NftDashboard, NewNftCard } from "src/components";
import GridImage from "src/styles/images/grid.svg";
import ThreeNFT1 from "src/styles/images/nft3_3vertical.png";
import ThreeNFT2 from "src/styles/images/nft3_3deg.png";

// context
import { useWeb3Context } from "src/hooks/web3Context";
import { colors } from "../themes/dark";
import { useSelector } from "react-redux";
import { getMarketState } from "../slices/MarketplaceSlice";

const useStyles = makeStyles(theme => ({
  incomeNftWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "radial-gradient(67.08% 214.13% at 67.92% 47.89%, #232A33 0%, #000000 100%)",
    paddingBottom: "40px",
  },
  incomeNftWrap: {
    margin: "180px 105px 80px",
    background: `url(${GridImage})`,
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    [theme.breakpoints.down("sm")]: {
      margin: "180px 0 0 0",
    },
  },
  title: {
    fontSize: "56px",
    fontWeight: 700,
    lineHeight: "52px",
    textAlign: "center",
  },
  titleA: {
    background: "none",
    marginRight: "15px",
  },
  titleTextContainer: {
    padding: "180px 0 19px",
    display: "flex",
    justifyContent: "center",
  },
  subContainer: {
    display: "flex",
    justifyContent: "center",
  },
  createNftWrapper: {
    marginTop: "100px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "45px",
    },
  },
  tokensCollection: {
    position: "relative",
    margin: "0 0 120px 60px",
    "& > img:first-of-type": {
      position: "absolute",
      top: "30px",
      left: "45px",
      zIndex: 5,
      width: "305px",
      height: "430px",
      [theme.breakpoints.down("sm")]: {
        width: "235px",
        height: "330px",
        top: "20px",
        left: "35px",
      },
    },
    "& > img:nth-of-type(2)": {
      width: "305px",
      height: "430px",
      [theme.breakpoints.down("sm")]: {
        width: "235px",
        height: "330px",
      },
    },
    "& > span": {
      position: "absolute",
      transform: "rotate(90deg)",
      right: "-90px",
      bottom: "5px",
      [theme.breakpoints.down("sm")]: {
        right: "-80px",
      },
    },
    "&::before": {
      content: "''",
      position: "absolute",
      bottom: "-70px",
      width: "400px",
      height: "16px",
      background: `radial-gradient(50% 50% at 50% 50%, ${colors.black[1000]} 0%, rgba(0, 0, 0, 0) 100%)`,
      opacity: 0.4,
      [theme.breakpoints.down("sm")]: {
        width: "260px",
        left: "35px",
        bottom: "-60px",
      },
    },
    [theme.breakpoints.down("lg")]: {
      marginLeft: 0,
    },
  },
  toExplore: {
    padding: "20px 67px",
    background: "linear-gradient(266.21deg, #FF4F4F 5.53%, #2E5CFF 96.43%)",
    borderRadius: "100px",
    fontSize: "18px",
    lineHeight: "18px",
    position: "relative",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      display: "inline-block",
      textAlign: "center",
      width: "90%",
    },
  },
  exploreContent: {
    position: "relative",
  },
  arrowIcon: {
    marginLeft: "10px",
    width: "14px",
    color: "#FFBC45",
  },
  exploreArrowIcon: {
    alignSelf: "center",
    width: "24px",
    color: "#182328",
    position: "absolute",
    right: "10px",
  },
  iconButton: {
    width: "24px",
    height: "24px",
    margin: "0 10px 0 0 !important",
    color: "#182328",
  },
  linkBtn: {
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: 700,
    textTransform: "uppercase",
    textDecoration: "none",
    color: colors.common.white,
  },
  circle: {
    background: "#2E5CFF",
    height: "37px",
    width: "37px",
    textAlign: "center",
    borderRadius: "100%",
    marginRight: "20px",
    "& p": {
      fontFamily: "Roboto Slab",
      color: "white",
      lineHeight: "37px",
      fontWeight: 700,
      fontSize: "26px",
      margin: 0,
    },
  },
  gridItemBox: {
    display: "flex",
  },
  gridItemBoxText: {
    width: "200px",
    [theme.breakpoints.down("sm")]: {
      width: "275px",
    },
  },
  arrowWave: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  passiveIncomeWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  exploreCreateWrapper: {
    [theme.breakpoints.down("md")]: {
      order: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  passiveTitle: {
    fontFamily: "Roboto Slab",
    fontSize: "50px",
    fontWeight: 700,
    lineHeight: "83px",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: "32px",
      lineHeight: "32px",
    },
  },
  passiveMainSubTitle: {
    width: "530px",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      width: "320px",
    },
  },
  passiveSubTitle: {
    margin: "4px 0 25px",
    fontSize: "22px",
    fontWeight: 400,
    lineHeight: "30px",
    color: "white",
  },
  threeNftsWrapper: {
    position: "relative",
  },
  threeNFTWrap1: {
    position: "absolute",
    left: "15%",
    top: "17%",
  },
  threeNFTWrap2: {
    position: "absolute",
  },
  trading: {
    lineHeight: "52px",
    color: "white",
    textAlign: "center",
  },
  recentlyDropped: {
    marginTop: "100px",
  },
}));

function NumInCircle(props) {
  const classes = useStyles();
  return (
    <div className={classes.circle}>
      <p>{props.num}</p>
    </div>
  );
}

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const classes = useStyles();
  const { connect, connected } = useWeb3Context();

  return (
    <div className="home-page">
      <div className={`${classes.incomeNftWrapper}`}>
        <div className={`${classes.incomeNftWrap}`}>
          <div className="page-section-content">
            <div className={classes.passiveIncomeWrapper}>
              <div className={classes.exploreCreateWrapper}>
                <Typography className={classes.passiveTitle}>3,3+ NFTs</Typography>
                <Typography className={`${classes.passiveSubTitle} ${classes.passiveMainSubTitle}`}>
                  Multiply your TNGBL tokens and earn passive income by locking your tokens
                </Typography>
                <Button component={NavLink} to="/explore" className={classes.toExplore} variant="contained" key={1}>
                  Explore
                </Button>
                <div className={classes.createNftWrapper}>
                  {connected ? (
                    <Typography
                      component={NavLink}
                      to="/create-item"
                      className={`${classes.passiveSubTitle}, ${classes.linkBtn}`}
                    >
                      + Create your NFT
                    </Typography>
                  ) : (
                    <Typography className={`${classes.passiveSubTitle}, ${classes.linkBtn}`} onClick={connect}>
                      + Create your NFT
                    </Typography>
                  )}
                </div>
              </div>
              <div className={classes.tokensCollection}>
                <img src={ThreeNFT1} alt="nft3.3" />
                <img src={ThreeNFT2} alt="nft3.3deg" />
                <span>3,3+ NFT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NftDashboard />
      <div className={`page-section-content ${classes.recentlyDropped}`}>
        <RecentlyDropped />
      </div>
      <div className="page-section-content">
        <Box display="flex" justifyContent="center" alignItems="center" marginY="80px">
          <Typography variant="h3" className={classes.trading}>
            How to create and earn passive income with your NFT
          </Typography>
        </Box>
        <Box marginBottom="90px">
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <div className={classes.gridItemBox}>
                <NumInCircle num="1" />
                <div className={classes.gridItemBoxText}>
                  <Typography variant="h5">Set up your wallet</Typography>
                  <Typography variant="body2">
                    Make sure your wallet is DeFi compatible and connected to the Polygon Network.
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item>
              <ArrowWave className={classes.arrowWave} style={{ transform: "rotate(-144.97deg)" }} />
              <div className={classes.gridItemBox} style={{ justifyContent: "flex-end" }}>
                <NumInCircle num="2" />
                <div className={classes.gridItemBoxText}>
                  <Typography variant="h5">Select your lockup period</Typography>
                  <Typography variant="body2">
                    Choose how long you would like to lock your TNGBL tokens for. The longer the lockup the higher the
                    multiplier.
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item>
              <div className={classes.gridItemBox}>
                <NumInCircle num="3" />
                <div className={classes.gridItemBoxText}>
                  <Typography variant="h5">Mint your passive income NFT</Typography>
                  <Typography variant="body2">
                    Once you have chosen your lockup period, choose how many TNGBL tokens you would like to lock and
                    mint your NFT.
                  </Typography>
                </div>
              </div>
              <ArrowWave className={classes.arrowWave} style={{ transform: "matrix(-0.78, 0.62, 0.62, 0.78, 0, 0)" }} />
            </Grid>
            <Grid item>
              <ArrowWave className={classes.arrowWave} style={{ transform: "rotate(-144.97deg)" }} />
              <div className={classes.gridItemBox} style={{ justifyContent: "flex-end" }}>
                <NumInCircle num="4" />
                <div className={classes.gridItemBoxText}>
                  <Typography variant="h5">Claim your passive income</Typography>
                  <Typography variant="body2">
                    You can claim your passive income as it accrues in real time. No rebases!
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}
