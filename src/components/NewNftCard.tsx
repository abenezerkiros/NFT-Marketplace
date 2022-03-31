import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

// MUI
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Theme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

// theme
import { colors } from "src/themes/dark";

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
import { publicRpcUrl } from "../constants";

interface Props {
  nft?: IBaseNft;
  explore?: boolean;
  loading: boolean;
  creativeHeight?: number;
  customStyle?: any;
  claim?: boolean;
  setClaimNft?: (nft: IBaseNft) => void;
}

type StyleProps = {
  creativeHeight?: number;
};

const useStyles = makeStyles<Theme, StyleProps>(() => ({
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
    maxWidth: 405,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "0px 25px 25px rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(50px)",
  },
  nftCardExplore: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxWidth: 405,
    "&:hover": {
      backgroundColor: colors.dark[900],
      "& $buyButton": {
        display: "block",
      },
      "& $totalValues": {
        display: "none",
      },
      "& $claimWrapper": {
        display: "flex",
      },
    },
  },
  mediaWrapper: {
    height: props => props.creativeHeight,
    "& > img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  media: {
    borderRadius: "16px",
  },
  actionArea: {
    padding: "10px 10px 0",
  },
  yellow: {
    color: colors.gold[500],
  },
  navLink: {
    textDecoration: "none",
    color: colors.gold[500],
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  cardContentWrapper: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    alignItems: "flex-start",
    paddingLeft: 0,
  },
  price: {
    padding: "6px 12px",
  },
  creatorName: {
    fontWeight: 700,
  },
}));

const NewNftCard = ({ nft, explore = false, loading, creativeHeight = 320, customStyle }: Props) => {
  const classes = useStyles({ creativeHeight });
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

  return (
    <Card className={explore ? classes.nftCardExplore : classes.nftCard} style={customStyle}>
      <CardActionArea disableTouchRipple disableRipple className={classes.actionArea}>
        {loading ? (
          <Skeleton animation="wave" variant="rect" height={creativeHeight} className={classes.media} />
        ) : (
          <div className={classes.mediaWrapper}>
            <CardMedia
              // @ts-ignore
              classes={{ img: classes.media }}
              onClick={handleCardClick}
              alt="nft image"
              component="img"
              height={creativeHeight}
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
            <Typography gutterBottom variant="body1" className={classes.creatorName}>
              {nft?.name}
            </Typography>
            <Typography variant="body2">By {nft?.creatorName}</Typography>
          </CardContent>
        )}
      </CardActionArea>
      {loading ? (
        <CardActions>
          <Skeleton width="100%" animation="wave" />
        </CardActions>
      ) : (
        <CardActions className={classes.price}>
          {nft && explore && nft?.listed && (
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              {/* @ts-ignore */}
              <NftPrice explore price={nft?.price} paymentToken={nft?.paymentToken} />
            </Box>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default NewNftCard;
