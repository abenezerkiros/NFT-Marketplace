import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";

// state
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { getMarketState, loadMarketplace } from "src/slices/MarketplaceSlice";

// MUI
import { Box, Grid, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// components
import { NewNftCard, PreviewItem } from "src/components";

// constants
import { publicRpcUrl, tokenConfig } from "src/constants";
import { alreadyApprovedToken, buyNft, changeApproval } from "../slices/PurchaseThunk";

import { useError } from "../hooks/useError";
import { useHistory } from "react-router-dom";
import { checkAllowance } from "../helpers";

const useStyles = makeStyles(() => ({
  imagesGrid: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBottom: "65px",
  },
  headOfPage: {
    marginBottom: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
}));

const RecentlyDroppped = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { connected, provider, connect, chainID } = useWeb3Context();
  const { market } = useSelector(getMarketState);
  const classes = useStyles();
  const history = useHistory();
  const setError = useError();
  const address = useAddress();
  const [previewItem, setPreviewItem] = useState(false);
  const [isApprovedToken, setIsApprovedToken] = useState(false);
  const [checked, setChecked] = useState(true);
  const [tokenForPurchase, setTokenForPurchase] = useState(undefined);
  const [isTokenBought, setIsTokenBought] = useState(false);

  const allowance = useSelector(state => {
    // @ts-ignore
    return state?.account && state?.account.purchaseMarketItem;
  });

  const balances = useSelector(state => {
    // @ts-ignore
    return state?.account && state?.account.balances;
  });

  const loadMarket = (lastItemId: number, pageSize: number, connected: Boolean) => {
    // @ts-ignore
    const useProvider = connected ? provider : new ethers.providers.JsonRpcProvider(publicRpcUrl);
    // @ts-ignore
    dispatch(loadMarketplace({ provider: useProvider, lastItemId, pageSize }));
  };

  const CheckTokenAllowance = async () => {
    // @ts-ignore
    const allowanceOfToken = await checkAllowance(tokenForPurchase, allowance);
    setIsApprovedToken(allowanceOfToken);
  };

  useEffect(() => {
    loadMarket(0, 6, connected);
  }, [connected]);

  useEffect(() => {
    if (tokenForPurchase && allowance) {
      CheckTokenAllowance();
    }
    // @ts-ignore
  }, [tokenForPurchase?.itemId, allowance]);

  const IfNoTokensInMarket = () => {
    return (
      market &&
      market.loading &&
      // @ts-ignore
      [...Array(10).keys()].map(i => {
        return (
          <Grid key={i} item xs={12} sm={6} md={6} lg={4} xl={4}>
            <NewNftCard loading />
          </Grid>
        );
      })
    );
  };

  // @ts-ignore
  const onClickApprove = async ({ approveMax, nft }) => {
    // @ts-ignore
    const token = tokenConfig[process?.env?.REACT_APP_NETWORK][nft?.paymentToken.toLowerCase()]?.symbol.toLowerCase();
    const tokenBalance = balances[token];
    if (tokenBalance.lt(nft.price)) {
      return setError({ message: `Insufficient balance of ${token.toUpperCase()}` });
    }
    await dispatch(
      // @ts-ignore
      changeApproval({ address, nftPrice: nft.price, token, provider, networkID: chainID, approveMax, setError }),
    );
    await CheckTokenAllowance();
  };

  // @ts-ignore
  const onClickPurchase = async ({ nft }) => {
    // @ts-ignore
    await dispatch(buyNft({ itemId: nft.itemId, provider, history, setError, setIsTokenBought }));
    setPreviewItem(false);
  };

  const isAllowanceDataLoading = allowance == null;

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {Boolean(market && market.nft.length) && (
        <Toolbar className={classes.headOfPage}>
          <Typography variant="h3">Recently listed 3,3+ NFTs</Typography>
        </Toolbar>
      )}
      <Grid container item xs={12} spacing={2} className={classes.imagesGrid}>
        {IfNoTokensInMarket()}
        {market &&
          market.nft.map(token => {
            return (
              <Grid key={token.itemId.toString()} item xs={12} sm={6} md={6} lg={4} xl={4}>
                {/* @ts-ignore */}
                <NewNftCard
                  explore
                  key={token.itemId.toString()}
                  nft={token}
                  // TODO: remove this later
                  // buyNft={() => {
                  //   // @ts-ignore
                  //   setTokenForPurchase(token);
                  //   setPreviewItem(true);
                  // }}
                />
              </Grid>
            );
          })}
      </Grid>
      {address && tokenForPurchase && !isAllowanceDataLoading && allowance && (
        <PreviewItem
          open={isTokenBought ? isTokenBought : previewItem}
          onClose={() => {
            setTokenForPurchase(undefined);
            setIsTokenBought(false);
            setPreviewItem(false);
            loadMarket(0, 6, connected);
          }}
          isApprovedToken={isApprovedToken}
          // @ts-ignore
          imageUrl={tokenForPurchase?.image}
          tokenStatus={isTokenBought ? "bought" : undefined}
          // @ts-ignore
          nft={tokenForPurchase}
          checked={checked}
          onChange={() => setChecked(!checked)}
          onClick={() => {
            isApprovedToken
              ? onClickPurchase({ nft: tokenForPurchase })
              : onClickApprove({ approveMax: checked, nft: tokenForPurchase });
          }}
        />
      )}
    </Box>
  );
};

export default RecentlyDroppped;
