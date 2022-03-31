import React, { useState } from "react";
import { Button, makeStyles, OutlinedInput, SvgIcon, Typography } from "@material-ui/core";
import * as Yup from "yup";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { ReactComponent as TangibleTokenIcon } from "../styles/images/tangibleToken.svg";
import { ReactComponent as GURUTokenIcon } from "../styles/images/guru.svg";
import { tokenAddress } from "../constants";
import IERC20 from "../abi/IERC20.json";
import TangibleTokenSwap from "../abi/TangibleTokenSwap.json";
import { useWeb3Context } from "../hooks/web3Context";
import { useError } from "../hooks/useError";
import { clearPendingTxn, fetchPendingTxns, isPendingTxn } from "../slices/PendingTxnsSlice";
import { LoadingIndicator } from "../components";

type FormikValues = {
  guruAmount: number;
};

const TokenSwap = () => {
  const classes = useStyles();
  const { provider } = useWeb3Context();
  const dispatch = useDispatch();
  const setError = useError();
  const pendingTransactions = useSelector(state => {
    // @ts-ignore
    return state?.pendingTransactions;
  });
  const [isSwapPhase, setIsSwapPhase] = useState(false);

  const isPendingTransactions =
    isPendingTxn(pendingTransactions, "approve_guru") || isPendingTxn(pendingTransactions, "swap_guru");
  const initialValues: FormikValues = { guruAmount: 1 };

  const getButtonText = () => {
    return isSwapPhase ? "Swap" : "Approve Guru";
  };

  const approveGuru = async (guruAmount: number) => {
    let approveTx;

    try {
      const signer = provider.getSigner();

      const guruContract = new ethers.Contract(tokenAddress, IERC20.abi, signer);
      approveTx = await guruContract.approve(TangibleTokenSwap.address, ethers.constants.MaxUint256);

      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          type: "approve_guru",
        }),
      );

      await approveTx.wait();
      setIsSwapPhase(true);
    } catch ({ message }) {
      // @ts-ignore
      setError({ message });
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  };

  const swapGuru = async (guruAmount: number) => {
    let swapTx;
    try {
      const signer = provider.getSigner();

      const swapContact = new ethers.Contract(TangibleTokenSwap.address, TangibleTokenSwap.abi, signer);
      const swapAmount = ethers.utils.parseUnits(guruAmount.toString(), "gwei");

      swapTx = await swapContact.swap(swapAmount);

      dispatch(
        fetchPendingTxns({
          txnHash: swapTx.hash,
          type: "swap_guru",
        }),
      );

      await swapTx.wait();
    } catch ({ message }) {
      // @ts-ignore
      setError({ message });
    } finally {
      if (swapTx) {
        dispatch(clearPendingTxn(swapTx.hash));
      }
    }
  };

  const handleSubmitClick = async (guruAmount: number) => {
    if (isSwapPhase) {
      await swapGuru(guruAmount);
      return;
    }

    await approveGuru(guruAmount);
  };

  return (
    <div className="page">
      <div className={classes.root}>
        <div className="page-section-content">
          <Formik
            initialValues={initialValues}
            onSubmit={async values => await handleSubmitClick(values.guruAmount)}
            validationSchema={Yup.object({
              guruAmount: Yup.number().min(1).typeError("Must be a number").required("Required"),
            })}
          >
            {({ handleSubmit, values, handleChange, handleBlur, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <div className={classes.formWrapper}>
                  <div className={classes.blockWrapper}>
                    <Typography variant="h6" className={classes.fieldHeader}>
                      Guru Amount
                    </Typography>
                    <Typography variant="body2" className={classes.hintMessage}>
                      Input GURU amount to swap
                    </Typography>
                    <OutlinedInput
                      className={classes.outlinedInput}
                      id="guruAmount"
                      name="guruAmount"
                      type="text"
                      autoComplete="off"
                      value={values.guruAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.guruAmount && !!touched.guruAmount}
                      startAdornment={
                        <div className={classes.adornmentInputIcon}>
                          <SvgIcon component={GURUTokenIcon} viewBox="0 0 16 14" />
                        </div>
                      }
                    />
                  </div>
                  <div className={classes.blockWrapper}>
                    <Typography variant="h6" className={classes.fieldHeader}>
                      Tangible Amount
                    </Typography>
                    <Typography variant="body2" className={classes.hintMessage}>
                      TNGBL amount to be received
                    </Typography>
                    <OutlinedInput
                      disabled
                      className={classes.outlinedInput}
                      id="tangibleAmount"
                      name="tangibleAmount"
                      type="text"
                      autoComplete="off"
                      value={values.guruAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      startAdornment={
                        <div className={classes.adornmentInputIcon}>
                          <SvgIcon component={TangibleTokenIcon} viewBox="0 0 16 16" />
                        </div>
                      }
                    />
                  </div>
                  <div className={classes.blockWrapper}>
                    <Button type="submit" variant="contained" className={`${classes.gradientButton}`}>
                      {isPendingTransactions ? <LoadingIndicator /> : getButtonText()}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    margin: "100px 160px 120px",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  blockWrapper: {
    marginBottom: "30px",
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
  outlinedInput: {
    width: "320px",
    borderRadius: "4px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  gradientButton: {
    width: "280px",
    height: "50px",
    borderRadius: "100px",
    fontSize: "18px",
    lineHeight: "18px",
    color: "white",
    background: "linear-gradient(266.21deg, #ff4f4f 5.53%, #2e5cff 96.43%)",
  },
}));
