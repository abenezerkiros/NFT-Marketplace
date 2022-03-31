import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAllowance } from "../helpers";

// state
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { getMarketState, loadMarketplace } from "src/slices/MarketplaceSlice";

// MUI
import { Grid, Box, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// components
import { LoadMore, NftCard, PreviewItem } from "src/components";

// constants
import { tokenConfig, publicRpcUrl } from "src/constants";
import { alreadyApprovedToken, buyNft, changeApproval } from "../slices/PurchaseThunk";

// hooks
import { useHistory } from "react-router-dom";
import { useError } from "../hooks/useError";

const useStyles = makeStyles(() => ({
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  imagesGridimages: {
    height: "300px",
  },
  imagesGrid: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: "65px",
    width: "95%",
  },
  headOfPage: {
    backgroundColor: "#11161D;",
    minHeight: "125px",
    marginBottom: "40px",
    width: "100%",
  },
  toolbarBlock: {
    position: "relative",
    width: "100%",
  },
  gridContainer: {
    position: "relative",
    top: "-56px",
    left: "-25px",
    marginLeft: "7%",
    paddingLeft: "auto",
    height: "100%",
    ["@media (max-width:600px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "90%",
      left: "-2%",
    },
    ["@media (min-width:2060px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "90%",
      left: "-7.75%",
    },
    ["@media (min-width:3000px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "90%",
      left: "-7.75%",
    },
  },
  toolbarBlockText: {
    position: "absolute",
    width: "115px",
    height: "52px",
    left: "2%",
    top: "0px",
    fontFamily: "Roboto Slab",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "32px",
    lineHeight: "52px",
    color: "#FFFFFF",
    ["@media (min-width:2060px)"]: {
      // eslint-disable-line no-useless-computed-key
      left: "0.75%",
    },
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "90%",
      left: "6%",
    },
  },
  toolbar: {
    position: "absolute",
    width: "100%",
    top: "-130px",
  },
}));

export default function Explore() {
  const dispatch = useDispatch();
  const setError = useError();
  const { connected, chainID, provider } = useWeb3Context();
  const history = useHistory();
  const address = useAddress();
  const { market } = useSelector(getMarketState);
  const [previewItem, setPreviewItem] = useState(false);
  const [isApprovedToken, setIsApprovedToken] = useState(false);
  const [checked, setChecked] = useState(true);
  const [tokenForPurchase, setTokenForPurchase] = useState(undefined);
  const [isTokenBought, setIsTokenBought] = useState(false);
  const classes = useStyles();

  const allowance = useSelector(state => {
    return state?.account && state?.account.purchaseMarketItem;
  });

  const balances = useSelector(state => {
    return state?.account && state?.account.balances;
  });

  const loadMarket = lastItemId => {
    // @ts-ignore
    const useProvider = connected ? provider : new ethers.providers.JsonRpcProvider(publicRpcUrl);
    dispatch(loadMarketplace({ provider: useProvider, lastItemId }));
  };

  const CheckTokenAllowance = async () => {
    const allowanceOfToken = await checkAllowance(tokenForPurchase, allowance);
    setIsApprovedToken(allowanceOfToken);
  };

  useEffect(() => {
    if (tokenForPurchase && allowance) {
      CheckTokenAllowance();
    }
  }, [tokenForPurchase?.itemId, allowance]);

  useEffect(() => {
    loadMarket(0);
  }, [chainID, connected]);

  const loadMoreNft = async () => {
    loadMarket(market.lastItemId);
  };

  const IfNoTokensInMarket = () => {
    return (
      market &&
      market.loading &&
      [...Array(10).keys()].map(i => {
        return (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <NftCard loading />
          </Grid>
        );
      })
    );
  };

  const onClickApprove = async ({ approveMax, nft }) => {
    const token = tokenConfig[process?.env?.REACT_APP_NETWORK][nft?.paymentToken.toLowerCase()]?.symbol.toLowerCase();
    const tokenBalance = balances[token];
    if (tokenBalance.lt(nft.price)) {
      return setError({ message: `Insufficient balance of ${token.toUpperCase()}` });
    }
    await dispatch(
      changeApproval({ address, nftPrice: nft.price, token, provider, networkID: chainID, approveMax, setError }),
    );
    await CheckTokenAllowance();
  };

  const onClickPurchase = async ({ nft }) => {
    console.log("Purchase values: ", nft);
    await dispatch(buyNft({ itemId: nft.itemId, provider, history, setError, setIsTokenBought }));
    setPreviewItem(false);
  };

  const isAllowanceDataLoading = allowance == null;

  // if (loadingState === "loaded" && !market.nft.length) return <h1>No items in marketplace</h1>;
  return (
    <div className="page">
      <div className={classes.pageWrapper}>
        <div className={classes.headOfPage} />
        <div className={classes.content}>
          <Grid container item className={classes.toolbarBlock}>
            <Grid item>
              <Toolbar className={classes.toolbar}>
                <Typography variant="h1" className={classes.toolbarBlockText}>
                  Explore
                </Typography>
              </Toolbar>
            </Grid>
          </Grid>
          <Box
            className={classes.gridContainer}
            display="flex"
            flexDirection="column"
            width="100%"
            id="nft-grid-container"
          >
            <Grid container item spacing={2} className={classes.imagesGrid}>
              <IfNoTokensInMarket />
              {market &&
                market.nft.map(token => {
                  return (
                    <Grid key={token.itemId} item>
                      <NftCard
                        explore
                        key={token.itemId}
                        nft={token}
                        className={classes.imagesGridimages}
                        buyNft={() => {
                          setPreviewItem(true);
                          setTokenForPurchase(token);
                        }}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </div>
      </div>
      <LoadMore disabled={market.lastItemId === null} onClick={loadMoreNft} loading={market.loading} />
      {address && tokenForPurchase && !isAllowanceDataLoading && allowance && (
        <PreviewItem
          open={isTokenBought ? isTokenBought : previewItem}
          onClose={() => {
            setTokenForPurchase(undefined);
            setIsTokenBought(false);
            setPreviewItem(false);
            loadMarket(0);
          }}
          isApprovedToken={isApprovedToken}
          imageUrl={tokenForPurchase?.image}
          nft={tokenForPurchase}
          tokenStatus={isTokenBought && "bought"}
          checked={checked}
          onChange={() => setChecked(!checked)}
          onClick={() => {
            isApprovedToken
              ? onClickPurchase({ nft: tokenForPurchase })
              : onClickApprove({ approveMax: checked, nft: tokenForPurchase });
          }}
        />
      )}
    </div>
  );
}
