import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { Formik } from "formik";
import * as Yup from "yup";
import { create as ipfsClient } from "ipfs-http-client";
import { useHistory } from "react-router-dom";
import { EnvHelper } from "../helpers/Environment";

// config
import { config } from "src/config";

// constants
import { nftAddress, marketAddress } from "src/constants";

// MUI
import {
  OutlinedInput,
  Select,
  MenuItem,
  Slider,
  SvgIcon,
  Typography,
  makeStyles,
  withStyles,
  Button,
  Box,
  InputAdornment,
} from "@material-ui/core";
import { colors } from "src/themes/dark";

// ABI
import Market from "src/abi/NidhiMarket.json";

// icons
import { ReactComponent as ImageIcon } from "../styles/images/image.svg";
import { ReactComponent as ArrowDownIcon } from "../styles/images/arrowDown.svg";

// state
import { useWeb3Context } from "../hooks/web3Context";

// components
import { PreviewItem } from "src/components";

// context
import { useError } from "src/hooks/useError";
import { useAddress } from "src/hooks/web3Context";

// constants
import { tokenConfig } from "src/constants";

import { approveCreating, tokenCreating, tokenListing } from "../slices/CreateTokenThunk";
import { useDispatch } from "react-redux";

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
console.log("req:", {
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  ...headers,
});
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

const useStyles = makeStyles(theme => ({
  textarea: {
    resize: "both",
  },
  section: {
    width: "50vw",
    display: "flex",
    flexDirection: "column",
    padding: "3rem 0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "43px 20px",
    },
  },
  part: {
    marginBottom: "25px",
  },
  imgContainer: {
    position: "relative",
    padding: "0.25rem",
    border: "1px dashed #FFFFFF80",
    borderRadius: "12px",
    height: "200px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      borderColor: "rgb(229 231 235)",
    },
  },
  // For uploaded image:
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
    borderRadius: "10px",
  },
  imgInput: {
    display: "block",
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    zIndex: 100,
    "& input": {
      height: "100%",
      cursor: "pointer",
      padding: 0,
    },
  },
  mockImage: {
    zIndex: 2,
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  incomePercentageSection: {
    display: "flex",
    alignItems: "center",
  },
  // previewText: {
  //   fontSize: "20px",
  //   fontWeight: "bold",
  // },
  disabledButton: {
    backgroundColor: `${colors.gold[600]} !important`,
  },
}));

export default function CreateNft() {
  const { connected, provider, chainID } = useWeb3Context();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [previewItem, setPreviewItem] = useState(false);
  const [nftPreviewValues, setNftPreviewValues] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isTokenCreated, setIsTokenCreated] = useState(false);
  const [isApproved, setTokenApproved] = useState(false);
  const [tokenListed, setTokenListed] = useState(false);
  const [tokenStatus, setTokenStatus] = useState();
  const [availablePaymentTokens, setAvailablePaymentTokens] = useState([]);
  const address = useAddress();
  const setError = useError();
  const [filePath, setFilePath] = useState("");
  let history = useHistory();

  useEffect(() => {
    // before tx calls:
    if (!isTokenCreated && !tokenListed && !isApproved) setTokenStatus("prepared");
    // just created and sill not approved:
    else if (isTokenCreated && !tokenListed && !isApproved) setTokenStatus("new");
    // already approved and ready to be listed:
    else if (isTokenCreated && !tokenListed && isApproved) setTokenStatus("approved");
    // listed and will appear in the market:
    else if (isTokenCreated && tokenListed && isApproved) setTokenStatus("live");
  }, [isTokenCreated, tokenListed, isApproved]);

  useEffect(() => {
    if (!connected) return;
    const signer = provider.getSigner();
    const MarketContract = new ethers.Contract(marketAddress, Market.abi, signer);
    const getPaymentTokens = async () => {
      try {
        const rawPaymentTokens = await MarketContract.getPaymentTokens();
        if (rawPaymentTokens?.length) {
          const paymentTokens = rawPaymentTokens.map(paymentToken => ({
            paymentToken,
            ...tokenConfig[process.env.REACT_APP_NETWORK][paymentToken.toLowerCase()],
          }));
          setAvailablePaymentTokens(paymentTokens);
        }
      } catch (err) {
        console.log("Something went wrong getting payment tokens:", err);
      }
    };
    getPaymentTokens();
  }, [connected]);

  const defaultPaymentToken = useMemo(() => {
    let defaultToken;
    if (availablePaymentTokens?.length) {
      defaultToken = availablePaymentTokens.find(
        token => token.paymentToken.toLowerCase() === config.network.usdc.toLowerCase(),
      );
      if (defaultToken) {
        return defaultToken.paymentToken;
      } else {
        return availablePaymentTokens[0]?.paymentToken;
      }
    }
  }, [availablePaymentTokens]);

  async function onChangeImg(e) {
    setLoadingImage(true);
    const file = e.target.files[0];
    //larger than 100mb
    if (file.size > 104857600) {
      setError({ message: "File too large!" });
      console.log("Error uploading file: File too large!");
      setLoadingImage(false);
      return;
    }
    try {
      const added = await client.add(file, {
        progress: prog => console.log(`received: ${prog}`),
      });
      setFilePath(added.path);
    } catch (error) {
      setError({ message: error.message });
      console.log("Error uploading file: ", error);
    }
    setLoadingImage(false);
  }

  const createToken = async values => {
    const { name, paymentToken, price, incomePercentage, description } = values;
    if (!name || !price || !filePath) return console.log("");
    let paymentTokenSymbol = "guru";
    let tokenPrice;

    try {
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
      name: name,
      creator: address,
      image: filePath,
      description: description,
      paymentTokenSymbol: paymentTokenSymbol,
      price: tokenPrice,
      paymentToken: paymentToken,
      payoutPercentage: incomePercentage,
    });
    setPreviewItem(true);
  };

  if (Boolean(!defaultPaymentToken))
    return (
      <div className="page">
        <Typography variant="h4" style={{ marginTop: "6rem" }}>
          Please switch to a supported network.
        </Typography>
      </div>
    );
  console.log({ isTokenCreated, tokenListed, isApproved });

  return (
    <div className="page">
      <section className={classes.section}>
        <Typography variant="h1">Create new item</Typography>

        <div>
          <h2>Image</h2>
          <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
            File types supported: JPG, PNG, GIF, SVG. Max size: 100 MB
          </Typography>
          <div className={classes.imgContainer}>
            {filePath && (
              <div className={classes.imgBox}>
                <img className="image-create-nft" src={"https://ipfs.infura.io:5001/api/v0/cat?arg=" + filePath} />
              </div>
            )}

            <OutlinedInput
              type="file"
              name="media"
              id="media"
              tabIndex="-1"
              inputProps={{
                accept: "image/*,webgl/*,.glb,.gltf",
              }}
              onChange={onChangeImg}
              className={classes.imgInput}
            />

            <div className={classes.mockImage}>
              <SvgIcon
                className={loadingImage ? "blink-image" : ""}
                component={ImageIcon}
                viewBox="0 0 48 42"
                alt="image"
              />
            </div>
          </div>
        </div>
        {Boolean(defaultPaymentToken) && (
          <Formik
            initialValues={{
              name: "",
              link: "",
              description: "",
              price: 1,
              paymentToken: defaultPaymentToken,
              incomePercentage: "20",
            }}
            onSubmit={async values => {
              await createToken(values);
            }}
            validationSchema={Yup.object({
              name: Yup.string().max(200, "Must be 200 characters or less").required("Required"),
              link: Yup.string().url("Must be a valid URL"),
              description: Yup.string().max(1000, "Must be 1000 characters or less"),
              price: Yup.number().min(1).typeError("Must be a number").required("Required"),
              incomePercentage: Yup.number()
                .min(10)
                .required("Required")
                .min(10, "Must be 10% or more")
                .max(100, "Must be 100% or less"),
            })}
          >
            {props => {
              const { values, touched, errors, setFieldValue, handleChange, handleBlur, handleSubmit, isValid } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <div className={classes.part}>
                    <Typography variant="h6" htmlFor="name" style={{ margin: "25px 0 15px" }}>
                      Name
                    </Typography>
                    <OutlinedInput
                      id="name"
                      placeholder="Item Name"
                      type="text"
                      autoComplete="off"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name && touched.name}
                    />
                    {errors.name && touched.name && <div className="input-create-nft-feedback">{errors.name}</div>}
                  </div>

                  <div className={classes.part}>
                    <Typography variant="h6" htmlFor="link" style={{ marginTop: "25px" }}>
                      External Link
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                      Nidhi NFT will include a link to this URL on this item's detail page, so that users can click to
                      learn more about it.
                    </Typography>
                    <OutlinedInput
                      id="link"
                      placeholder="https://yoursite/"
                      type="text"
                      autoComplete="off"
                      value={values.link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.link && touched.link}
                    />
                    {errors.link && touched.link && <div className="input-create-nft-feedback">{errors.link}</div>}
                  </div>

                  <div className={classes.part}>
                    <Typography variant="h6" htmlFor="description" style={{ marginTop: "25px" }}>
                      Description
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                      The description will be included on the item's detail page underneath its image.
                    </Typography>
                    <OutlinedInput
                      id="description"
                      placeholder="Type here"
                      autoComplete="off"
                      multiline
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.description && touched.description}
                      inputProps={{ className: classes.textarea }}
                    />
                    {errors.description && touched.description && (
                      <div className="input-create-nft-feedback">{errors.description}</div>
                    )}
                  </div>

                  <hr style={{ margin: "50px 0" }} />

                  <Typography variant="h2">List NFT for sale</Typography>

                  <div className={classes.part}>
                    <Typography variant="h6" style={{ marginTop: "25px" }}>
                      Price
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                      The amount you wish to sell your NFT for
                    </Typography>
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
                                    <SvgIcon component={icon} viewBox="0 0 16 14" alt="image" />
                                  </div>
                                  <p style={{ margin: 0 }}>{symbol}</p>
                                </MenuItem>
                              );
                            })}
                        </PaymentTokenSelect>
                      )}
                      <OutlinedInput
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
                  </div>

                  <div className={classes.part}>
                    <Typography variant="h6" style={{ marginTop: "25px" }}>
                      Stake $GURU Passive Income (%)
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                      Percentage of the sale you want to allocate towards passive income for the buyer.
                    </Typography>

                    <div className={classes.incomePercentageSection}>
                      <OutlinedInput
                        type="number"
                        id="incomePercentage"
                        min="10"
                        max="100"
                        onChange={e => {
                          setFieldValue("incomePercentage", e.target.value.toString(), true);
                        }}
                        style={{ width: "115px" }}
                        onBlur={handleBlur}
                        value={values.incomePercentage}
                        error={errors.incomePercentage}
                        endAdornment={
                          <>
                            <InputAdornment position="start">
                              <span style={{ color: "#FFF" }}>%</span>
                            </InputAdornment>
                          </>
                        }
                      />
                      <Box maxWidth="480px" width="100%" marginLeft="2rem">
                        <IncomeSlider
                          defaultValue={20}
                          value={Number(values.incomePercentage)}
                          className={classes.slider}
                          onChangeCommitted={(_, value) => setFieldValue("incomePercentage", value.toString(), true)}
                        />
                      </Box>
                    </div>
                    {errors.incomePercentage && (
                      <div className="input-create-nft-feedback">{errors.incomePercentage}</div>
                    )}
                  </div>

                  <hr style={{ margin: "50px 0" }} />
                  <Button
                    classes={{ disabled: classes.disabledButton }}
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={!isValid || !filePath}
                  >
                    Create and list NFT
                  </Button>
                </form>
              );
            }}
          </Formik>
        )}
      </section>
      {nftPreviewValues && (
        <PreviewItem
          open={previewItem}
          onClose={() => {
            setPreviewItem(false);
            if (isTokenCreated && tokenListed) {
              history.push("/explore");
            }
          }}
          imageUrl={"https://ipfs.infura.io:5001/api/v0/cat?arg=" + filePath}
          nft={nftPreviewValues}
          tokenStatus={tokenStatus}
          actionType="listing"
          onClick={async () => {
            if (!isApproved && isTokenCreated) {
              dispatch(
                approveCreating({
                  isApproved,
                  provider,
                  setError,
                  setTokenApproved,
                }),
              );
            } else if (!isTokenCreated) {
              dispatch(
                tokenCreating({
                  values: nftPreviewValues,
                  provider,
                  networkID: chainID,
                  setError,
                  client,
                  setNftPreviewValues,
                  setIsTokenCreated,
                  setTokenApproved,
                }),
              );
            } else if (isTokenCreated && !tokenListed && isApproved) {
              dispatch(
                tokenListing({
                  values: nftPreviewValues,
                  provider,
                  networkID: chainID,
                  setError,
                  client,
                  setNftPreviewValues,
                  setTokenListed,
                }),
              );
            }
          }}
        />
      )}
    </div>
  );
}
