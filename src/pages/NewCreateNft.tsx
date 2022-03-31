import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Button,
  makeStyles,
  Select,
  OutlinedInput,
  withStyles,
  MenuItem,
  SvgIcon,
  Typography,
  Tooltip,
  useMediaQuery,
  Theme,
  Backdrop,
  IconButton,
} from "@material-ui/core";

import { PreviewItem, PreviewItemNew } from "src/components";

import { LoadingIndicator } from "src/components";
import { colors } from "src/themes/dark";
import { ReactComponent as ArrowDownIcon } from "../styles/images/arrowDown.svg";
import { ReactComponent as TangibleTokenIcon } from "../styles/images/tangibleToken.svg";
import { ReactComponent as NFTPreviewIcon } from "../styles/images/nftPreview.svg";
import { ReactComponent as InfoIcon } from "../styles/images/info.svg";
import { ReactComponent as LockIcon } from "../styles/images/lock.svg";
import { ReactComponent as CloseIcon } from "../styles/images/close.svg";

const multipliers = [
  {
    lockDuration: 1,
    mul: "25.0x",
  },
  {
    lockDuration: 2,
    mul: "22.5x",
  },
  {
    lockDuration: 3,
    mul: "20.0x",
  },
  {
    lockDuration: 4,
    mul: "17.5x",
  },
  {
    lockDuration: 5,
    mul: "15.0x",
  },
  {
    lockDuration: 6,
    mul: "15.0x",
  },
  {
    lockDuration: 30,
    mul: "14.6x",
  },
  {
    lockDuration: 60,
    mul: "13.8x",
  },
  {
    lockDuration: 90,
    mul: "13.1x",
  },
  {
    lockDuration: 120,
    mul: "12.3x",
  },
  {
    lockDuration: 150,
    mul: "11.6",
  },
  {
    lockDuration: 180,
    mul: "10.9x",
  },
];

const mockedPreviewValues = {
  name: "NFT Sample",
  creator: "0x0",
  image: InfoIcon,
  description: "desc",
  paymentTokenSymbol: "guru",
  price: 1,
  paymentToken: "guru",
  payoutPercentage: 1,
};

const getLockDateString = (lockDuration: number) => {
  const currentDate = new Date();
  const lockUntilDate = new Date(currentDate.setDate(currentDate.getDate() + lockDuration));

  const month = lockUntilDate.toLocaleString("en-US", { month: "short" });

  return `${lockUntilDate.getUTCDate()} ${month} ${lockUntilDate.getUTCFullYear()}`;
};

const NewCreateNft = () => {
  const classes = useStyles();

  const [isListingApproved, setIsListingApproved] = useState(true);
  const [isItemPreview, setIsItemPreview] = useState(false);
  const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  const getButtonText = () => {
    if (isSmallScreen && !isMobilePreviewMode) {
      return "Preview NFT";
    }

    return "Create NFT";
  };

  // TODO: check create NFT allowance
  // useEffect(() => {
  //   const NftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
  //   const signerAddress = await signer.getAddress();
  //   const isApproved = await NftContract.isApprovedForAll(signerAddress, marketAddress);
  //   setIsListingApproved(isApproved);
  // }, []);

  const handleSubmitClick = async () => {
    if (isListingApproved && !isSmallScreen) {
      setIsItemPreview(true);
      return;
    }

    if (isSmallScreen && !isMobilePreviewMode) {
      setIsMobilePreviewMode(true);
      return;
    }

    if (isSmallScreen && isMobilePreviewMode) {
      setIsItemPreview(true);
      setIsMobilePreviewMode(false);
      return;
    }
  };

  const renderPreviewMobile = () => {
    return (
      <Backdrop open={isMobilePreviewMode} className={classes.backdrop}>
        <div className={classes.nftContainer}>
          <SvgIcon viewBox="0 0 290 290" width="290px" height="290px" component={NFTPreviewIcon} />
          <Typography variant="body2" align="center" className={classes.hintMessage}>
            NFT Preview
          </Typography>
        </div>
        <div className={classes.mobileButtonBlock}>
          <Button onClick={handleSubmitClick} variant="contained" className={classes.gradientButton}>
            {getButtonText()}
          </Button>
        </div>
        <IconButton className={classes.mobileCloseButton} onClick={() => setIsMobilePreviewMode(false)}>
          <CloseIcon viewBox="0 0 16 16" />
        </IconButton>
      </Backdrop>
    );
  };

  return isMobilePreviewMode ? (
    renderPreviewMobile()
  ) : (
    <div className="page">
      <div className={classes.root}>
        <div className="page-section-content">
          <Formik
            initialValues={{
              amount: 1,
              lockDuration: multipliers[0].lockDuration,
            }}
            onSubmit={async values => await handleSubmitClick()}
            validationSchema={Yup.object({
              amount: Yup.number().min(1).typeError("Must be a number").required("Required"),
            })}
          >
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <div className={classes.mintSection}>
                  <div>
                    <Typography variant="h3" className={classes.mainHeader}>
                      Create new 3,3+ NFT
                    </Typography>
                    <Typography className={classes.sectionHeader}>Minting</Typography>
                    <div className={classes.fieldContainer}>
                      <Typography variant="h6" className={classes.fieldHeader}>
                        Amount
                      </Typography>
                      <Typography variant="body2" className={classes.hintMessage}>
                        Locked amount of TNGBL attached to NFT
                      </Typography>
                      <OutlinedInput
                        className={classes.outlinedInput}
                        id="tokenAmount"
                        name="amount"
                        type="text"
                        autoComplete="off"
                        value={values.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.amount && !!touched.amount}
                        startAdornment={
                          <div className={classes.adornmentInputIcon}>
                            <SvgIcon component={TangibleTokenIcon} viewBox="0 0 16 16" />
                          </div>
                        }
                      />
                      <div className={classes.textIconContainer}>
                        <Typography variant="body2" className={classes.hintMessage}>
                          Wallet balance
                        </Typography>
                        <SvgIcon
                          component={TangibleTokenIcon}
                          width="12px"
                          height="12px"
                          viewBox="0 0 16 16"
                          className={classes.walletBalanceIcon}
                        />
                        <Typography variant="body2" className={classes.hintMessage}>
                          23.4
                        </Typography>
                      </div>
                      {errors.amount && touched.amount && (
                        <div className="input-create-nft-feedback">{errors.amount}</div>
                      )}
                    </div>
                    <div className={classes.fieldContainer}>
                      <div className={classes.textIconContainer}>
                        <Typography variant="h6" className={classes.fieldHeader}>
                          Multiplier
                        </Typography>
                        <StyledTooltip
                          interactive
                          placement="top"
                          title={
                            <div className={classes.infoTooltip}>
                              The longer you lock your tokens for, the higher multiplier you receive.{" "}
                              <Link className={classes.learnMoreLink} to="#">
                                Learn more
                              </Link>
                            </div>
                          }
                        >
                          <SvgIcon component={InfoIcon} viewBox="0 0 12 12" className={classes.infoIcon} />
                        </StyledTooltip>
                      </div>
                      <Typography variant="body2" className={classes.hintMessage}>
                        APY multiplier that rewards you for locking your TNGBL
                      </Typography>
                      <SelectMultiplier
                        labelId="tokenMultiplierLabel"
                        id="tokenMultiplier"
                        name="lockDuration"
                        value={values.lockDuration}
                        onChange={handleChange}
                        IconComponent={ArrowDownIcon}
                        input={<OutlinedInput className={classes.outlinedInput} />}
                      >
                        {multipliers.map(({ lockDuration, mul }) => {
                          return (
                            <MenuItem key={lockDuration} value={lockDuration}>
                              {`${mul} (${lockDuration >= 30 ? lockDuration / 30 : lockDuration} ${
                                lockDuration >= 30 ? "months" : "days"
                              })`}
                            </MenuItem>
                          );
                        })}
                      </SelectMultiplier>
                    </div>
                    <Typography variant="body2" className={classes.tokenLock}>
                      <SvgIcon className={classes.lockIcon} component={LockIcon} viewBox="0 0 14 14" />
                      TNGBL will be unlocked on, {getLockDateString(values.lockDuration)}
                    </Typography>
                  </div>
                  <div className={`${classes.nftContainer} ${classes.nftContainerHidden}`}>
                    <SvgIcon viewBox="0 0 290 290" width="290px" height="290px" component={NFTPreviewIcon} />
                    <Typography variant="body2" align="center" className={classes.hintMessage}>
                      NFT Preview
                    </Typography>
                  </div>
                </div>
                <div className={classes.createSection}>
                  <Button
                    type="submit"
                    variant="contained"
                    className={`${classes.gradientButton} ${classes.gradientButtonMobile}`}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
      <PreviewItemNew
        open={isItemPreview}
        onClose={() => setIsItemPreview(false)}
        // imageUrl={"https://ipfs.infura.io:5001/api/v0/cat?arg=" + filePath}
        imageUrl=""
        // @ts-ignore
        nft={mockedPreviewValues}
        tokenStatus="live"
        actionType="listing"
        onClick={async () => {}}
      />
    </div>
  );
};

export default NewCreateNft;

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: "100px 160px 120px",
  },
  mintSection: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "60px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    [theme.breakpoints.down("sm")]: {
      borderBottom: "none",
      display: "flex",
      justifyContent: "center",
    },
  },
  createSection: {
    marginTop: "40px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  mainHeader: {
    lineHeight: "52px",
    marginBottom: "30px",
  },
  sectionHeader: {
    fontSize: "24px",
    fontWeight: 700,
  },
  gradientButton: {
    width: "320px",
    height: "58px",
    borderRadius: "100px",
    fontSize: "18px",
    lineHeight: "18px",
    color: "white",
    background: "linear-gradient(266.21deg, #ff4f4f 5.53%, #2e5cff 96.43%)",
  },
  gradientButtonMobile: {
    [theme.breakpoints.down("sm")]: {
      background: colors.black[1000],
      width: "90%",
    },
  },
  outlinedInput: {
    width: "320px",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  fieldContainer: {
    marginTop: "25px",
  },
  textIconContainer: {
    display: "flex",
    alignItems: "center",
  },
  adornmentInputIcon: {
    height: "16px",
    marginRight: "10px",
  },
  infoIcon: {
    height: "12px",
    marginLeft: "5px",
    color: "transparent",
  },
  lockIcon: {
    height: "14px",
    marginRight: "5px",
  },
  infoTooltip: {
    padding: "10px",
    background: "rgba(12, 12, 12, 0.3)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "6px",
  },
  learnMoreLink: {
    textDecoration: "none",
    color: "#2E5CFF",
  },
  walletBalanceIcon: {
    height: "12px",
    margin: "0 5px",
  },
  fieldHeader: {
    fontSize: "16px",
  },
  hintMessage: {
    opacity: 0.5,
  },
  tokenLock: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  nftContainer: {
    width: "320px",
    height: "365px",
    padding: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "22px",
  },
  nftContainerHidden: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  backdrop: {
    position: "relative",
    "&:first-child": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      zIndex: 9999,
      position: "absolute",
      height: "100vh",
      width: "100%",
    },
  },
  mobileCloseButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: 0,
    marginLeft: 0,
  },
  mobileButtonBlock: {
    marginTop: "100px",
  },
}));

const SelectMultiplier = withStyles({
  icon: {
    width: "25px",
    display: "flex",
    top: "auto",
  },
  root: {
    gap: "5px",
    "&::before": {
      display: "none !important",
    },
  },
})(Select);

const StyledTooltip = withStyles({
  tooltip: {
    maxWidth: "180px",
    margin: 0,
    padding: 0,
  },
})(Tooltip);
