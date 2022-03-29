import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Tab, Tabs, Toolbar, Typography, SvgIcon, Link } from "@material-ui/core";
import { StarOutlineRounded, AddRounded, Instagram } from "@material-ui/icons";

// context
import { useWeb3Context } from "src/hooks/web3Context";

// state
import { getNftState, loadNfts } from "src/slices/NFTsSlice";

// components
import { NftCard, LoadMore, TabPanel } from "src/components";
import { shortAddress } from "src/helpers";

// icons
import { ReactComponent as Twitter } from "src/styles/icons/twitter.svg";
import { ReactComponent as Medium } from "src/styles/icons/medium.svg";
import { ReactComponent as GuruIcon } from "src/styles/images/guru.svg";
import { ReactComponent as Avatar } from "src/styles/images/avatar.svg";
import { ReactComponent as LinkIcon } from "../styles/icons/link.svg";

// ABI
import NidhiProfile from "src/abi/NidhiProfile.json";
import Market from "src/abi/NidhiMarket.json";

// constants
import { profileAddress, marketAddress } from "src/constants";

// theme
import { colors } from "src/themes/dark";

// types
import type { Profile } from "src/types";

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
    flexDirection: "column",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#182328",
    minHeight: "125px",
    marginBottom: "40px",
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
}));

const PublicProfile = () => {
  const dispatch = useDispatch();
  const { connected, provider } = useWeb3Context();
  const { myNft } = useSelector(getNftState);
  const [address, setAddress] = useState(null);
  const [currentProfile, setCurrentProfile] = useState<Profile>();
  const [totalValues, setTotalValues] = useState({ burnNFTValue: "0", redeemableValue: "0" });
  // @ts-ignore
  let { userAddress } = useParams();
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const signer = provider.getSigner();
  const profileContract = new ethers.Contract(profileAddress, NidhiProfile.abi, signer);
  const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);

  useEffect(() => {
    if (!connected) return;
    const getAddress = async () => {
      if (userAddress && ethers.utils.isAddress(userAddress)) {
        setAddress(userAddress);
      } else {
        const fetchedAddress = await profileContract.deeplinkToAddress(userAddress);
        setAddress(fetchedAddress);
      }
    };
    getAddress();
  }, [connected, userAddress]);

  useEffect(() => {
    if (!address) return;
    const getProfile = async () => {
      Promise.all([profileContract.userProfiles(address), marketContract.totalValueByOwner(address)]).then(response => {
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
        setTotalValues({
          burnNFTValue: ethers.utils.formatUnits(response[1][0].toString(), "gwei"),
          redeemableValue: ethers.utils.formatUnits(response[1][1].toString(), "gwei"),
        });
      });
    };
    getProfile();
  }, [address]);

  const getNFTs = async (userRole: string, lastItemId: number) => {
    // @ts-ignore
    dispatch(loadNfts({ provider, address, userRole, lastItemId }));
  };

  let shortedAddress;

  if (connected) {
    shortedAddress = shortAddress(userAddress);
  }

  useEffect(() => {
    if (!connected || !address) return;
    if (tabValue === 0) getNFTs("owner", 0);
    if (tabValue === 1) getNFTs("creator", 0);
  }, [connected, address, tabValue, dispatch]);

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
      <Toolbar className={classes.headOfPage}>
        <div className={classes.imgContainer}>
          {currentProfile?.imageURL ? (
            <div className={classes.imgBox}>
              <img className="image-create-nft" src={currentProfile?.imageURL} />
            </div>
          ) : (
            <div className={classes.mockImage}>
              <SvgIcon component={Avatar} viewBox="0 0 200 200" />
            </div>
          )}
        </div>
        <div className={classes.userInfo}>
          {Boolean(currentProfile?.name) && (
            <Typography variant="h1" style={{ margin: "8px 0" }}>
              {currentProfile?.name}
            </Typography>
          )}
          <Typography variant="h6" color="textSecondary">
            {shortedAddress}
          </Typography>
          {Boolean(currentProfile?.description) && (
            <Typography style={{ margin: "8px 0", color: colors.dark[600] }}>{currentProfile?.description}</Typography>
          )}
        </div>
        <Box display="flex" className={classes.totalEarnings}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={360}
            maxWidth="100%"
            paddingY={2}
            style={{ borderRight: "1px solid #344750" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <SvgIcon component={GuruIcon} viewBox="0 0 14 14" style={{ marginRight: "10px" }} />
              <Typography variant="h4" style={{ fontWeight: 700 }}>
                {totalValues.burnNFTValue}
              </Typography>
            </div>
            <Typography style={{ color: colors.dark[600], fontSize: 12 }}>Total Floor Value (If Burned)</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={360}
            maxWidth="100%"
            paddingY={2}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <SvgIcon component={GuruIcon} viewBox="0 0 14 14" style={{ marginRight: "10px" }} />
              <Typography variant="h4" style={{ fontWeight: 700 }}>
                {totalValues.redeemableValue}
              </Typography>
            </div>
            <Typography style={{ color: colors.dark[600], fontSize: 12 }}>Total Claimable Value</Typography>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.socialRow}>
            {Boolean(currentProfile?.twitter) && (
              <Link href={`https://twitter.com/${currentProfile?.twitter}`} target="_blank">
                <SvgIcon viewBox="0 0 20 18" color="primary" component={Twitter} />
              </Link>
            )}
            {Boolean(currentProfile?.instagram) && (
              <Link href={`https://instagram.com/${currentProfile?.instagram}`} target="_blank">
                <Instagram color="primary" style={{ width: "22px" }} />
              </Link>
            )}
            {Boolean(currentProfile?.medium) && (
              <Link href={`https://medium.com/${currentProfile?.medium}`} target="_blank">
                <SvgIcon viewBox="0 0 18 16" color="primary" component={Medium} />
              </Link>
            )}
            {Boolean(currentProfile?.url) && (
              <Link href={`https://${currentProfile?.url}`} target="_blank">
                <SvgIcon viewBox="0 0 18 16" color="primary" component={LinkIcon} />
              </Link>
            )}
          </Box>
        </Box>
        <Box width="100%" display="flex" justifyContent="flex-start" alignItems="center">
          <Tabs className={classes.tab} value={tabValue} onChange={handleChangeTabs} aria-label="simple tabs example">
            <Tab
              disableRipple
              disableFocusRipple
              label="Collected"
              {...a11yProps(0)}
              icon={<StarOutlineRounded className={classes.tabIcon} />}
            />
            <Tab
              disableRipple
              disableFocusRipple
              label="Created"
              {...a11yProps(1)}
              icon={<AddRounded className={classes.tabIcon} />}
            />
          </Tabs>
        </Box>
      </Toolbar>
      <TabPanel value={tabValue} index={0} className={classes.tabPanel}>
        <Grid container item xs={10} spacing={2} className={classes.imagesGrid}>
          {IfNoTokens()}
          {myNft &&
            myNft.nft.map(token => {
              return (
                <Grid key={token.itemId.toString()} item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <NftCard nft={token} loading={myNft.loading} />
                </Grid>
              );
            })}
        </Grid>
        <LoadMore disabled={myNft.lastItemId === null} onClick={loadMoreNft} />
      </TabPanel>
      <TabPanel value={tabValue} index={1} className={classes.tabPanel}>
        <Grid container item xs={10} spacing={2} className={classes.imagesGrid}>
          {IfNoTokens()}
          {myNft &&
            myNft.nft.map(token => {
              return (
                <Grid key={token.itemId.toString()} item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <NftCard nft={token} loading={myNft.loading} />
                </Grid>
              );
            })}
        </Grid>
        <LoadMore disabled={myNft.lastItemId === null} onClick={loadMoreNft} loading={myNft.loading} />
      </TabPanel>
    </div>
  );
};

export default PublicProfile;
