import "./App.css";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// state
import { loadAccountDetails } from "src/slices/AccountSlice";

// pages
import {
  Home,
  CreateNft,
  MyNft,
  TokenDetails,
  NoMatch,
  Explore,
  Profile,
  EditProfile,
  PublicProfile,
  SellNft,
  NewCreateNft,
  TokenSwap,
} from "src/pages";

// context
import { useAddress, useWeb3Context } from "src/hooks/web3Context";

// components
import { Header, Footer, ScrollToTop } from "src/components";

const header = "72px",
  footer = "234px";

function App() {
  const dispatch = useDispatch();
  const { connect, hasCachedProvider, provider, chainID, connected, uri } = useWeb3Context();
  const address = useAddress();
  async function loadDetails(whichDetails) {
    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(provider);
    }
  }

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect();
    }
  }, []);

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    },
    [connected],
  );

  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected) {
      loadDetails("account");
    }
  }, [connected]);
  // const { connect, hasCachedProvider } = useWeb3Context();
  // const [walletChecked, setWalletChecked] = useState(false);
  // const location = useLocation();
  // const isHome = location.pathname.toString() === "/";

  // useEffect(() => {
  //   // connect()
  //   if (hasCachedProvider()) {
  //     // then user DOES have a wallet
  //     connect().then(() => {
  //       setWalletChecked(true);
  //     });
  //   } else {
  //     // then user DOES NOT have a wallet
  //     setWalletChecked(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   // don't load ANY details until wallet is Checked
  //   if (walletChecked) {
  //     console.log("Wallet Checked");
  //   }
  // }, [walletChecked]);

  return (
    <Router>
      <Header />
      <div style={{ minHeight: `calc(100vh - ${header} - ${footer})` }}>
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/edit-profile" component={EditProfile} />
          <Route exact path="/explore" component={Explore} />
          {/* FIXME: remove old path later */}
          {/*<Route exact path="/create-item" component={CreateNft} />*/}
          <Route exact path="/create-item" component={NewCreateNft} />
          <Route exact path="/items" component={MyNft} />
          <Route exact path="/items/:itemId" component={TokenDetails} />
          <Route exact path="/profile/:userAddress" component={PublicProfile} />
          <Route exact path="/items/:itemId/sell" component={SellNft} />
          <Route path="/token-swap" component={TokenSwap} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
