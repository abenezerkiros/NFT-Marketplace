import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  InputAdornment,
  Modal,
  OutlinedInput,
  Paper,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import TabPanel from "../components/TabPanel";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GuruValues from "./GuruValues";
import * as Yup from "yup";
import { useWeb3Context } from "../hooks/web3Context";
import { ethers } from "ethers";
import { marketAddress, nftAddress, routerAddress } from "../constants";
import NFT from "../abi/NidhiNFT.json";
import { create as ipfsClient } from "ipfs-http-client";
import { useHistory } from "react-router-dom";
import { clearPendingTxn, fetchPendingTxns, isPendingTxn } from "../slices/PendingTxnsSlice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingIndicator } from "./index";
import Market from "../abi/NidhiMarket.json";
import { EnvHelper } from "../helpers/Environment";
import routerABI from "../abi/UniswapV2Router02.json";
import { ReactComponent as CloseIcon } from "../styles/images/close.svg";

// config
import { config } from "src/config";

// context
import { useError } from "src/hooks/useError";
import { getMarketItem } from "../slices/NFTsSlice";
import { colors } from "../themes/dark";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: "854px",
    height: "474px",
    left: "374px",
    top: "112px",
    background: "#11161D",
    borderRadius: "20px",
    ["@media (max-width:720px)"]: {
      position: "absolute",
      width: "100%",
      left: 0,
      top: 0,
      height: "100vh",
      background: "rgba(0, 0, 0, 0.2)",
    },
  },
  iconButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: 0,
    marginLeft: 0,
    opacity: 0.5,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    ["@media (max-width:720px)"]: {
      flexDirection: "column",
    },
  },
  claimValues: {
    display: "flex",
    paddingBottom: "30px",
    ["@media (max-width:720px)"]: {
      position: "relative",
      top: "0px",
    },
  },
  value: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    fontSize: "2px",
  },
  modalHead: {
    display: "flex",
    padding: "0 34px",
    alignItems: "center",
    marginBottom: "40px",
  },
  claimValuesTitle: {
    position: "absolute",
    height: "24px",
    top: "65px",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    color: "#FFFFFF",
    ["@media (max-width:720px)"]: {
      left: "14px",
      top: "-430px",
    },
  },
  formContainer: {
    ["@media (max-width:720px)"]: {
      marginTop: 100,
      marginLeft: 10,
    },
  },
  claimValuesSubTitle: {
    position: "absolute",
    height: "36px",
    top: "160px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "36px",
    color: "#FFFFFF",
    ["@media (max-width:720px)"]: {
      left: "14px",
      top: "65px",
    },
  },
  rootTab: {
    "& .MuiTab-wrapper": {
      padding: "0 30px",
    },
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    position: "absolute",
    width: "332px",
    height: "58px",
    left: "472px",
    top: "350px",
    background: "linear-gradient(266.21deg, #FF4F4F 5.53%, #2E5CFF 96.43%)",
    borderRadius: "100px",
    color: "#fff",
    fontWeight: "bold",
    ["@media (max-width:720px)"]: {
      left: "14px",
      top: "199px",
    },
  },
  burnGuruBox: {
    borderRadius: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    height: "48px",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  },
  claimValuesAmount: {
    position: "absolute",
    height: "16px",
    top: "257px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "16px",
    color: "#FFFFFF",
    opacity: 0.5,
    ["@media (max-width:720px)"]: {
      top: "167px",
      left: "15px",
    },
  },
  endAdornment: {},
  maxButton: {
    color: "#2E5CFF",
  },
}));

const projectId = EnvHelper.INFURA_PROJECT_ID;
const projectSecret = EnvHelper.INFURA_PROJECT_SECRET;
const headers =
  projectId && projectSecret
    ? { authorization: "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64") }
    : {};

const client = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  ...headers,
});

export default function Claim(props) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const { provider, chainID } = useWeb3Context();
  const history = useHistory();
  const { nft, open, onClose } = props;
  const classes = useStyles();
  const setError = useError();
  /** usual numbers which user can see **/
  const [maxValues, setMaxValues] = useState({
    claim: 0,
    burn: 0,
    burnUSDC: 0,
  });

  const signer = provider.getSigner();
  const MarketContract = new ethers.Contract(marketAddress, Market.abi, signer);
  const exchange = new ethers.Contract(routerAddress, routerABI, provider);

  useEffect(() => {
    if (nft.itemId) {
      try {
        /** BigNumber to number **/
        const claim = parseFloat(ethers.utils.formatUnits(nft?.redeemableValue, "gwei"));
        const burnValue = nft?.burnNFTValue || ethers.constants.Zero;
        const burn = parseFloat(ethers.utils.formatUnits(burnValue, "gwei"));
        MarketContract.getSwapRoute(config.network.usdc.toLowerCase()).then(route => {
          const reverseSwapPath = [...route];
          if (ethers.constants.Zero.eq(burnValue)) {
            setMaxValues({ claim, burn, burnValue });
          } else {
            exchange.getAmountsOut(burnValue, reverseSwapPath.reverse()).then(amountsOut => {
              const amountOut = amountsOut[amountsOut.length - 1];
              const burnUSDC = parseFloat(ethers.utils.formatUnits(amountOut, "mwei")).toFixed(2);
              setMaxValues({ claim, burn, burnUSDC });
            });
          }
        });
      } catch ({ message }) {
        setError({
          message,
        });
      }
    }
    /** will updated when nft change or get itemId **/
  }, [nft.itemId]);

  const handleChangeTabs = (event, newValue) => {
    setActiveTab(newValue);
  };

  const pendingTransactions = useSelector(state => {
    return state?.pendingTransactions;
  });

  const handleClaim = async values => {
    const { claimValue } = values;
    const valueForClaimInGwei = ethers.utils.parseUnits(claimValue, "gwei");

    let tx;
    try {
      tx = await MarketContract.redeem(nft.itemId, valueForClaimInGwei);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          type: "burn_claim_" + nft.itemId,
        }),
      );
      await tx.wait();
      await dispatch(getMarketItem({ provider, itemId: nft.tokenId }));
      onClose();
    } catch ({ message }) {
      setError({
        message,
      });
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  };

  const handleBurn = async () => {
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    let tx;
    try {
      const NftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

      const isApproved = await NftContract.isApprovedForAll(signerAddress, marketAddress);

      if (!isApproved) {
        const approveAllTx = await NftContract.setApprovalForAll(marketAddress, true);
        await approveAllTx.wait();
      }

      const match = nft.image.match(/[^=]*$/g);
      tx = await NftContract.burn(nft.tokenId);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          type: "burn_claim_" + nft.tokenId,
        }),
      );
      await tx.wait();
      // if (match) {
      //   await client.pin.rm(match[0]);
      // }
      onClose();
      history.push(`/items`);
    } catch ({ message }) {
      setError({
        message,
      });
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 100,
      }}
    >
      <Fade in={open} mountOnEnter unmountOnExit>
        <Paper className={classes.paper}>
          <div className={classes.container}>
            <Grid container className={classes.modalHead}>
              <Grid item>
                <Box
                  component="img"
                  sx={{
                    width: "393px",
                    maxHeight: "393px",
                    borderRadius: "20px",
                    marginTop: 39,
                    ["@media (max-width:720px)"]: {
                      width: "379px",
                      height: "379px",
                      position: "relative",
                      left: "-30px",
                      top: "50px",
                    },
                  }}
                  alt={nft.name}
                  src={nft.image}
                />
              </Grid>
            </Grid>

            <Grid container className={classes.claimValues}>
              <Typography variant="h6" align="center" className={classes.claimValuesTitle}>
                Claim TNGBL
              </Typography>
              <Grid item xs={12} sm={6}></Grid>
              <TabPanel value={activeTab} index={0} style={{ padding: "0 0px" }}>
                <Typography variant="h6" align="center" className={classes.claimValuesSubTitle}>
                  Amount
                </Typography>
                <Formik
                  initialValues={{
                    claimValue: "",
                  }}
                  onSubmit={async values => {
                    await handleClaim(values);
                  }}
                  validationSchema={Yup.object({
                    claimValue: Yup.number()
                      .typeError("Must be a number")
                      .required("Required")
                      .positive("Should be positive number")
                      .max(maxValues.claim),
                  })}
                >
                  {props => {
                    const { values, touched, errors, handleChange, handleBlur, handleSubmit, isValid, setFieldValue } =
                      props;
                    return (
                      <form onSubmit={handleSubmit}>
                        <div className={classes.formContainer}>
                          <OutlinedInput
                            disabled={maxValues.claim === 0}
                            error={errors.claimValue && touched.claimValue}
                            id="claimValue"
                            type="text"
                            autoComplete="off"
                            placeholder="0.0"
                            value={values.claimValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{
                              height: "38px",
                              width: "332px",
                              marginTop: "12px",
                            }}
                            endAdornment={
                              <InputAdornment classes={{ root: classes.endAdornment }} position="end">
                                <Button
                                  disabled={maxValues.claim === 0}
                                  disableRipple
                                  disableFocusRipple
                                  className={classes.maxButton}
                                  onClick={() => {
                                    setFieldValue("claimValue", maxValues.claim.toString());
                                  }}
                                >
                                  MAX
                                </Button>
                              </InputAdornment>
                            }
                          />
                          {errors.claimValue && touched.claimValue && (
                            <div className="input-create-nft-feedback">{errors.claimValue}</div>
                          )}
                        </div>
                        <Typography variant="h6" align="center" className={classes.claimValuesAmount}>
                          Claimable TNGBL {maxValues.claim}
                        </Typography>
                        <Button
                          disabled={!isValid || maxValues.claim === 0}
                          variant="contained"
                          type="submit"
                          size="medium"
                          className={classes.button}
                        >
                          {isPendingTxn(pendingTransactions, "burn_claim_" + nft.itemId) ? (
                            <LoadingIndicator />
                          ) : (
                            "Claim"
                          )}
                        </Button>
                      </form>
                    );
                  }}
                </Formik>
              </TabPanel>
            </Grid>
          </div>
          <IconButton className={classes.iconButton} onClick={onClose}>
            <CloseIcon viewBox="0 0 16 16" />
          </IconButton>
        </Paper>
      </Fade>
    </Modal>
  );
}
