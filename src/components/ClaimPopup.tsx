import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

// MUI
import {
  Box,
  Backdrop,
  Button,
  Fade,
  Modal,
  Paper,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  SvgIcon,
  OutlinedInput,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";

// theme
import { colors } from "src/themes/dark";

// components
import { GuruValues, LoadingIndicator, ShareButtons } from "src/components";
import { ReactComponent as CloseIcon } from "../styles/images/close.svg";

// helpers
import { shortAddress } from "src/helpers";

// types
import { IBaseNft } from "../slices/MarketplaceSlice";
import { IListPreviewNft } from "../types/Nft";
import PassiveIncomePercent from "./PassiveIncomePercent";
import { BigNumberish } from "ethers";
import { ReactComponent as NFTPreviewIcon } from "../styles/images/nftPreview.svg";
import { ReactComponent as GURUTokenIcon } from "../styles/images/guru.svg";
import { ReactComponent as TangibleTokenIcon } from "../styles/images/tangibleToken.svg";
import { ReactComponent as UsdcTokenIcon } from "../styles/images/usdc.svg";
import { ReactComponent as SettingsIcon } from "../styles/images/settings.svg";
import { ReactComponent as WarningIcon } from "../styles/images/warning.svg";

type FormikValues = {
  tngblAmount: number;
  usdcAmount: number;
  isTngblClaimable: boolean;
  isUsdcClaimable: boolean;
};

export interface IBaseCreateNft {
  name: string;
  image: string;
  description: string;
  paymentTokenSymbol: "guru" | "usdc";
  price: BigNumberish;
  paymentToken: string;
  payoutPercentage: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  token?: "guru" | "usdc";
  tokenStatus?: "live" | "bought" | "new" | "prepared" | "approved";
  onClick?: () => void;
  checked?: boolean;
  onChange?: () => void;
  isApprovedToken?: boolean;
  actionType?: "listing" | "purchase" | "approve";
}

const ClaimPopup = ({ open, onClose, onChange }: Props) => {
  const classes = useStyles();
  const [action, setAction] = useState<string>();
  const [buttonText, setButtonText] = useState<string>();

  const pendingTransactions = useSelector(state => {
    // @ts-ignore
    return state?.pendingTransactions;
  });

  const initialValues: FormikValues = {
    tngblAmount: 1,
    usdcAmount: 1,
    isTngblClaimable: true,
    isUsdcClaimable: false,
  };

  const handleSubmitClick = async (values: FormikValues) => {};

  // @ts-ignore
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableBackdropClick
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 100,
      }}
    >
      <Fade in={open} mountOnEnter unmountOnExit>
        <Box display="flex" alignItems="flex-start" position="relative">
          <Paper className={classes.paper}>
            <div className={classes.nftContainer}>
              <SvgIcon className={classes.nftImage} viewBox="0 0 290 290" component={NFTPreviewIcon} />
            </div>
            <div className={classes.claimContainer}>
              <div className={classes.claimHeaderContainer}>
                <Typography variant="h6" className={classes.claimHeader}>
                  Claim
                </Typography>
                <SvgIcon component={SettingsIcon} viewBox="0 0 16 16" />
              </div>
              <Formik
                initialValues={initialValues}
                onSubmit={async values => await handleSubmitClick(values)}
                validationSchema={Yup.object({
                  guruAmount: Yup.number().min(1).typeError("Must be a number").required("Required"),
                  usdcAmount: Yup.number().min(1).typeError("Must be a number").required("Required"),
                })}
              >
                {({ handleSubmit, values, handleChange, handleBlur, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <div className={classes.inputFieldBlock}>
                      <div className={classes.claimableContainer}>
                        <label className="checkboxContainer">
                          <input
                            id="isTngblClaimable"
                            name="isTngblClaimable"
                            type="checkbox"
                            checked={values.isTngblClaimable}
                            onChange={handleChange}
                          />
                          Claimable TNGBL
                          <span className="checkmark" />
                        </label>
                        <span>32.0</span>
                      </div>
                      <div className={classes.outlinedInputMeta}>
                        <div className={classes.outlinedInputContainer}>
                          <OutlinedInput
                            className={classes.outlinedInput}
                            id="tngblAmount"
                            name="tngblAmount"
                            type="text"
                            autoComplete="off"
                            value={values.tngblAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!values.isTngblClaimable}
                            error={!!errors.tngblAmount && !!touched.tngblAmount}
                            startAdornment={
                              <div className={classes.adornmentInputIcon}>
                                <SvgIcon component={TangibleTokenIcon} viewBox="0 0 16 16" />
                              </div>
                            }
                            endAdornment={<div className={classes.maxButton}>MAX</div>}
                          />
                        </div>
                        <Typography variant="body2" className={classes.hintMessage}>
                          ($423.78)
                        </Typography>
                        {errors.tngblAmount && touched.tngblAmount && (
                          <div className="input-create-nft-feedback">{errors.tngblAmount}</div>
                        )}
                      </div>
                    </div>
                    <div className={classes.inputFieldBlock}>
                      <div className={classes.claimableContainer}>
                        <label className="checkboxContainer">
                          <input
                            id="isUsdcClaimable"
                            name="isUsdcClaimable"
                            type="checkbox"
                            checked={values.isUsdcClaimable}
                            onChange={handleChange}
                          />
                          Claimable USDC
                          <span className="checkmark" />
                        </label>
                        <span>29.0</span>
                      </div>
                      <div className={classes.outlinedInputMeta}>
                        <div className={classes.outlinedInputContainer}>
                          <OutlinedInput
                            className={classes.outlinedInput}
                            id="usdcAmount"
                            name="usdcAmount"
                            type="text"
                            autoComplete="off"
                            value={values.usdcAmount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={!values.isUsdcClaimable}
                            error={!!errors.usdcAmount && !!touched.usdcAmount}
                            startAdornment={
                              <div className={classes.adornmentInputIcon}>
                                <SvgIcon component={UsdcTokenIcon} viewBox="0 0 16 14" />
                              </div>
                            }
                          />
                        </div>
                        {errors.usdcAmount && touched.usdcAmount && (
                          <div className="input-create-nft-feedback">{errors.usdcAmount}</div>
                        )}
                      </div>
                    </div>
                    <div className={classes.warningWrapper}>
                      <SvgIcon component={WarningIcon} viewBox="0 0 16 14" />
                      <Typography variant="body2" className={classes.claimingWarning}>
                        By claiming TNGBL you are reducing your % of USDC rewards from Tangible marketplace revenue.
                        <Link className={classes.learnMoreLink} to="#">
                          Learn more.{" "}
                        </Link>
                      </Typography>
                    </div>
                    <div>
                      <Button type="submit" className={`gradientButton ${classes.claimButton}`}>
                        {isPendingTxn(pendingTransactions, "approve") ? <LoadingIndicator /> : "Claim"}
                      </Button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </Paper>
          <IconButton className={classes.iconButton} onClick={onClose}>
            <CloseIcon viewBox="0 0 16 16" />
          </IconButton>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ClaimPopup;

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 35px",
    width: "850px",
    backgroundColor: colors.dark[500],
    [theme.breakpoints.down("sm")]: {
      width: "350px",
      padding: "30px 0",
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
  nftContainer: {
    padding: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "22px",
  },
  claimContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  nftImage: {
    width: "360px",
    height: "360px",
    "& react": {
      width: "360px",
      height: "360px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "240px",
      height: "240px",
    },
  },
  inputFieldBlock: {
    marginBottom: "20px",
  },
  claimHeader: {
    fontSize: "20px",
    fontWeight: 700,
  },
  claimHeaderContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "25px 0 40px",
  },
  fieldHeader: {
    fontSize: "16px",
  },
  hintMessage: {
    opacity: 0.5,
  },
  adornmentInputIcon: {
    height: "16px",
    marginRight: "10px",
  },
  outlinedInputMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },
  outlinedInputContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  outlinedInput: {
    width: "305px",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  claimButton: {
    width: "330px",
    marginTop: "20px",
  },
  claimableContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  claimingWarning: {
    width: "305px",
    fontSize: "12px",
    lineHeight: "18px",
  },
  warningWrapper: {
    display: "flex",
    alignItems: "flex-start",
  },
  maxButton: {
    fontWeight: 700,
    fontSize: "14px",
    color: colors.blue[500],
  },
  learnMoreLink: {
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
    color: colors.blue[500],
  },
}));
