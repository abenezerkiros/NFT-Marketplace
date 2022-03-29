import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BigNumber } from "ethers";

// state
import { useWeb3Context } from "src/hooks/web3Context";

// MUI
import { Box, Grid, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// constants
import { tokenConfig } from "src/constants";

// components
import { NftCard, PreviewItem } from "src/components";

// state
import { getNftState, loadNfts } from "src/slices/NFTsSlice";
import { alreadyApprovedToken, buyNft, changeApproval } from "src/slices/PurchaseThunk";

// hooks
import { useError } from "src/hooks/useError";
import { useHistory } from "react-router-dom";
import { IBaseNft } from "src/slices/MarketplaceSlice";

// helpers
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
    justifyContent: "start",
    alignItems: "center",
  },
}));

interface Props {
  address: string;
  itemId: number;
  creatorName: string;
}

const MoreItemsCreator = ({ address, itemId, creatorName }: Props) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { connected, provider, chainID } = useWeb3Context();
  const [previewItem, setPreviewItem] = useState(false);
  const [isTokenBought, setIsTokenBought] = useState(false);
  const [isApprovedToken, setIsApprovedToken] = useState(false);
  const [checked, setChecked] = useState(true);
  const [tokenForPurchase, setTokenForPurchase] = useState<IBaseNft>();
  const { myNft } = useSelector(getNftState);
  const classes = useStyles();
  const setError = useError();
  const history = useHistory();

  const loadItemsFromCreator = async () => {
    // @ts-ignore
    dispatch(loadNfts({ provider, address, userRole: "creator", lastItemId: 0, pageSize: 5 }));
  };

  useEffect(() => {
    if (connected && address) loadItemsFromCreator();
  }, [connected, address]);

  const allowance = useSelector(state => {
    // @ts-ignore
    return state?.account && state?.account.purchaseMarketItem;
  });

  const balances = useSelector(state => {
    // @ts-ignore
    return state?.account && state?.account.balances;
  });

  const isAllowanceDataLoading = allowance == null;

  const IfNoTokensInMarket = () => {
    return (
      myNft &&
      myNft.loading &&
      // @ts-ignore
      [...Array(4).keys()].map(i => {
        return (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <NftCard loading />
          </Grid>
        );
      })
    );
  };

  const onClickPurchase = async ({ nft }: { nft: IBaseNft }) => {
    console.log("Purchase values: ", nft);
    await dispatch(buyNft({ itemId: nft.itemId, provider, history, setError, setIsTokenBought }));
    setPreviewItem(false);
  };

  const CheckTokenAllowance = async () => {
    // @ts-ignore
    const allowanceOfToken = await checkAllowance(tokenForPurchase, allowance);
    setIsApprovedToken(allowanceOfToken);
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
      changeApproval({ address, nftPrice: nft.price, token, provider, networkID: chainID, approveMax, setError }),
    );
    await CheckTokenAllowance();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {myNft && myNft.nft.length > 1 && (
        <Toolbar className={classes.headOfPage}>
          <Typography variant="h4">More from {creatorName || "this creator"}</Typography>
        </Toolbar>
      )}
      <Grid container item spacing={2} className={classes.imagesGrid}>
        {IfNoTokensInMarket()}
        {myNft &&
          myNft.nft
            .filter(nft => Number(nft.itemId?.toString()) !== Number(itemId?.toString()))
            .slice(0, 4)
            .map(token => {
              return (
                <Grid key={token.itemId.toString()} item>
                  {/* @ts-ignore */}
                  <NftCard
                    explore
                    nft={token}
                    buyNft={() => {
                      setPreviewItem(true);
                      setTokenForPurchase(token);
                    }}
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
          }}
          isApprovedToken={isApprovedToken}
          imageUrl={tokenForPurchase?.image}
          nft={tokenForPurchase}
          tokenStatus={isTokenBought ? "bought" : undefined}
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

export default MoreItemsCreator;
