import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 80px",
    maxWidth: "100%",
    width: "480px",
    backgroundColor: colors.black[900],
    [theme.breakpoints.down("sm")]: {
      width: "350px",
      padding: "30px 0",
    },
  },
  nftCardSmallText: {
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "15px",
  },
  iconButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: 0,
    marginLeft: 0,
    opacity: 0.5,
  },
  previewCard: {
    backgroundColor: colors.dark[800],
  },
  previewText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  approveBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  nftContainer: {
    padding: "16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "22px",
  },
  nftPreviewTitle: {
    opacity: 0.5,
  },
  nftImage: {
    width: "290px",
    height: "290px",
    [theme.breakpoints.down("sm")]: {
      width: "240px",
      height: "240px",
    },
  },
}));

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
  imageUrl: string;
  tokenStatus?: "live" | "bought" | "new" | "prepared" | "approved";
  nft: IBaseNft | IBaseCreateNft | IListPreviewNft;
  onClick?: () => void;
  checked?: boolean;
  onChange?: () => void;
  isApprovedToken?: boolean;
  actionType?: "listing" | "purchase" | "approve";
}

const PreviewItemNew = ({
  open,
  onClose,
  nft,
  onClick,
  checked,
  onChange,
  token,
  imageUrl,
  tokenStatus,
  isApprovedToken,
  actionType,
}: Props) => {
  const classes = useStyles();
  const [action, setAction] = useState<string>();
  const [buttonText, setButtonText] = useState<string>();

  const tokenPayoutPercentage = Number(
    !!tokenStatus && tokenStatus !== "bought" ? 100 - +nft?.payoutPercentage : nft?.payoutPercentage,
  );

  const pendingTransactions = useSelector(state => {
    // @ts-ignore
    return state?.pendingTransactions;
  });

  useEffect(() => {
    console.log("tokenStatus", tokenStatus);
    if (tokenStatus === "prepared") setButtonText("Create NFT");
    else if (tokenStatus === "approved") setButtonText("List NFT");
    else if (tokenStatus === "new") setButtonText("Approve marketplace to list your NFT");
    else if (tokenStatus === "live") setButtonText("");
  }, [tokenStatus]);

  useEffect(() => {
    if (actionType === "listing") setAction("listing");
    if (!tokenStatus && actionType !== "listing") {
      isApprovedToken ? setAction("purchase") : setAction("approve");
    }
  }, [isApprovedToken, tokenStatus]);

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
            {tokenStatus && (
              <Box marginBottom="8px">
                {tokenStatus === "live" && (
                  <Typography variant="h6" align="center" className={classes.previewText}>
                    Your NFT is <span style={{ color: colors.common.red }}>LIVE!</span>
                  </Typography>
                )}
                {tokenStatus === "bought" && (
                  <Typography variant="h6" align="center" className={classes.previewText}>
                    You just bought a new NFT!
                  </Typography>
                )}
                {tokenStatus === "new" && action === "listing" && (
                  <Typography variant="h6" align="center" className={classes.previewText}>
                    NFT Preview
                  </Typography>
                )}
              </Box>
            )}
            {/*<CardMedia alt="nft image" component="img" height="320" image={imageUrl} />*/}
            <div className={classes.nftContainer}>
              <SvgIcon className={classes.nftImage} viewBox="0 0 290 290" component={NFTPreviewIcon} />
            </div>
            <Box display="flex" justifyContent="center" marginTop={3}>
              {/* @ts-ignore */}
              {tokenStatus && tokenStatus === "live" && <ShareButtons itemId={nft?.tokenId} />}
              {action === "approve" && !tokenStatus && (
                <Box className={classes.approveBox}>
                  <Box marginBottom="8px">{`Please approve Nidhi to use your ${token || nft?.paymentTokenSymbol}`}</Box>
                  <Box marginBottom="8px" className={classes.approveBox}>
                    <label className="checkboxContainer">
                      <input type="checkbox" checked={checked} onChange={onChange} />
                      Apply this for all future purchases
                      <span className="checkmark" />
                    </label>
                  </Box>
                  <Button variant="contained" size="large" onClick={onClick}>
                    {isPendingTxn(pendingTransactions, "approve") ? <LoadingIndicator /> : "Approve"}
                  </Button>
                </Box>
              )}
              {action === "purchase" && !tokenStatus && (
                <Button variant="contained" size="large" onClick={onClick}>
                  {/* @ts-ignore */}
                  {isPendingTxn(pendingTransactions, "buy_nft_" + nft.itemId) ? <LoadingIndicator /> : "Buy NFT"}
                </Button>
              )}
              {action === "listing" && tokenStatus !== "live" && (
                <Button variant="contained" size="large" onClick={onClick}>
                  {isPendingTxn(pendingTransactions, "approve") ? <LoadingIndicator /> : buttonText}
                </Button>
              )}
            </Box>
          </Paper>
          <IconButton className={classes.iconButton} onClick={onClose}>
            <CloseIcon viewBox="0 0 16 16" />
          </IconButton>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PreviewItemNew;
