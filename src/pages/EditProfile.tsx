import { ChangeEvent, useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { create as ipfsHttpClient } from "ipfs-http-client";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import { Button, InputAdornment, OutlinedInput, SvgIcon, Typography } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import TelegramIcon from "@material-ui/icons/Telegram";

// constants
import { profileAddress } from "src/constants";

// ABI
import NidhiProfile from "src/abi/NidhiProfile.json";

// icons
import { ReactComponent as Medium } from "src/styles/icons/medium.svg";
import { ReactComponent as Website } from "src/styles/icons/website.svg";
import { ReactComponent as ImageIcon } from "src/styles/images/image.svg";

// state
import { loadAccountDetails } from "src/slices/AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "src/slices/PendingTxnsSlice";

// context
import { useError } from "src/hooks/useError";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";

// @ts-ignore
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

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
  linksContainer: {
    "& > *": {
      height: "46px",
      borderRadius: "0px",
    },
    "& > :first-child": {
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    },
    "& > :last-child": {
      borderBottomLeftRadius: "4px",
      borderBottomRightRadius: "4px",
    },
  },
  imgContainer: {
    position: "relative",
    border: "1px dashed #FFFFFF80",
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
    borderRadius: "100%",
    "& > img": {
      width: "200px",
      height: "200px",
      borderRadius: "200px",
      objectFit: "cover",
    },
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
}));

export default function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const address = useAddress();
  const setError = useError();
  const history = useHistory();
  // @ts-ignore
  const { connected, chainID, provider } = useWeb3Context();
  const [fileUrl, setFileUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  const profileInfo = useSelector(state => {
    // @ts-ignore
    return state?.account && state.account.profileInfo;
  });

  const pendingTransactions = useSelector(state => {
    // @ts-ignore
    return state?.pendingTransactions;
  });

  useEffect(() => {
    setFileUrl("");
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (connected) dispatch(loadAccountDetails({ networkID: chainID, address, provider }));
  }, []);

  async function onChangeImg(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    setLoadingImage(true);
    const file = e.target.files[0];
    const added = await client.add(file, {
      progress: prog => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    setLoadingImage(false);
    setFileUrl(url);
    return url;
  }

  async function updateProfile(values: any) {
    const signer = provider.getSigner();
    const profileContract = new ethers.Contract(profileAddress, NidhiProfile.abi, signer);
    let tx;
    try {
      tx = await profileContract.update(values);
      dispatch(
        fetchPendingTxns({
          txnHash: tx.hash,
          type: "updating_profile",
        }),
      );
      await tx.wait();
      history.push(`/profile`);
    } catch (e) {
      // @ts-ignore
      setError({ message: e.message });
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
        // @ts-ignore
        dispatch(loadAccountDetails({ networkID: chainID, address, provider }));
      }
    }
  }

  return (
    <div className="page">
      <section className={classes.section}>
        <Typography variant="h1">My profile</Typography>
        <Formik
          enableReinitialize
          initialValues={profileInfo}
          onSubmit={async values => {
            await updateProfile(values);
          }}
          validationSchema={Yup.object({
            name: Yup.string().max(200, "Must be 2 characters or less"),
            deeplink: Yup.string().matches(
              /^[0-9a-z-z\-]+$/,
              "Must only contain lowercase letters,numbers, and hyphens.",
            ),
            description: Yup.string().max(1000, "Must be 1000 characters or less"),
            wallet: Yup.string(),
            imageURL: Yup.string(),
            url: Yup.string().matches(/^[\w\d-.]+$/, "Must be a valid site."),
            // discord: Yup.string().matches(/^[\w\d-@#.]+$/, "Must be a valid username."),
            twitter: Yup.string().matches(/^[\w\d-@#.]+$/, "Must be a valid username."),
            instagram: Yup.string().matches(/^[\w\d-@#.]+$/, "Must be a valid username."),
            medium: Yup.string().matches(/^[\w\d-@#.]+$/, "Must be a valid username."),
            // telegram: Yup.string().matches(/^[\w\d-@#.]+$/, "Must be a valid username."),
          })}
        >
          {props => {
            const { values, touched, errors, setFieldValue, handleChange, handleBlur, handleSubmit, isValid } = props;
            return (
              <form onSubmit={handleSubmit}>
                <div className={classes.part}>
                  <h2>Profile image</h2>
                  <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                    This image will also be used for navigation. 350 x 350 recommended.
                  </Typography>
                  <div className={classes.imgContainer}>
                    {(fileUrl || profileInfo.imageURL) && (
                      <div className={classes.imgBox}>
                        <img className="image-create-nft" src={fileUrl ? fileUrl : profileInfo.imageURL} />
                      </div>
                    )}

                    <OutlinedInput
                      type="file"
                      name="media"
                      id="media"
                      //   tabIndex="-1"
                      //   accept="image/*,video/*,audio/*,webgl/*,.glb,.gltf"
                      onChange={async e => {
                        // @ts-ignore
                        const url = await onChangeImg(e);
                        setFieldValue("imageURL", url);
                        console.log("fileUrl", url);
                      }}
                      className={classes.imgInput}
                    />

                    <div className={classes.mockImage}>
                      <SvgIcon
                        className={loadingImage ? "blink-image" : ""}
                        component={ImageIcon}
                        viewBox="0 0 48 42"
                        // alt="image"
                      />
                    </div>
                  </div>
                </div>

                <div className={classes.part}>
                  <Typography variant="h6" style={{ margin: "25px 0 15px" }}>
                    Name
                  </Typography>
                  <OutlinedInput
                    id="name"
                    placeholder="Ex: Gold treasure"
                    type="text"
                    autoComplete="off"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.name && touched.name)}
                  />
                  {errors.name && touched.name && <div className="input-create-nft-feedback">{errors.name}</div>}
                </div>

                <div className={classes.part}>
                  <Typography variant="h6" style={{ marginTop: "25px" }}>
                    URL
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                    Customize your URL on Nidhi NFT. Must only contain lowercase letters,numbers, and hyphens.
                  </Typography>
                  <OutlinedInput
                    id="deeplink"
                    placeholder="gold-treasure"
                    type="text"
                    autoComplete="off"
                    value={values.deeplink}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.deeplink && touched.deeplink)}
                    startAdornment={
                      <InputAdornment position="start">
                        <span style={{ color: "#FFBC45" }}>{window.location.origin}/profile/</span>
                      </InputAdornment>
                    }
                  />
                  {errors.deeplink && touched.deeplink && <div className="input-create-nft-feedback">{errors.url}</div>}
                </div>

                <div className={classes.part}>
                  <Typography variant="h6" style={{ marginTop: "25px" }}>
                    Description
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: "15px", opacity: 0.5 }}>
                    0 of 1000 characters used.
                  </Typography>
                  <OutlinedInput
                    id="description"
                    autoComplete="off"
                    multiline
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.description && touched.description)}
                    inputProps={{ className: classes.textarea }}
                  />
                  {errors.description && touched.description && (
                    <div className="input-create-nft-feedback">{errors.description}</div>
                  )}
                </div>

                <div className={classes.part}>
                  <Typography variant="h6" style={{ margin: "25px 0 15px" }}>
                    Links
                  </Typography>
                  <div className={classes.linksContainer}>
                    <OutlinedInput
                      id="url"
                      placeholder="yoursite"
                      type="text"
                      autoComplete="off"
                      value={values.url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.url && touched.url)}
                      startAdornment={
                        <>
                          <InputAdornment position="start">
                            <SvgIcon viewBox="0 0 20 20" color="disabled" component={Website} />
                          </InputAdornment>
                          <InputAdornment position="start">https://</InputAdornment>
                        </>
                      }
                    />
                    <OutlinedInput
                      id="twitter"
                      placeholder="my_username"
                      type="text"
                      autoComplete="off"
                      value={values.twitter}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.twitter && touched.twitter)}
                      startAdornment={
                        <>
                          <InputAdornment position="start">
                            <TwitterIcon color="disabled" style={{ width: "20px" }} />
                          </InputAdornment>
                          <InputAdornment position="start">https://twitter.com/</InputAdornment>
                        </>
                      }
                    />
                    <OutlinedInput
                      id="instagram"
                      placeholder="my_username"
                      type="text"
                      autoComplete="off"
                      value={values.instagram}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.instagram && touched.instagram)}
                      startAdornment={
                        <>
                          <InputAdornment position="start">
                            <InstagramIcon color="disabled" style={{ width: "20px" }} />
                          </InputAdornment>
                          <InputAdornment position="start">https://instagram.com/</InputAdornment>
                        </>
                      }
                    />
                    <OutlinedInput
                      id="medium"
                      placeholder="my_username"
                      type="text"
                      autoComplete="off"
                      value={values.medium}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.medium && touched.medium)}
                      startAdornment={
                        <>
                          <InputAdornment position="start">
                            <SvgIcon viewBox="0 0 20 18" color="disabled" component={Medium} />
                          </InputAdornment>
                          <InputAdornment position="start">https://medium.com/</InputAdornment>
                        </>
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={!isValid || pendingTransactions.length > 0}
                >
                  Update
                </Button>
              </form>
            );
          }}
        </Formik>
      </section>
    </div>
  );
}
