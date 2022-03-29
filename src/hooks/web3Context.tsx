import React, { useState, ReactElement, useContext, useMemo, useCallback } from "react";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { EnvHelper } from "../helpers/Environment";

// hooks
import { useError } from "src/hooks/useError";

function getURI() {
  return EnvHelper.URI;
}

function getLocalhostURI() {
  return EnvHelper.localhostURI;
}
/*
  Types
*/
type onChainProvider = {
  connect: () => void;
  disconnect: () => void;
  provider: JsonRpcProvider;
  address: string;
  connected: Boolean;
  web3Modal: Web3Modal;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const setError = useError();
  const [connected, setConnected] = useState(false);
  // NOTE (appleseed): if you are testing on rinkeby you need to set chainId === 4 as the default for non-connected wallet testing...
  // ... you also need to set getTestnetURI() as the default uri state below
  const [chainID, setChainID] = useState(80001);
  const [address, setAddress] = useState("");

  const [uri, setUri] = useState(getURI());

  const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));

  const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
    new Web3Modal({
      // network: "mainnet", // optional
      theme: {
        background: "#182328",
        main: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.2)",
        border: "#182328",
        hover: "rgb(16, 26, 32)",
      },
      cacheProvider: true, // optional
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1: getURI(),
              // 4: getTestnetURI(),
              80001: getURI(), // testnet
              137: getURI(),
              31337: getLocalhostURI(),
            },
          },
        },
      },
    }),
  );

  const hasCachedProvider = (): Boolean => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I changed these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  const _initListeners = useCallback(
    rawProvider => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts: string[]) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain: number) => {
        _checkNetwork(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    [provider],
  );

  const _checkNetwork = (otherChainID: number): Boolean => {
    const uri = getURI();
    if (chainID !== 80001 && otherChainID !== 137 && otherChainID !== 31337) {
      return false;
    }
    if (chainID !== otherChainID) {
      console.warn("You are switching networks");
      if (otherChainID === 80001 || otherChainID === 137 || otherChainID === 31337) {
        setChainID(otherChainID);
        // if (otherChainID === 1) setUri(getURI());
        // else if (otherChainID === 4) setUri(getTestnetURI());
        if (otherChainID === 80001) {
          // @ts-ignore
          setUri(uri);
        } else if (otherChainID === 137) {
          // @ts-ignore
          setUri(uri);
        } else setUri(getLocalhostURI());
        return true;
      }
      return false;
    }
    return true;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    let rawProvider = await web3Modal.connect();
    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    _initListeners(rawProvider);
    const connectedProvider = new Web3Provider(rawProvider, "any");
    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    let connectedAddress;
    try {
      const signer = await connectedProvider.getSigner();
      connectedAddress = await signer.getAddress();
      setAddress(connectedAddress);
    } catch (e) {
      console.error("Error in web3Context:", e);
    }
    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      setError({
        message: "Wrong network, please switch to Polygon",
      });
      console.error("Wrong network, please switch to Polygon");
      return;
    }
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setProvider(connectedProvider);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);
    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
  }, [provider, web3Modal, connected]);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, uri }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, uri],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
