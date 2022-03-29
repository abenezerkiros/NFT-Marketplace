import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

//Icons
import {
  InfoRounded,
  SignalCellular0Bar,
  SignalCellularAltOutlined,
  SignalCellularOffOutlined,
} from "@material-ui/icons";

// hooks
import { usePrice } from "src/hooks/usePrice";
import { useError } from "../hooks/useError";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks/web3Context";

//recharts
import {
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
// thunks and slices
import { alreadyApprovedToken, buyNft, changeApproval } from "../slices/PurchaseThunk";
import { getMarketItem, clearNftDetails } from "../slices/NFTsSlice";
import { isPendingTxn } from "../slices/PendingTxnsSlice";

//axios
import axios from "axios";
// components
import { CardMedia, Card, Typography, Button, Grid, Backdrop, Modal, Fade, Box, SvgIcon } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  LoadingIndicator,
  PreviewItem,
  PassiveIncomePercent,
  GuruValues,
  Claim,
  MoreItemsCreator,
} from "src/components";

// config
import { config } from "src/config";

// Icons
import { ReactComponent as NetworkIcon } from "src/styles/images/networkIcon.svg";
import { ReactComponent as Star } from "src/styles/images/star.svg";
import { ReactComponent as LockIcon } from "src/styles/images/lock.svg";
import { ReactComponent as USDIcon } from "src/styles/images/usdIcon.svg";
import { ReactComponent as MarketValue } from "src/styles/images/marketValueIcon.svg";

import { tokenConfig } from "../constants";
import { colors } from "../themes/dark";
import { DetailsActionsSocial } from "src/components/DetailsActionsSocial";

const useStyles = makeStyles(theme => ({
  detailsPage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "start",
    padding: "52px 0",
    [theme.breakpoints.up("xs")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("lg")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up("xl")]: {
      flexDirection: "row",
    },
  },
  //networkIcon container
  iconBackground: {
    padding: "4px",
    width: "40px",
    height: "40px",
    background: "rgba(46, 92, 255, 0.2)",
    border: "0.5px solid rgba(255, 255, 255, 0.1)",
    boxSizing: "border-box",
    borderRadius: "100px",
  },
  //image card container
  imgCard: {
    objectFit: "contain",
    marginRight: "30px",
    marginLeft: 0,
    marginBottom: "50px",
    width: "382px",
    overflow: "hidden",
    [theme.breakpoints.up("xs")]: {
      width: "90%",
      marginLeft: "16px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("sm")]: {
      width: "382px",
      marginLeft: "15px",
    },
    [theme.breakpoints.up("md")]: {
      width: "382px",
      marginLeft: "20px",
    },
  },
  //wrapper container for icons and name
  shareInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
  },
  //Graph container
  graphContainer: {
    marginTop: "350px",
    background: "#232A33",
    borderRadius: "12px",
    height: "400px",
    [theme.breakpoints.up("xs")]: { width: "379px" },
    [theme.breakpoints.up("sm")]: { width: "605px" },
    [theme.breakpoints.up("md")]: { width: "794px" },
    [theme.breakpoints.up("lg")]: { width: "794px" },
    [theme.breakpoints.up("xl")]: { width: "794px" },
  },
  //Share and link Icons wrapper
  shareInfoLeft: {
    [theme.breakpoints.up("xs")]: {
      marginRight: "70px",
    },
    [theme.breakpoints.up("sm")]: {
      marginRight: "20px",
    },
    [theme.breakpoints.up("md")]: {
      marginRight: "10px",
    },
    [theme.breakpoints.up("lg")]: {
      marginRight: "10px",
    },
    [theme.breakpoints.up("xl")]: {
      marginRight: "10px",
    },
  },
  info: {
    marginLeft: "25px",
    display: "flex",
    flexDirection: "column",
  },
  //claim section container
  claim: {
    width: "704px",
    height: "209px",
    borderRadius: "6px",
    background: "#232A33",
    borderradius: "12px",
    marginTop: "50px",
    [theme.breakpoints.up("xs")]: { height: "257px", width: "359px", marginLeft: -10 },
    [theme.breakpoints.up("sm")]: {
      height: "257px",
      width: "595px",
    },
    [theme.breakpoints.up("md")]: { width: "804px", height: "319px" },
    [theme.breakpoints.up("lg")]: { width: "804px", height: "209px" },
    [theme.breakpoints.up("xl")]: { width: "804px", height: "209px" },
  },
  //claim section claim button
  claimButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    position: "absolute",
    width: "482px",
    marginLeft: "300px !important",
    height: "58px",
    marginTop: "17px",
    background: "linear-gradient(266.21deg, #2e5cff 5.53%, #2e5cff 96.43%)",
    borderRadius: "100px !important",
    color: "white !important",
    [theme.breakpoints.up("xs")]: { marginLeft: "10px !important", width: "80%", marginTop: "25px" },
    [theme.breakpoints.up("sm")]: {
      marginLeft: "130px !important",
      width: "351px",
      marginTop: "45px",
    },
    [theme.breakpoints.up("md")]: { marginLeft: "130px !important", width: "511px", marginTop: "85px" },
    [theme.breakpoints.up("lg")]: { width: "582px", marginLeft: "200px !important", marginTop: "-30px" },
    [theme.breakpoints.up("xl")]: { width: "482px", marginLeft: "300px !important", marginTop: "-30px" },
  },
  //claim section claim button
  buyNowButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    width: "802px",
    height: "58px",

    background: "linear-gradient(266.21deg, #FF4F4F  5.53%, #2e5cff 96.43%)",
    borderRadius: "100px !important",
    color: "white !important",
    [theme.breakpoints.up("xs")]: { width: "359px" },
    [theme.breakpoints.up("sm")]: { width: "605px" },
    [theme.breakpoints.up("md")]: { width: "802px" },
    [theme.breakpoints.up("lg")]: { width: "802px" },
    [theme.breakpoints.up("xl")]: { width: "802px" },
  },
  //claim section text description container
  claimableDescription: {
    width: "550px",
    display: "flex",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontSeight: "600",
    fontSize: "12px",
    lineHeight: "22px",
    color: "#ffffff",
    marginRight: "90px",
    marginLeft: "20px",
    marginBottom: "30px",
    opacity: 0.5,
    [theme.breakpoints.up("xs")]: { marginRight: "0px", marginLeft: "0px", width: "95%" },
    [theme.breakpoints.up("sm")]: { marginRight: "0px", marginLeft: "0px", width: "350px" },
    [theme.breakpoints.up("md")]: { marginRight: "0px", marginLeft: "0px", width: "200px" },
    [theme.breakpoints.up("lg")]: { marginRight: "0px", marginLeft: "0px", width: "230px" },
    [theme.breakpoints.up("xl")]: { marginRight: "0px", marginLeft: "0px", width: "230px" },
  },
  claimValues: {
    display: "flex",
    paddingBottom: "30px",
    justifyContent: "space-between",
    marginTop: "30px",
    [theme.breakpoints.up("xs")]: {},
    [theme.breakpoints.up("sm")]: { flexDirection: "column" },
    [theme.breakpoints.up("md")]: { flexDirection: "column" },
    [theme.breakpoints.up("lg")]: { flexDirection: "column" },
    [theme.breakpoints.up("xl")]: { flexDirection: "column" },
  },
  sellTangibleSection: {
    display: "flex",
    flexDirection: "row",
    marginTop: "50px",
    justifyContent: "space-around",
  },
  //sell section text container
  selltemsLeft: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { marginLeft: "20px", top: "-20px", left: "-210px", width: "290px" },
    [theme.breakpoints.up("sm")]: { left: "-20px", top: "10px" },
    [theme.breakpoints.up("md")]: { top: "30px", flexDirection: "column" },
    [theme.breakpoints.up("lg")]: { flexDirection: "column" },
    [theme.breakpoints.up("xl")]: { flexDirection: "column" },
  },
  //buy section text container
  buytemsLeft: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    marginTop: "40px",
    [theme.breakpoints.up("xs")]: { marginRight: "90px", width: "300px", top: "-50px" },
    [theme.breakpoints.up("sm")]: { left: "-20px", top: "10px" },
    [theme.breakpoints.up("md")]: { top: "10px", flexDirection: "column" },
    [theme.breakpoints.up("lg")]: { flexDirection: "column", top: "10px" },
    [theme.breakpoints.up("xl")]: { flexDirection: "column", top: "10px" },
  },
  //claim section right items container
  claimItems: {
    display: "flex",
    justifyContent: "space-evenly",
    marginLeft: "200px",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { marginLeft: "0px", marginTop: "70px" },
    [theme.breakpoints.up("sm")]: { marginLeft: "0px", marginTop: "70px" },
    [theme.breakpoints.up("md")]: { marginLeft: "10px", marginTop: "20px" },
    [theme.breakpoints.up("lg")]: { marginLeft: "200px" },
    [theme.breakpoints.up("xl")]: { marginLeft: "200px" },
  },
  claimItemsRight: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "35px",
  },

  //claim section frist row left container
  claimValuesButton: {
    background: "#11161D",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    width: "205px",
    height: "60px",
    padding: "15px",
    paddingRight: "30px",
    [theme.breakpoints.up("xs")]: { width: "105px", marginLeft: "15px", marginRight: "40px" },
    [theme.breakpoints.up("sm")]: { width: "205px", marginLeft: "70px" },
    [theme.breakpoints.up("md")]: { flexDirection: "column" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  //claim section frist row right container
  claimValuesButtonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#11161D",
    borderRadius: "12px",
    width: "205px",
    height: "60px",
    marginLeft: "40px",
    padding: "15px",
    [theme.breakpoints.up("xs")]: { width: "105px", marginRight: "20px" },
    [theme.breakpoints.up("sm")]: { width: "205px", marginRight: "70px" },
    [theme.breakpoints.up("md")]: { flexDirection: "column" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  //sell section description text
  sellSectionDescription: {
    width: "150px",
    display: "flex",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontSeight: "600",
    fontSize: "12px",
    lineHeight: "22px",
    color: "#ffffff",
    marginRight: "90px",
    marginLeft: "20px",
    marginBottom: "30px",
    opacity: 0.5,
    [theme.breakpoints.up("xs")]: { marginLeft: "0px", flexDirection: "column", width: "350px" },
    [theme.breakpoints.up("sm")]: { marginLeft: "0px", flexDirection: "column", width: "200px" },
    [theme.breakpoints.up("md")]: { flexDirection: "row" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  //sell section first row middle container
  sellSectionMiddle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#11161D",
    borderRadius: "12px",
    width: "105px",
    height: "60px",
    marginLeft: "40px",
    padding: "15px",
    [theme.breakpoints.up("xs")]: { width: "100px" },
    [theme.breakpoints.up("sm")]: { width: "105px", marginLeft: "-55px" },
    [theme.breakpoints.up("md")]: { width: "205px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  sellSectionMiddleWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  //multiplier text
  multiplierText: {
    display: "flex",

    opacity: "0.4",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { left: "60px", top: "45px" },
    [theme.breakpoints.up("sm")]: { left: "-30px", top: "45px" },
    [theme.breakpoints.up("md")]: { left: "20px", top: "45px" },
    [theme.breakpoints.up("lg")]: { left: "20px", top: "45px" },
    [theme.breakpoints.up("xl")]: { left: "20px", top: "45px" },
  },
  //sell section first row right container
  sellSectionRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#11161D",
    borderRadius: "12px",
    width: "305px",
    height: "60px",
    marginLeft: "40px",
    padding: "15px",
    [theme.breakpoints.up("xs")]: { width: "229px", marginLeft: "15px" },
    [theme.breakpoints.up("sm")]: { width: "215px", marginLeft: "15px" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", width: "275px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row", width: "275px" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row", width: "275px" },
  },
  //sell section second row right container
  sellSectionRightMiddle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#11161D",
    borderRadius: "12px",
    width: "445px",
    height: "60px",
    marginLeft: "135px",
    position: "absolute",
    padding: "15px",
    [theme.breakpoints.up("xs")]: { right: "-110px", top: "30px", width: "300px" },
    [theme.breakpoints.up("sm")]: { left: "85px", bottom: "-2px", width: "305px" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", width: "500px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  //sell section second row right container
  sellSectionRightBottom: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#11161D",
    borderRadius: "12px",
    width: "445px",
    height: "60px",
    marginLeft: "35px",
    padding: "15px",
    [theme.breakpoints.up("xs")]: { width: "255px", marginLeft: "-45px", marginTop: "-10px" },
    [theme.breakpoints.up("sm")]: { width: "255px", marginLeft: "-45px", marginTop: "-10px" },
    [theme.breakpoints.up("md")]: { width: "745px" },
    [theme.breakpoints.up("lg")]: { width: "745px" },
    [theme.breakpoints.up("xl")]: { width: "745px" },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomInBox: {
    padding: "15px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "0.5px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "6px",
    backdropFilter: "blur(40px)",
  },
  description: {
    width: "720px",
    wordBreak: "break-word",
    marginBottom: "34px",
    opacity: 0.5,
    lineHeight: "18px",
  },
  //second big container
  sellSection: {
    background: "#232A33",
    justifyContent: "space-between",
    alignItems: "center",
    width: "804px",
    height: "337px",
    borderRadius: "12px",
    marginTop: "20px",
    marginBottom: 50,
    position: "relative",
    [theme.breakpoints.up("xs")]: { width: "359px", height: "390px", marginLeft: -10 },
    [theme.breakpoints.up("sm")]: { width: "595px", height: "387px" },
    [theme.breakpoints.up("md")]: { width: "804px", height: "307px" },
    [theme.breakpoints.up("lg")]: { width: "804px", height: "307px" },
    [theme.breakpoints.up("xl")]: { width: "804px", height: "307px" },
  },
  //buy section container
  buySection: {
    background: "#232A33",
    justifyContent: "space-between",
    alignItems: "center",
    width: "804px",
    height: "387px",
    borderRadius: "12px",
    marginTop: "20px",
    marginBottom: "20px",
    position: "relative",
    [theme.breakpoints.up("xs")]: { width: "359px", height: "470px" },
    [theme.breakpoints.up("sm")]: { width: "605px", height: "387px" },
    [theme.breakpoints.up("md")]: { width: "804px", height: "407px" },
    [theme.breakpoints.up("lg")]: { width: "804px", height: "407px" },
    [theme.breakpoints.up("xl")]: { width: "804px", height: "407px" },
  },
  //sell item first row right section
  lockedTangible: {
    display: "flex",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { marginRight: "100px", top: "30px" },
    [theme.breakpoints.up("sm")]: { marginLeft: "450px", top: "10px" },
    [theme.breakpoints.up("md")]: { marginLeft: "500px", top: "30px" },
    [theme.breakpoints.up("lg")]: {},
    [theme.breakpoints.up("xl")]: {},
  },
  //sell button
  sellButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 10px",
    width: "800px",
    height: "58px",
    position: "absolute",
    top: "430px",
    background: "linear-gradient(266.21deg, #000000 5.53%, #000000 96.43%)",
    border: "0.5px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "100px !important",
    color: "white",
    [theme.breakpoints.up("xs")]: { width: "90%" },
    [theme.breakpoints.up("sm")]: { width: "605px", top: "430px" },
    [theme.breakpoints.up("md")]: { width: "804px", top: "343px" },
    [theme.breakpoints.up("lg")]: { width: "804px", top: "343px" },
    [theme.breakpoints.up("xl")]: { width: "804px", top: "343px" },
  },
  //SellItem First row container
  sellItemSectionRowsTop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "30px",
    marginTop: "0px",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { top: "30px", right: "155px", flexDirection: "column" },
    [theme.breakpoints.up("sm")]: { top: "30px", left: "10px", flexDirection: "row" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", top: "-10px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row", top: "-10px" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row", top: "-10px" },
  },
  //SellItem second row container
  sellItemSectionRowsMiddle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "30px",
    marginTop: "30px",
    position: "absolute",
    [theme.breakpoints.up("xs")]: { right: "160px", bottom: "135px", flexDirection: "row" },
    [theme.breakpoints.up("sm")]: { left: "10px", bottom: "180px", flexDirection: "row" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", top: "140px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row" },
  },
  //buy section second row container
  buyItemSectionRowsMiddle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "30px",
    position: "absolute",
    top: "130px",
    [theme.breakpoints.up("xs")]: { right: "160px", top: "185px", flexDirection: "column" },
    [theme.breakpoints.up("sm")]: { left: "10px", top: "125px", flexDirection: "row" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", top: "125px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row", top: "125px" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row", top: "125px" },
  },
  //buy section third/last row container
  buyItemSectionRowsBottom: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "30px",
    position: "absolute",
    top: "370px",
    [theme.breakpoints.up("xs")]: { right: "160px", top: "360px", flexDirection: "column" },
    [theme.breakpoints.up("sm")]: { left: "10px", top: "280px", flexDirection: "row" },
    [theme.breakpoints.up("md")]: { flexDirection: "row", top: "280px" },
    [theme.breakpoints.up("lg")]: { flexDirection: "row", top: "280px" },
    [theme.breakpoints.up("xl")]: { flexDirection: "row", top: "280px" },
  },

  //Sell section border line
  sellSectionLineDevider: {
    marginLeft: "30px",
    width: "750px",
    position: "absolute",
    top: "170px",
    opacity: 0.1,
    [theme.breakpoints.up("xs")]: { width: "320px" },
    [theme.breakpoints.up("sm")]: { width: "550px" },
    [theme.breakpoints.up("md")]: { top: "130px", width: "750px" },
    [theme.breakpoints.up("lg")]: { width: "750px" },
    [theme.breakpoints.up("xl")]: { width: "750px" },
  },
  //buy section border line
  buySectionLineDevider: {
    marginLeft: "30px",
    width: "750px",
    position: "absolute",
    top: "230px",
    opacity: 0.1,
    [theme.breakpoints.up("xs")]: { width: "320px", top: "290px" },
    [theme.breakpoints.up("sm")]: { width: "550px", top: "230px" },
    [theme.breakpoints.up("md")]: { width: "750px", top: "230px" },
    [theme.breakpoints.up("lg")]: { width: "750px", top: "230px" },
    [theme.breakpoints.up("xl")]: { width: "750px", top: "230px" },
  },
}));

export default function TokenDetails(props) {
  const [price, setPrices] = useState([]);
  const { REACT_APP_COINGECKO_PRICE } = process.env; //api for getting price information
  useEffect(() => {
    //fetch price informations
    axios
      .get(REACT_APP_COINGECKO_PRICE)
      .then(response => {
        setPrices(response.data);
      })
      .then(
        response => {},
        err => {
          console.log(err);
        },
      )
      .catch(err => {
        return false;
      });
  }, []);

  const pricesdata = price.prices?.map(function (value, key) {
    return { price: value[1] };
  });

  const xAxisLabel = Array.from({ length: 30 }, (_, i) => i + 1); //sets XAXIS label from 1-30

  const dispatch = useDispatch();
  const setError = useError();
  const history = useHistory();
  const { provider, chainID, connected } = useWeb3Context();
  // const sentData = (props.location && props.location.state) || {};
  const [data, setData] = useState({});
  const [ownToken, setOwnToken] = useState(false);
  let { itemId } = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [previewItem, setPreviewItem] = useState(false);
  const [isTokenBought, setIsTokenBought] = useState(false);
  const [checked, setChecked] = useState(true);
  const address = useAddress();

  const { formattedPrice } = usePrice(data?.price, data?.paymentToken, provider);

  const pendingTransactions = useSelector(state => {
    return state?.pendingTransactions;
  });

  const nftDetails = useSelector(state => {
    return state?.nft.nftDetails;
  });

  const profileInfo = useSelector(state => {
    return state?.account && state.account.profileInfo;
  });

  const allowance = useSelector(state => {
    return state?.account && state?.account.purchaseMarketItem;
  });

  const balances = useSelector(state => {
    return state?.account && state?.account.balances;
  });

  const getNFT = async () => {
    await dispatch(getMarketItem({ provider, itemId }));
  };

  const onClickApprove = async ({ approveMax, nft }) => {
    const token = tokenConfig[process?.env?.REACT_APP_NETWORK][nft?.paymentToken.toLowerCase()]?.symbol.toLowerCase();
    const tokenBalance = balances[token];
    if (tokenBalance.lt(nft.price)) {
      return setError({ message: `Insufficient balance of ${token.toUpperCase()}` });
    }
    await dispatch(
      changeApproval({ address, nftPrice: nft.price, token, provider, networkID: chainID, approveMax, setError }),
    );
    await hasAllowance(nft?.paymentTokenSymbol);
  };

  useEffect(() => {
    if (!connected) return;
    if (provider && profileInfo.wallet) {
      console.log("Getting data from the contract...");
      getNFT();
    }
  }, [profileInfo.wallet, connected, itemId]);

  useEffect(() => {
    console.log("nftDetails", nftDetails);
    /** New data will be set after updating the state after the Claim: **/
    if (nftDetails.nft?.itemId) {
      setData(nftDetails.nft);
    }
  }, [nftDetails.nft]);

  const hasAllowance = useCallback(
    token => {
      if (data && data.price) {
        const { guruAllowance, usdcAllowance } = allowance;
        const alreadyApproved = alreadyApprovedToken(token, guruAllowance, usdcAllowance, data.price);
        if (alreadyApproved) {
          console.log("Allowance already approved");
          return alreadyApproved;
        } else {
          return 0;
        }
      }
    },
    [formattedPrice, data, allowance],
  );

  const isAllowanceDataLoading = allowance == null;

  const handleImageClick = () => {
    setOpenImage(true);
  };

  const handleOpen = () => {
    setOpen(true);
    getNFT();
  };

  const onClickPurchase = async ({ nft }) => {
    console.log("Purchase values: ", nft);
    await dispatch(buyNft({ itemId: nft.itemId, provider, history, setError, setIsTokenBought }));
    setPreviewItem(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const clearPrevNftDetails = async () => {
      await dispatch(clearNftDetails());
    };

    return () => {
      clearPrevNftDetails();
    };
  }, []);

  useEffect(() => {
    data?.owner === profileInfo?.wallet ? setOwnToken(true) : setOwnToken(false);
  }, [profileInfo, data]);

  const isPendingTxnPurchased = isPendingTxn(pendingTransactions, "buy_nft_" + data?.itemId);
  const { loading } = nftDetails;

  return (
    <div>
      <div className={`page ${classes.detailsPage}`}>
        <Card className={classes.imgCard}>
          {!loading && data && data.image ? (
            <CardMedia
              alt="nft image"
              style={{ cursor: "zoom-in" }}
              component="img"
              maxWidth="382px"
              height="382px"
              image={data?.image}
              onClick={handleImageClick}
            />
          ) : (
            <Skeleton animation="wave" variant="rect" height={320} />
          )}
        </Card>
        <div className={classes.info}>
          <div className={classes.shareInfo}>
            <div>
              <Typography variant="h6" style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: 10 }}>
                <Typography variant="h3">3,3+ NFT</Typography>
                <div className={classes.iconBackground}>
                  <SignalCellularAltOutlined style={{ height: "25px", color: "#2E5CFF" }} />
                </div>
              </Typography>
              <Typography>By {data?.creatorName}</Typography>
            </div>

            <div className={classes.shareInfoLeft}>
              <DetailsActionsSocial />{" "}
            </div>
          </div>
          <div className={classes.claim}>
            <div className={classes.claimSection}>
              {ownToken ? (
                <Grid container className={classes.claimValues}>
                  <div className={classes.claimItemsRight}>
                    <div className="claimable_rewards_text">
                      {" "}
                      <div>
                        {" "}
                        <SvgIcon viewBox="0 0 20 18" color="primary" component={Star} style={{ marginTop: "3px" }} />
                      </div>
                      <div>Claimable rewards</div>
                    </div>
                    <div className={classes.claimableDescription}>
                      Claimable rewards can be claimed without affecting your multiplier
                    </div>
                  </div>
                  <div className={classes.claimItems}>
                    {!loading && data ? (
                      <GuruValues
                        className={classes.claimValuesButton}
                        price={data?.burnNFTValue}
                        paymentToken={config.network.guru.toLowerCase()}
                        size="l"
                      />
                    ) : (
                      <Skeleton width="98%" height="52px" animation="wave" />
                    )}
                    <div className="claim_divider">+</div>
                    {!loading && data ? (
                      <GuruValues
                        className={classes.claimValuesButtonLeft}
                        price={data?.redeemableValue}
                        paymentToken={config.network.guru.toLowerCase()}
                        size="l"
                      />
                    ) : (
                      <Skeleton width="100%" height="52px" animation="wave" />
                    )}
                  </div>
                </Grid>
              ) : (
                <Grid container className={classes.buySection}>
                  <div>
                    {!loading && data ? (
                      <div>
                        <div className={classes.sellItemSectionRowsTop}>
                          <div className={classes.selltemsLeft}>
                            <div className="claimable_rewards_text">
                              {" "}
                              <div>
                                {" "}
                                <SvgIcon
                                  viewBox="0 0 20 18"
                                  color="primary"
                                  component={LockIcon}
                                  style={{ marginTop: "3px" }}
                                />
                              </div>
                              <div>Locked TNGBL</div>
                            </div>
                            <div className={classes.sellSectionDescription}>
                              By claiming locked TNGBL early you reduce your overall multiplier
                            </div>
                          </div>
                          <div className={classes.lockedTangible}>
                            <div className={classes.sellSectionMiddleWrapper}>
                              <div className={classes.sellSectionMiddle}>
                                <h1>45</h1>
                              </div>
                              <h4 className={classes.multiplierText}>
                                Multiplier{" "}
                                <div style={{ marginTop: "1px", marginLeft: "2px" }}>
                                  <InfoRounded style={{ height: "20px" }} />
                                </div>
                              </h4>
                            </div>
                            <div className={classes.sellSectionMiddleWrapper}>
                              <div>
                                <GuruValues
                                  showUSDC
                                  className={classes.sellSectionRight}
                                  price={data?.price}
                                  paymentToken={data?.paymentToken}
                                  size="l"
                                />
                              </div>
                              <h4 style={{ marginTop: "3px", opacity: 0.4, marginLeft: "67px" }}>
                                Unlock on 20 Jan 2022
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className={classes.buyItemSectionRowsMiddle}>
                          <div className={classes.buytemsLeft}>
                            <div className="claimable_rewards_text">
                              {" "}
                              <div>
                                {" "}
                                <SvgIcon
                                  viewBox="0 0 20 18"
                                  color="primary"
                                  component={Star}
                                  style={{ height: "17px", marginRight: "4px" }}
                                />
                              </div>
                              <div>Available to claim early</div>
                            </div>
                          </div>

                          <div>
                            <GuruValues
                              className={classes.sellSectionRightMiddle}
                              price={data?.redeemableValue}
                              paymentToken={config.network.guru.toLowerCase()}
                              size="l"
                            />
                          </div>
                        </div>
                        <div className={classes.buyItemSectionRowsBottom}>
                          <div className={classes.selltemsLeft}>
                            <div className="claimable_rewards_text">
                              {" "}
                              <div>
                                {" "}
                                <SvgIcon
                                  viewBox="0 0 20 18"
                                  color="primary"
                                  component={USDIcon}
                                  style={{ height: "17px", marginRight: "4px" }}
                                />
                              </div>
                              <div style={{ display: "flex" }}>
                                Tangible Revenue Share{" "}
                                <div style={{ marginTop: "1px", marginLeft: "3px", opacity: "0.4" }}>
                                  <InfoRounded style={{ height: "17px" }} />
                                </div>
                              </div>
                            </div>
                            <div className={classes.sellSectionDescription}>
                              Percentage of Tangible revenue this NFT is able to claim
                            </div>
                          </div>

                          <div>
                            <GuruValues
                              className={classes.sellSectionRightMiddle}
                              price={data?.redeemableValue}
                              paymentToken={config.network.guru.toLowerCase()}
                              size="l"
                            />
                          </div>
                        </div>
                        <hr className={classes.buySectionLineDevider}></hr>
                      </div>
                    ) : (
                      <Skeleton width="98%" height="52px" animation="wave" />
                    )}
                  </div>
                </Grid>
              )}
              {data?.listed && !ownToken && (
                <Button
                  className={classes.buyNowButton}
                  disabled={isPendingTxnPurchased}
                  onClick={() => setPreviewItem(true)}
                  variant="contained"
                  type="submit"
                  size="medium"
                >
                  {isPendingTxnPurchased ? <LoadingIndicator /> : "Buy now"}
                </Button>
              )}
              {ownToken && (
                <Button
                  className={classes.claimButton}
                  disabled={isPendingTxnPurchased}
                  onClick={handleOpen}
                  variant="contained"
                  type="submit"
                  size="medium"
                >
                  {isPendingTxnPurchased ? <LoadingIndicator /> : "Claim"}
                </Button>
              )}
            </div>
          </div>
          {ownToken && (
            <div>
              {/* {!loading && data ? (
                //
              ) : (
                <Skeleton width="20%" height="52px" animation="wave" />
              )} */}
              <Grid container className={classes.sellSection}>
                <div>
                  {!loading && data ? (
                    <div>
                      <div className={classes.sellItemSectionRowsTop}>
                        <div className={classes.selltemsLeft}>
                          <div className="claimable_rewards_text">
                            {" "}
                            <div>
                              {" "}
                              <SvgIcon
                                viewBox="0 0 20 18"
                                color="primary"
                                component={LockIcon}
                                style={{ marginTop: "3px" }}
                              />
                            </div>
                            <div>Locked TNGBL</div>
                          </div>
                          <div className={classes.sellSectionDescription}>
                            By claiming locked TNGBL early you reduce your overall multiplier
                          </div>
                        </div>
                        <div className={classes.lockedTangible}>
                          <div className={classes.sellSectionMiddleWrapper}>
                            <div className={classes.sellSectionMiddle}>
                              <h1>45</h1>
                            </div>
                            <h4 className={classes.multiplierText}>
                              Multiplier{" "}
                              <div style={{ marginTop: "1px", marginLeft: "2px" }}>
                                <InfoRounded style={{ height: "20px" }} />
                              </div>
                            </h4>
                          </div>
                          <div className={classes.sellSectionMiddleWrapper}>
                            <div>
                              <GuruValues
                                className={classes.sellSectionRight}
                                price={data?.redeemableValue}
                                paymentToken={config.network.guru.toLowerCase()}
                                size="l"
                              />
                            </div>
                            <h4 style={{ marginTop: "3px", opacity: 0.4, marginLeft: "20px" }}>
                              <span></span> <span style={{ color: "#2E5CFF" }}>CLAIM EARLY</span>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className={classes.sellItemSectionRowsMiddle}>
                        <div className={classes.selltemsLeft}>
                          <div className="claimable_rewards_text">
                            {" "}
                            <div>
                              {" "}
                              <SvgIcon
                                viewBox="0 0 20 18"
                                color="primary"
                                component={USDIcon}
                                style={{ height: "17px", marginRight: "4px" }}
                              />
                            </div>
                            <div style={{ display: "flex" }}>
                              Tangible Revenue Share{" "}
                              <div style={{ marginTop: "1px", marginLeft: "3px", opacity: "0.4" }}>
                                <InfoRounded style={{ height: "17px" }} />
                              </div>
                            </div>
                          </div>
                          <div className={classes.sellSectionDescription}>
                            Percentage of Tangible revenue this NFT is able to claim
                          </div>
                        </div>

                        <div>
                          <GuruValues
                            className={classes.sellSectionRightMiddle}
                            price={data?.redeemableValue}
                            paymentToken={config.network.guru.toLowerCase()}
                            size="l"
                          />
                        </div>
                      </div>
                      <hr className={classes.sellSectionLineDevider}></hr>
                    </div>
                  ) : (
                    <Skeleton width="98%" height="52px" animation="wave" />
                  )}
                </div>
                <Button
                  disabled={isPendingTxnPurchased}
                  className={classes.sellButton}
                  onClick={() => history.push(`/items/${data.itemId}/sell`)}
                  variant="contained"
                  type="submit"
                  size="medium"
                >
                  Sell
                </Button>
              </Grid>
            </div>
          )}
        </div>
        {data && <Claim nft={data} open={open} onClose={handleClose} />}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openImage}
          onClose={() => setOpenImage(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 100,
          }}
        >
          <Fade in={openImage} mountOnEnter unmountOnExit>
            <Box className={classes.zoomInBox}>
              <img
                id="image"
                className="image-create-nft"
                src={data?.image}
                style={{ outline: "none", maxWidth: "90vw", maxHeight: "90vh", borderRadius: "4px" }}
                alt="image details"
              />
            </Box>
          </Fade>
        </Modal>
        {address && !isAllowanceDataLoading && data && (
          <PreviewItem
            open={isTokenBought ? isTokenBought : previewItem}
            onClose={() => {
              setPreviewItem(false);
              setIsTokenBought(false);
              getNFT();
            }}
            isApprovedToken={hasAllowance(data?.paymentTokenSymbol)}
            imageUrl={data?.image}
            nft={data}
            tokenStatus={isTokenBought && "bought"}
            checked={checked}
            onChange={() => setChecked(!checked)}
            onClick={() => {
              hasAllowance(data?.paymentTokenSymbol)
                ? onClickPurchase({ nft: data })
                : onClickApprove({ approveMax: checked, nft: data });
            }}
          />
        )}
      </div>
      {data?.listed && !ownToken && (
        <div style={{ marginTop: "300px", marginLeft: "50px", width: "90%" }}>
          <MoreItemsCreator address={data?.creator} itemId={data?.itemId} creatorName={data?.creatorName} />
        </div>
      )}
    </div>
  );
}
