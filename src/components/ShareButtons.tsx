import { BigNumber } from "ethers";

// MUI
import { Box, SvgIcon, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Icons
import { ReactComponent as Twitter } from "src/styles/icons/twitter.svg";
import { ReactComponent as Telegram } from "src/styles/icons/telegram.svg";
import { ReactComponent as LinkIcon } from "../styles/icons/link.svg";

const useStyles = makeStyles(() => ({
  socialRow: {
    display: "flex",
    flexFlow: "row",
    gap: "10px",
    justifyContent: "center",
    "& a": {
      height: "36px",
      width: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "rgba(255, 255, 255, 0.05)",
      border: "0.5px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
      borderRadius: "100px",
      "&:hover": {
        transform: "scale(1.1)",
      },
    },
  },
  shareText: {
    fontFamily: "Open Sans",
    fontSize: "14px",
  },
}));

interface Props {
  itemId?: BigNumber;
}

const ShareButtons = ({ itemId }: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column">
      <Box marginBottom={1.5}>
        <Typography variant="body2" className={classes.shareText}>
          Share with your friends
        </Typography>
      </Box>
      <Box className={classes.socialRow}>
        <Link
          href={`http://twitter.com/share?text=Look at my new Passive Income NFT at Nidhi&url=${window.location.origin}/items/${itemId} &hashtags=nidhi,nidhiDAO,GURU`}
          target="_blank"
        >
          <SvgIcon width="16px" height="13px" viewBox="0 0 20 18" color="primary" component={Twitter} />
        </Link>
        <Link
          href={`https://telegram.me/share/url?url=${window.location.origin}/items/${itemId} &text=Look at my new Passive Income NFT at Nidhi`}
          target="_blank"
        >
          <SvgIcon width="16px" height="13px" viewBox="0 0 20 18" color="primary" component={Telegram} />
        </Link>
        <Link href={`${window.location.origin}/items/${itemId}`} target="_blank">
          <SvgIcon width="16px" height="13px" viewBox="0 0 18 16" color="primary" component={LinkIcon} />
        </Link>
      </Box>
    </Box>
  );
};

export default ShareButtons;
