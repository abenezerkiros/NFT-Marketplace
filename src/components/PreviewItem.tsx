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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as CloseIcon } from "../styles/images/close.svg";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";

// theme
import { colors } from "src/themes/dark";

// components
import { GuruValues, LoadingIndicator, ShareButtons } from "src/components";

// helpers
import { shortAddress } from "src/helpers";

// types
import { IBaseNft } from "../slices/MarketplaceSlice";
import { IListPreviewNft } from "../types/Nft";
import PassiveIncomePercent from "./PassiveIncomePercent";
import { BigNumberish } from "ethers";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nftCardContainer: {
    width: "320px",
    height: "326px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 18.1818px 18.1818px rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(36.3636px)",
    borderRadius: "20px",
  },
  ShareContainer: {
    position: "absolute",
    height: "18px",
    left: "137px",
    top: "444px",
  },
  ListButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "300px",
    alignItems: "center",
    padding: "20px 10px",
    background: "linear-gradient(266.21deg, #FF4F4F 5.53%, #2E5CFF 96.43%)",
    borderRadius: "100px",
    color: "#fff",
  },
  paper: {
    padding: "30px 80px",
    maxWidth: "100%",
    width: "426px",
    height: "565px",
    backgroundColor: "#11161D",
    ["@media (max-width:720px)"]: {
      position: "relative",
      width: "80%",
      left: "10%",
    },
  },
  checkboxtext: {
    fontSize: "14px",
  },
  nftCardSmallText: {
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "15px",
  },
  ApproveButton: {
    width: "321px",
    background: "#2E5CFF",
    borderRadius: "100px",
    color: "#FFFFFF",
    "&:focus, &:hover, &$active": {
      background: "#2E5CFF",
    },
  },
  iconButton: {
    position: "relative",
    top: "15px",
    right: "30px",
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
    marginBottom: 15,
  },
  previewTextBuy: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    width: "247px",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: "14px",
  },
  previewCardimage: {
    padding: "16px",
  },
  approveBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "22px",
  },
  BoxText: {
    width: "302px",
    height: "51px",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "140%",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: "22px",
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

const PreviewItem = ({
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
        <Box display="flex" alignItems="flex-start">
          <Paper className={classes.paper}>
            {tokenStatus && (
              <Box marginBottom="8px">
                {tokenStatus === "live" && (
                  <Typography variant="h6" align="center" className={classes.previewText}>
                    Your NFT is now on sale!
                  </Typography>
                )}
                {tokenStatus === "bought" && (
                  <div>
                    <Typography variant="h6" align="center" className={classes.previewTextBuy}>
                      You just bought a new NFT!
                    </Typography>
                    <div className={classes.ShareContainer}>
                      <ShareButtons />
                    </div>
                  </div>
                )}
                {tokenStatus === "new" && action === "listing" && (
                  <Typography variant="h6" align="center" className={classes.previewText}>
                    NFT Preview
                  </Typography>
                )}
              </Box>
            )}
            <Card className={classes.previewCard}>
              <CardActionArea disableTouchRipple disableRipple className={classes.previewCardimage}>
                <CardMedia
                  alt="nft image"
                  component="img"
                  height="284"
                  width="294px"
                  border-radius="20px"
                  image={imageUrl}
                />
              </CardActionArea>
              <hr style={{ margin: 0 }} />
            </Card>
            <Box display="flex" justifyContent="center" marginTop={3}>
              {/* @ts-ignore */}
              {tokenStatus && tokenStatus === "live" && <ShareButtons itemId={nft?.tokenId} />}
              {action === "approve" && !tokenStatus && (
                <Box className={classes.approveBox}>
                  <Box marginBottom="8px" className={classes.BoxText}>
                    {`Please approve TangibleDAO to use your TNGBL`}
                  </Box>
                  <Box marginBottom="8px" className={classes.approveBox}>
                    <label className="checkboxContainer">
                      <input type="checkbox" checked={checked} onChange={onChange} />
                      <div className={classes.checkboxtext}>Apply this for all future purchases</div>
                      <span className="checkmark" />
                    </label>
                  </Box>
                  <Button variant="contained" size="large" className={classes.ApproveButton} onClick={onClick}>
                    {isPendingTxn(pendingTransactions, "approve") ? <LoadingIndicator /> : "Approve"}
                  </Button>
                </Box>
              )}
              {action === "purchase" && !tokenStatus && (
                <div>
                  <Button variant="contained" size="large" className={classes.ApproveButton} onClick={onClick}>
                    {/* @ts-ignore */}
                    {isPendingTxn(pendingTransactions, "buy_nft_" + nft.itemId) ? <LoadingIndicator /> : "Buy NFT"}
                  </Button>
                </div>
              )}
              {action === "listing" && tokenStatus !== "live" && (
                <Button variant="contained" className={classes.ListButton} size="large" onClick={onClick}>
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

export default PreviewItem;
