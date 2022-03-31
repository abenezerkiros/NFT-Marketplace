import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Telegram } from "../styles/icons/telegram.svg";
import { ReactComponent as Medium } from "../styles/icons/medium.svg";
import { ReactComponent as Twitter } from "../styles/icons/twitter.svg";
import { ReactComponent as Discord } from "../styles/icons/discord.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  socialRow: {
    display: "flex",
    flexFlow: "row",
    justifyContent: "flex-end",
    height: "40px",
    "& a": {
      display: "flex",
      alignItems: "center",
      "&:hover": {
        transform: "scale(1.1)",
      },
    },
    "& > a": {
      marginRight: "20px",
    },
    "& > a:last-child": {
      marginRight: 0,
    },
  },
}));

export default function Social() {
  const classes = useStyles();

  return (
    <div className={classes.socialRow}>
      <Link href="https://medium.com/nidhidao" target="_blank">
        <SvgIcon viewBox="0 0 20 18" color="primary" component={Medium} />
      </Link>

      <Link href="https://twitter.com/NidhiDAO?s=20" target="_blank">
        <SvgIcon viewBox="0 0 20 18" color="primary" component={Twitter} />
      </Link>

      <Link href="https://t.me/joinchat/XHA1pfhwCRA2OGMx" target="_blank">
        <SvgIcon viewBox="0 0 20 18" color="primary" component={Telegram} />
      </Link>

      <Link href="https://discord.com/invite/NidhiDAO" target="_blank">
        <SvgIcon width="24px" height="18px" viewBox="0 0 20 14" color="primary" component={Discord} />
      </Link>
    </div>
  );
}
