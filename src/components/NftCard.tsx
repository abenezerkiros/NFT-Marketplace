import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

// MUI
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  SvgIcon,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

// theme
import { colors } from "src/themes/dark";
import { ReactComponent as GuruIcon } from "src/styles/images/guru.svg";
// config
import { config } from "src/config";

// components
import { NftPrice } from "src/components";
import PassiveIncomePercent from "./PassiveIncomePercent";
import { shortAddress } from "../helpers";

// context
import { useWeb3Context } from "src/hooks/web3Context";
import { usePrice } from "../hooks/usePrice";
import { BigNumberish, ethers } from "ethers";
import { IBaseNft } from "../slices/MarketplaceSlice";
import { publicRpcUrl, tokenConfig } from "../constants";

const useStyles = makeStyles(() => ({
  nftCardSmallText: {
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "15px",
  },
  buyButton: {
    fontSize: "14px",
    lineHeight: "24px",
    padding: "4px 8px",
    display: "none",
    height: "32px",
    color: colors.gold[500],
    backgroundColor: colors.dark[800],
  },
  totalValues: {
    display: "flex",
    flexDirection: "column",
  },
  claimWrapper: {
    display: "none",
  },
  nftCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    width: "353px",
    height: "471px",
  },
  nftCardExplore: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxWidth: "303px",
    minWidth: "303px",
    "&:hover": {
      backgroundColor: colors.dark[900],
      "& $buyButton": {
        display: "block",
      },
      "& $claimWrapper": {
        display: "flex",
      },
    },
  },
  mediaWrapper: {
    height: "320px",
    "& > img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  media: {
    borderRadius: "16px",
  },
  cardContentWrapper: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    alignItems: "flex-start",
    paddingLeft: 0,
  },
  nftText: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "23px",
    color: "#FFFFFF",
  },
  actionArea: {
    padding: "10px 10px 0",
  },
  yellow: {
    color: "#FFFFFF",
  },
  hr: {
    border: "none",
    height: "1px",
    margin: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
}));

interface Props {
  nft?: IBaseNft;
  explore?: boolean;
  buyNft?: (nft: any) => void;
  loading: boolean;
  customStyle?: any;
  claim?: boolean;
  setClaimNft?: (nft: IBaseNft) => void;
}

interface AProps {
  className?: string;
  price: BigNumberish;
}

const ValueInCard = ({ className, price }: AProps) => {
  const classes = useStyles();
  // @ts-ignore
  const { provider, connected, chainID } = useWeb3Context();
  const useProvider = connected ? provider : new ethers.providers.JsonRpcProvider(publicRpcUrl);
  const paymentToken = config.network.guru.toLowerCase();

  const { formattedPrice } = usePrice(price, paymentToken, useProvider);

  return <Typography className={`${classes.nftCardSmallText} ${className}`}>{formattedPrice.price}</Typography>;
};

export default function NftCard({
  nft,
  explore = false,
  buyNft,
  loading,
  customStyle,
  claim = false,
  setClaimNft,
}: Props) {
  const classes = useStyles();
  const { connect, connected } = useWeb3Context();
  let history = useHistory();
  const [state] = useState(nft);

  const handleCardClick = () => {
    if (connected) {
      history.push({
        pathname: `/items/${nft?.itemId}`,
        state,
      });
    } else {
      connect();
    }
  };

  const handleBuyClick = () => {
    if (connected && buyNft) {
      buyNft(nft);
    } else {
      connect();
    }
  };

  let shortedAddress;
  if (nft) {
    shortedAddress = shortAddress(nft.seller);
  }

  const renderOwner = () => {
    if (!nft?.listed && nft?.owner == nft?.seller) {
      return (
        <Link
          style={{
            textDecoration: "none",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
          to={`/profile/${nft?.creatorDeeplink || nft?.creator}`}
        >
          <span>by {nft?.creatorName || shortAddress(nft?.creator)}</span>
        </Link>
      );
    } else if (nft?.listed && nft?.creator == nft?.seller) {
      return (
        <Link
          style={{
            textDecoration: "none",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
          to={`/profile/${nft?.creatorDeeplink || nft?.creator}`}
        >
          <span>by {nft?.creatorName || shortAddress(nft?.creator)}</span>
        </Link>
      );
    } else if (nft?.listed && nft?.creator != nft?.seller) {
      return (
        <>
          <Link
            style={{
              textDecoration: "none",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
            to={`/profile/${nft?.sellerDeeplink || nft?.seller}`}
          >
            <span> by {nft?.sellerName || shortAddress(nft?.seller)}</span>
          </Link>
        </>
      );
    } else if (!nft?.listed && nft?.owner != nft?.creator) {
      return (
        <>
          <Link
            style={{
              textDecoration: "none",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
            to={`/profile/${nft?.ownerDeeplink || nft?.owner}`}
          >
            <span>by {nft?.ownerName || shortAddress(nft?.owner)}</span>
          </Link>
        </>
      );
    }
  };

  const renderActions = () => {
    if (explore && nft?.listed && buyNft) {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* @ts-ignore */}
          <NftPrice explore price={nft?.price} paymentToken={nft?.paymentToken} />
        </div>
      );
    } else if (claim) {
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography className={classes.nftCardSmallText}>Claimable rewards</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SvgIcon
                // @ts-ignore
                component={GuruIcon}
                viewBox="0 0 18 16"
                style={{ marginRight: "6px" }}
              />
              <Typography variant="h6" style={{ fontWeight: 700 }}>
                {nft && (
                  <div className={classes.totalValues}>
                    <ValueInCard className={classes.yellow} price={nft.redeemableValue} />
                  </div>
                )}
              </Typography>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* @ts-ignore */}
          <NftPrice explore price={nft?.price} paymentToken={nft?.paymentToken} />
        </div>
      );
    }
  };

  return (
    <Card className={explore ? classes.nftCardExplore : classes.nftCard} style={customStyle}>
      <CardActionArea disableTouchRipple disableRipple className={classes.actionArea}>
        {loading ? (
          <Skeleton animation="wave" variant="rect" height={320} className={classes.media} />
        ) : (
          <div className={classes.mediaWrapper}>
            <CardMedia
              // @ts-ignore
              classes={{ img: classes.media }}
              onClick={handleCardClick}
              alt="nft image"
              component="img"
              height="312"
              image={nft?.image}
            />
          </div>
        )}
        {loading ? (
          <CardContent>
            <Skeleton width="80%" animation="wave" />
            <Skeleton width="60%" animation="wave" />
            <div style={{ width: "100%" }}>
              <Skeleton width="30%" animation="wave" />
              <Skeleton width="40%" animation="wave" />
            </div>
          </CardContent>
        ) : (
          <CardContent className={classes.cardContentWrapper}>
            <Typography variant="body2" color="textSecondary"></Typography>
            {explore && nft?.listed ? (
              <div className={classes.nftText}>3+3 nft</div>
            ) : (
              // @ts-ignore
              <Typography
                variant="body2"
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold", paddingLeft: "0px" }}
              >
                3,3+NFT
              </Typography>
            )}
            {renderOwner()}
          </CardContent>
        )}
      </CardActionArea>
      <hr className={classes.hr} />
      {loading ? (
        <CardActions>
          <Skeleton width="100%" animation="wave" />
        </CardActions>
      ) : (
        <CardActions style={{ padding: "6px 12px" }}>{nft && renderActions()}</CardActions>
      )}
    </Card>
  );
}
