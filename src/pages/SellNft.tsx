import React, { useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";

// hooks
import { useError } from "../hooks/useError";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../hooks/web3Context";

// thunks and slices
import { getMarketItem } from "../slices/NFTsSlice";
import { isPendingTxn } from "../slices/PendingTxnsSlice";
import { approveCreating, tokenListing } from "../slices/CreateTokenThunk";

// components
import {
  CardMedia,
  Card,
  Typography,
  Button,
  Grid,
  Backdrop,
  Modal,
  Fade,
  Box,
  SvgIcon,
  OutlinedInput,
  MenuItem,
  withStyles,
  Select,
  InputAdornment,
  Slider,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { LoadingIndicator, PreviewItem, GuruValues, Claim } from "src/components";

// config
import { config } from "src/config";

// abi
import NFT from "../abi/NidhiNFT.json";
import Market from "../abi/NidhiMarket.json";

// Icons
import { ReactComponent as ArrowLeft } from "src/styles/images/close.svg";
import { ReactComponent as ArrowDownIcon } from "../styles/images/arrowDown.svg";

import { colors } from "../themes/dark";
import { NftTypes } from "../types";
import { marketAddress, nftAddress, tokenConfig } from "../constants";

type FormikValuesType = {
  price: number;
  paymentToken: "guru" | "usdc";
  incomePercentage: string;
};

const useStyles = makeStyles(theme => ({
  detailsPage: {
    position: "relative",
    width: "60%",
    height: "80%",
    left: "10%",
    top: "186px",
    background: "#182328",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(60px)",
    flexDirection: "row",
    justifyContent: "center",
    padding: "52px 0",
    marginTop: 20,
    marginBottom: 300,
    borderRadius: "20px",
    ["@media (max-width:720px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "90%",
      left: "5%",
    },
  },
  infoTextBottom: {
    color: "#FFFFFF",
    width: "500px%",
    opacity: 0.5,
  },
  info: {
    marginLeft: "25px",
    display: "flex",
    flexDirection: "column",
  },
  infoName: {
    marginTop: "50px",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    lineheight: "24px",
    color: "#FFFFFF",
  },
  claim: {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: 33,
  },
  claimSection: {
    padding: "20px",
    paddingLeft: 0,
  },
  claimValues: {
    display: "flex",
    paddingBottom: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomInBox: {
    padding: "15px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "6px",
    backdropFilter: "blur(40px)",
  },
  description: {
    width: "720px",
    wordBreak: "break-word",
    marginBottom: "34px",
    opacity: 0.5,
    lineHeight: "18px",
  },
  backToSellArrow: {
    position: "absolute",
    top: "15px",
    right: "30px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  boughtAtSection: {
    marginTop: "20px",
  },
  claimButton: {
    cursor: "pointer",
    color: colors.gold[500],
  },
  claimText: {
    marginBottom: 0.5,
  },
  infoText: {
    marginBottom: "15px",
    opacity: 0.5,
  },
  infoTextFee: {
    marginBottom: "15px",
    marginLeft: "15px",
    opacity: 0.5,
  },
  sellButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    width: "100%",
    height: "58px",
    background: "linear-gradient(266.21deg, #FF4F4F 5.53%, #2E5CFF 96.43%)",
    borderRadius: "100px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: 5,
  },
  incomePercentageSection: {
    display: "flex",
    alignItems: "center",
  },
  part: {
    marginBottom: "25px",
  },
}));

const PaymentTokenSelect = withStyles({
  icon: {
    width: "25px",
    display: "flex",
    top: "auto",
  },
  root: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "0px",
    gap: "5px",
    "&::before": {
      display: "none !important",
    },
  },
})(Select);

const IncomeSlider = withStyles({
  root: {
    color: colors.gold[500],
    height: 3,
    padding: "13px 0",
  },
  track: {
    height: 8,
    borderRadius: 8,
  },
  rail: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    height: 8,
    borderRadius: 8,
  },
  thumb: {
    display: "none",
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    marginTop: -9,
    marginLeft: -11,
    boxShadow: "#ebebeb 0 2px 2px",
    "&:focus, &:hover, &$active": {
      boxShadow: "#ccc 0 2px 3px 1px",
    },
    color: "#fff",
  },
})(Slider);

const SellNft = () => {
  const dispatch = useDispatch();
  const setError = useError();
  const history = useHistory();
  // @ts-ignore
  const { provider, chainID, connected } = useWeb3Context();
  // @ts-ignore
  const [nft, setNft] = useState<NftTypes.IBaseNft>({});
  const [ownToken, setOwnToken] = useState();
  // @ts-ignore
  let { itemId } = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [isItemPreview, setIsItemPreview] = useState(false);
  const [checked, setChecked] = useState(true);
  const [isListingApproved, setIsListingApproved] = useState(false);
  const [tokenListed, setTokenListed] = useState(false);
  const [availablePaymentTokens, setAvailablePaymentTokens] = useState([]);
  const [nftPreviewValues, setNftPreviewValues] = useState<NftTypes.IListPreviewNft | null>(null);
  const [tokenStatus, setTokenStatus] = useState<"approved" | "live" | "bought" | "new" | "prepared" | undefined>(
    "approved",
  );

  const pendingTransactions = useSelector(state => {
    // @ts-ignore
    return state?.pendingTransactions;
  });

  const nftDetails = useSelector(state => {
    // @ts-ignore
    return state?.nft.nftDetails;
  });

  const profileInfo = useSelector(state => {
    // @ts-ignore
    return state?.account && state.account.profileInfo;
  });

  const getNFT = async () => {
    // @ts-ignore
    await dispatch(getMarketItem({ provider, itemId }));
  };

  useEffect(() => {
    if (!isListingApproved && !tokenListed) {
      setTokenStatus("new");
      return;
    }

    if (isListingApproved && !tokenListed) {
      setTokenStatus("approved");
      return;
    }

    setTokenStatus("live");
  }, [tokenListed, isListingApproved]);

  useEffect(() => {
    if (!connected) return;
    if (provider && profileInfo.wallet) {
      console.log("Getting data from the contract...");
      getNFT();
    }
  }, [profileInfo.wallet, connected, itemId]);

  useEffect(() => {
    /** New data will be set after updating the state after the Claim: **/
    if (nftDetails.nft?.itemId) {
      setNft(nftDetails.nft);
    }
  }, [nftDetails.nft]);

  useEffect(() => {
    if (!connected) return;
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);
    const getPaymentTokens = async () => {
      try {
        const rawPaymentTokens = await marketContract.getPaymentTokens();
        if (rawPaymentTokens?.length) {
          // @ts-ignore
          const paymentTokens = rawPaymentTokens.map(paymentToken => ({
            paymentToken,
            // @ts-ignore
            ...tokenConfig[process.env.REACT_APP_NETWORK][paymentToken.toLowerCase()],
          }));
          setAvailablePaymentTokens(paymentTokens);
        }
      } catch (err) {
        console.log("Something went wrong getting payment tokens:", err);
      }
    };

    const getIsNftListingApproved = async () => {
      const NftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
      const signerAddress = await signer.getAddress();
      const isApproved = await NftContract.isApprovedForAll(signerAddress, marketAddress);

      setIsListingApproved(isApproved);
    };

    getPaymentTokens();
    getIsNftListingApproved();
  }, [connected]);

  const defaultPaymentToken = useMemo(() => {
    let defaultToken;
    if (availablePaymentTokens?.length) {
      defaultToken = availablePaymentTokens.find(
        // @ts-ignore
        token => token.paymentToken.toLowerCase() === config.network.usdc.toLowerCase(),
      );
      if (defaultToken) {
        // @ts-ignore
        return defaultToken.paymentToken;
      } else {
        // @ts-ignore
        return availablePaymentTokens[0]?.paymentToken;
      }
    }
  }, [availablePaymentTokens]);

  const handleImageClick = () => {
    setOpenImage(true);
  };

  const handleOpen = () => {
    if (isPendingTxnPurchased) {
      return;
    }

    setOpen(true);
    getNFT();
  };

  const approveTokenListing = async () => {
    await dispatch(
      // @ts-ignore
      approveCreating({
        isApproved: isListingApproved,
        provider,
        setError,
        setTokenApproved: setIsListingApproved,
      }),
    );
  };

  const listToken = async () => {
    await dispatch(
      // @ts-ignore
      tokenListing({
        values: nftPreviewValues,
        provider,
        networkID: chainID,
        setError,
        setNftPreviewValues,
        setTokenListed,
      }),
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: FormikValuesType) => {
    const { paymentToken, price, incomePercentage } = values;
    if (!price) return console.log("no price");
    let paymentTokenSymbol = "guru";
    let tokenPrice;

    try {
      // @ts-ignore
      paymentTokenSymbol = tokenConfig[process.env.REACT_APP_NETWORK][paymentToken.toLowerCase()]?.symbol.toLowerCase();

      if (paymentTokenSymbol === "guru") {
        tokenPrice = ethers.utils.parseUnits(price.toString(), "gwei");
      } else if (paymentTokenSymbol === "usdc") {
        tokenPrice = ethers.utils.parseUnits(price.toString(), "mwei");
      }
    } catch ({ message }) {
      console.error(message);
    }

    setNftPreviewValues({
      name: nft.name,
      creator: nft.creator,
      image: nft.image,
      description: nft.description,
      paymentTokenSymbol: nft.paymentTokenSymbol,
      // @ts-ignore
      price: tokenPrice,
      paymentToken: paymentToken,
      tokenId: nft.tokenId,
      payoutPercentage: incomePercentage,
    });
    setIsItemPreview(true);
  };

  const handlePreviewClose = () => {
    setIsItemPreview(false);
    if (tokenListed) {
      history.push("/explore");
    }
  };

  const handlePreviewButtonClick = () => {
    if (!isListingApproved && !tokenListed) {
      approveTokenListing();
      return;
    }

    if (!tokenListed) {
      listToken();
    }
  };

  useEffect(() => {
    // @ts-ignore
    nft?.owner === profileInfo?.wallet ? setOwnToken(true) : setOwnToken(false);
  }, [profileInfo, nft]);

  // @ts-ignore
  const isPendingTxnPurchased = isPendingTxn(pendingTransactions, "buy_nft_" + nft?.itemId);
  const { loading } = nftDetails;

  const checkIsOwnToken = () => {
    if (!ownToken) return null;

    return true;
  };

  return (
    checkIsOwnToken() && (
      <div>
        <div className={`page ${classes.detailsPage}`}>
          <Card style={{ width: "320px", height: "393px", padding: "16px" }}>
            {!loading && nft && nft.image ? (
              <CardMedia
                alt="nft image"
                style={{ width: "100%", height: "366px", cursor: "zoom-in" }}
                component="img"
                image={nft?.image}
                onClick={handleImageClick}
              />
            ) : (
              <Skeleton animation="wave" variant="rect" height={320} />
            )}
          </Card>
          <div className={classes.info}>
            <Typography
              className={classes.backToSellArrow}
              variant="h6"
              onClick={() => history.push(`/items/${nft.itemId}/`)}
            >
              <SvgIcon viewBox="0 0 16 16" color="primary" component={ArrowLeft} />
            </Typography>
            <Typography variant="h1" className={classes.infoName}>
              {nft?.name}
            </Typography>
            <Typography variant="h6" style={{ marginTop: "24px", marginBottom: 2 }}>
              Sell price
            </Typography>
            {Boolean(defaultPaymentToken) && (
              <Formik
                initialValues={{
                  price: 1,
                  paymentToken: defaultPaymentToken,
                  incomePercentage: "20",
                }}
                onSubmit={handleSubmit}
                validationSchema={Yup.object({
                  price: Yup.number().min(1).typeError("Must be a number").required("Required"),
                  incomePercentage: Yup.number()
                    .min(10)
                    .required("Required")
                    .min(10, "Must be 10% or more")
                    .max(100, "Must be 100% or less"),
                })}
              >
                {({ values, touched, errors, setFieldValue, handleChange, handleBlur, handleSubmit, isValid }) => (
                  <>
                    <form onSubmit={handleSubmit}>
                      <Box display="flex">
                        {Boolean(availablePaymentTokens?.length && defaultPaymentToken) && (
                          <PaymentTokenSelect
                            labelId="paymentToken-label"
                            id="paymentToken"
                            name="paymentToken"
                            value={values.paymentToken}
                            onChange={handleChange}
                            defaultValue={defaultPaymentToken}
                            IconComponent={ArrowDownIcon}
                            input={
                              <OutlinedInput
                                style={{
                                  width: "100px",
                                  borderRadius: "4px 0 0 4px",
                                  background: "rgba(255, 255, 255, 0.1)",
                                }}
                              />
                            }
                          >
                            {availablePaymentTokens?.length &&
                              availablePaymentTokens.map(({ icon, paymentToken, symbol }) => {
                                return (
                                  <MenuItem key={paymentToken} value={paymentToken}>
                                    <div>
                                      {/* @ts-ignore */}
                                      <SvgIcon component={icon} viewBox="0 0 16 14" alt="image" />
                                    </div>
                                    <p style={{ margin: 0 }}>{symbol}</p>
                                  </MenuItem>
                                );
                              })}
                          </PaymentTokenSelect>
                        )}
                        <OutlinedInput
                          // @ts-ignore
                          error={errors.price && touched.price}
                          id="price"
                          type="number"
                          min="1"
                          autoComplete="off"
                          placeholder="1.0"
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ width: "140px", borderRadius: "0 4px 4px 0" }}
                        />
                      </Box>
                      {errors.price && touched.price && <div className="input-create-nft-feedback">{errors.price}</div>}
                      <Typography className={classes.infoText} variant="body2">
                        The amount you wish to sell your NFT for
                      </Typography>
                      <div className={classes.claim}>
                        <div className={classes.claimSection}>
                          <Grid container className={classes.claimValues}>
                            <Grid item xs={12} sm={6}>
                              {!loading && nft ? (
                                <GuruValues
                                  text="Claimable rewards"
                                  price={nft?.redeemableValue}
                                  paymentToken={config.network.guru.toLowerCase()}
                                  size="l"
                                />
                              ) : (
                                <Skeleton width="100%" height="52px" animation="wave" />
                              )}
                            </Grid>
                            <Typography className={classes.infoTextBottom} variant="body2">
                              Transferred to your wallet
                            </Typography>
                          </Grid>
                        </div>
                      </div>
                      <Button
                        className={classes.sellButton}
                        disabled={isPendingTxnPurchased}
                        variant="contained"
                        type="submit"
                        size="medium"
                      >
                        {isPendingTxnPurchased ? <LoadingIndicator /> : "Sell"}
                      </Button>
                      <Typography className={classes.infoTextFee} variant="body2">
                        Fee of 2.5% would be charged when NFT being sold.
                      </Typography>
                    </form>
                  </>
                )}
              </Formik>
            )}
          </div>
          {nft && <Claim nft={nft} open={open} onClose={handleClose} />}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={openImage}
            onClose={() => setOpenImage(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 100,
            }}
          >
            <Fade in={openImage} mountOnEnter unmountOnExit>
              <Box className={classes.zoomInBox}>
                <img
                  id="image"
                  className="image-create-nft"
                  src={nft?.image}
                  style={{ outline: "none", maxWidth: "90vw", maxHeight: "90vh", borderRadius: "4px" }}
                  alt="image details"
                />
              </Box>
            </Fade>
          </Modal>
          {nftPreviewValues && (
            <PreviewItem
              open={isItemPreview}
              onClose={handlePreviewClose}
              imageUrl={nft?.image}
              nft={nftPreviewValues}
              tokenStatus={tokenStatus}
              checked={checked}
              actionType="listing"
              onChange={() => setChecked(!checked)}
              onClick={() => handlePreviewButtonClick()}
            />
          )}
        </div>
      </div>
    )
  );
};

export default SellNft;
