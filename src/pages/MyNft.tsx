import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, SvgIcon, Tab, Tabs, Toolbar, Typography } from "@material-ui/core";
import { StarOutlineRounded, AddRounded, ShareRounded, AutorenewTwoTone } from "@material-ui/icons";

// constants
import { profileAddress, marketAddress, tokenAddress, tokenConfig } from "src/constants";

// hooks
import { usePrice } from "src/hooks/usePrice";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";

// components
import { NftCard, LoadMore, TabPanel, Claim, DetailsActions } from "src/components";

// helpers
import { shortAddress } from "src/helpers";

// ABI
import NidhiProfile from "src/abi/NidhiProfile.json";
import Market from "src/abi/NidhiMarket.json";

// state
import { getNftState, loadNfts } from "src/slices/NFTsSlice";

// icons
import { ReactComponent as Avatar } from "src/styles/images/avatar.svg";
import { ReactComponent as GuruIcon } from "src/styles/images/guru.svg";
import { ReactComponent as Share } from "src/styles/images/share.svg";

// theme
import { colors } from "src/themes/dark";

// types
import type { Profile } from "src/types";
import { IBaseNft } from "src/slices/MarketplaceSlice";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  imagesGrid: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: "65px",
  },
  headOfPage: {
    position: "absolute",
    left: "1%",
    width: "90%",
    margin: "auto",
    height: "243px",
    top: "105px",
    overflowX: "hidden",
    borderRadius: "24px",
    padding: "auto",
    background: "radial-gradient(35.29% 76.48% at 5.4% 23.52%, #232A33 0%, #000000 100%)",
  },
  gridContainer: {
    position: "relative",
    top: "335px",
    left: "-5%",
    marginLeft: "7%",
    paddingLeft: "auto",
    height: "100%",
    marginBottom: 500,
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "90%",
      top: "505px",
      left: "-10px",
    },
  },
  userInfo: {
    alignItems: "center",
    display: "contents",
  },
  tabIcon: {
    width: "24px",
    height: "24px",
    margin: "0 10px 0 0 !important",
  },
  tabPanel: {
    display: "contents",
  },
  pricetext: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "12px",
    color: "#FFFFFF",
    opacity: "0.5",
    width: "171px",
  },
  imgContainer: {
    position: "relative",
    padding: "0.25rem",
    borderRadius: "100%",
    height: "200px",
    width: "200px",
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
    position: "absolute",
    width: "100px",
    height: "100px",
    left: "44px",
    top: "37px",
    borderRadius: "100%",
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "72px",
      height: "72px",
      left: "24px",
    },
  },
  claimAllButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 16px",
    width: "139px",
    height: "42px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "100px",
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      position: "absolute",
      width: "300px",
      height: "42px",
      left: "-21px",
      top: "125px",
    },
  },
  claimAllText: {
    width: "120px",
    height: "18px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "18px",
    textAlign: "center",
    color: "#FFFFFF",
    flex: "none",
    order: 0,
    flexGrow: 0,
    margin: "0px 8px",
  },
  mockImage: {
    zIndex: 2,
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  totalEarnings: {
    marginTop: "2rem",
    border: "1px solid #344750",
    borderRadius: "6px",
  },
  tab: {
    marginBottom: 0,
  },
  tabs: {
    minWidth: "220px !important",
  },
  linkLogo: {
    display: "flex",
    alignItems: "flex-end",
    textDecoration: "none",
  },
}));

export default function MyNft() {
  const dispatch = useDispatch();
  const { connected, provider } = useWeb3Context();
  const { myNft } = useSelector(getNftState);
  const [totals, setTotals] = useState<{
    burnTotals: ethers.BigNumberish | null;
    passiveTotals: ethers.BigNumberish | null;
    createdTotal: number;
    ownedTotal: number;
  }>({
    burnTotals: null,
    passiveTotals: null,
    createdTotal: 0,
    ownedTotal: 0,
  });
  const { formattedPrice: formattedBurn } = usePrice(
    totals.burnTotals,
    // @ts-ignore
    tokenAddress,
    provider,
  );
  const { formattedPrice: formattedPassive } = usePrice(
    totals.passiveTotals,
    // @ts-ignore
    tokenAddress,
    provider,
  );
  const [currentProfile, setCurrentProfile] = useState<Profile>();
  const [claim, setClaim] = useState<IBaseNft | null>(null);
  const address = useAddress();
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const signer = provider.getSigner();
  const profileContract = new ethers.Contract(profileAddress, NidhiProfile.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);
  useEffect(() => {
    if (!connected) return;
    const getProfile = async () => {
      if (address)
        Promise.all([
          profileContract.userProfiles(address),
          marketContract.totalValueByOwner(address),
          marketContract.collectionSizesByOwner(address),
        ]).then(response => {
          setCurrentProfile({
            name: response[0][0],
            imageURL: response[0][1],
            deeplink: response[0][2],
            description: response[0][3],
            url: response[0][4],
            discord: response[0][5],
            twitter: response[0][6],
            instagram: response[0][7],
            medium: response[0][8],
            telegram: response[0][9],
          });
          setTotals({
            burnTotals: response[1][0],
            passiveTotals: response[1][1],
            createdTotal: response[2][0],
            ownedTotal: response[2][1],
          });
        });
    };
    getProfile();
  }, [connected, address]);

  const getNFTs = async (userRole: string, lastItemId: number) => {
    // @ts-ignore
    dispatch(loadNfts({ provider, address, userRole, lastItemId }));
  };

  let shortedAddress;

  if (connected) {
    shortedAddress = shortAddress(address);
  }

  useEffect(() => {
    if (tabValue === 0) getNFTs("owner", 0);
    if (tabValue === 1) getNFTs("creator", 0);
  }, [connected, tabValue, dispatch]);
  console.log(currentProfile);
  const IfNoTokens = () => {
    return (
      myNft &&
      myNft.loading &&
      // @ts-ignore
      [...Array(10).keys()].map(i => {
        return (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <NftCard loading />
          </Grid>
        );
      })
    );
  };

  const handleChangeTabs = (event: any, newValue: React.SetStateAction<number>) => {
    setTabValue(newValue);
  };

  const loadMoreNft = async () => {
    await getNFTs(tabValue === 0 ? "owner" : "creator", myNft.lastItemId);
  };

  return (
    <div className="page">
      <Toolbar className={classes.headOfPage} id="myNft-toolbar">
        <div>
          <div>
            <div>
              {currentProfile?.imageURL ? (
                <div>
                  <img className={classes.imgBox} src={currentProfile?.imageURL} />
                </div>
              ) : (
                <div className={classes.imgBox}>
                  <SvgIcon component={Avatar} viewBox="0 0 200 200" />
                </div>
              )}
            </div>
            <div className="user_info">
              {currentProfile?.name ? (
                <Typography className="user-info-name" variant="h3">
                  {currentProfile?.name}
                </Typography>
              ) : (
                <Typography variant="h3"></Typography>
              )}
              <Typography
                variant="h6"
                className="user-info-address"
                style={{ color: colors.dark[600], fontSize: 14, fontWeight: "normal" }}
              >
                {shortedAddress}
              </Typography>
              <div className="balance_info">
                <div>
                  <Typography className={classes.pricetext}>Total locked value</Typography>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, paddingBottom: "20px" }}>
                    <SvgIcon component={GuruIcon} viewBox="0 0 16 16" style={{ marginRight: "10px" }} />
                    <Typography variant="h4" style={{ fontWeight: "bold", fontSize: "20px" }}>
                      {formattedBurn?.price}
                    </Typography>
                  </div>
                </div>
                <div className="divider"></div>
                <div>
                  <Typography className={classes.pricetext}>Total Claimable Value</Typography>
                  <div className="claimable" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <SvgIcon component={GuruIcon} viewBox="0 0 16 16" style={{ marginRight: "10px" }} />
                    <Typography variant="h4" style={{ fontWeight: "bold", fontSize: "20px" }}>
                      {formattedPassive?.price}
                    </Typography>
                  </div>
                </div>
                {/*<div className={classes.claimAllButton}>
                  <Typography className={classes.claimAllText}>Claim all</Typography>
              </div>*/}
              </div>
            </div>
          </div>
          <div className="profile_info_right">
            <div className="share">
              <DetailsActions />
            </div>
          </div>
        </div>
      </Toolbar>
      <Box className={classes.gridContainer} display="flex" flexDirection="column" width="95%" id="nft-grid-container">
        <Grid container item spacing={2} className={classes.imagesGrid}>
          {IfNoTokens()}
          {myNft &&
            myNft.nft.map(token => {
              return (
                <Grid key={token.itemId.toString()} item>
                  <NftCard claim explore nft={token} setClaimNft={setClaim} loading={myNft.loading} />
                </Grid>
              );
            })}
        </Grid>
        {Boolean(claim) && <Claim nft={claim} open={Boolean(claim)} onClose={() => setClaim(null)} />}
      </Box>
    </div>
  );
}
