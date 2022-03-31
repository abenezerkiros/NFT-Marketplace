import { BigNumber, ethers, BigNumberish } from "ethers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { marketAddress, tokenAddress } from "../constants";

// slices
import { fetchAccountSuccess, IBaseAsyncThunk } from "./AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

// types
import { LocationState, History } from "history";

// config
import { config } from "src/config";

// contracts
import IERC20 from "../abi/IERC20.json";
import Market from "../abi/NidhiMarket.json";
import { IBaseNft } from "./MarketplaceSlice";

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly nftPrice: string | BigNumber;
  readonly address: string;
  readonly approveMax: boolean;
  readonly setError: any;
}

export function alreadyApprovedToken(
  token: string,
  guruAllowance: BigNumber,
  usdcAllowance: BigNumber,
  nftPrice: BigNumberish,
) {
  console.log("Compering token allowance with nftPrice...");
  try {
    if (token === "guru") {
      const r = guruAllowance.gte(nftPrice);
      console.log("Token GURU: guruAllowance >= nftPrice", r);
      return r;
    } else if (token === "usdc") {
      const r = usdcAllowance.gte(nftPrice);
      console.log("Token USDC: usdcAllowance >= nftPrice", r);
      return r;
    }
    console.log("Wrong token, will be return the result false...");
    return 0;
  } catch (e) {
    // @ts-ignore
    console.log("Error in 'alreadyApprovedToken'", e.message);
  }
  return false;
}

export const changeApproval = createAsyncThunk(
  "nft/changeApproval",
  async (
    { token, address, nftPrice, provider, networkID, approveMax = false, setError }: IChangeApprovalAsyncThunk,
    { dispatch },
  ) => {
    let price;
    if (typeof nftPrice === "string") {
      if (token === "guru") {
        price = ethers.utils.parseUnits(nftPrice, "gwei");
      } else if (token === "usdc") {
        price = ethers.utils.parseUnits(nftPrice, "mwei");
      }
    } else {
      price = nftPrice;
    }

    console.log("Approving is running...");
    const guruAddress = config.network.guru.toLowerCase();
    const usdcAddress = config.network.usdc.toLowerCase();
    console.log("guruAddress", guruAddress);
    const signer = provider.getSigner();

    const guruContract = new ethers.Contract(guruAddress, IERC20.abi, signer);
    const usdcContract = new ethers.Contract(usdcAddress, IERC20.abi, signer);

    let approveTx;
    let guruAllowance = await guruContract.allowance(address, marketAddress);
    let usdcAllowance = await usdcContract.allowance(address, marketAddress);

    console.log("Is user choose approve for all txs ?", approveMax);
    console.log("price", price);
    console.log(`Current price in ${token === "guru" ? "gwei" : "mwei"}:`, price?.toNumber(), token);
    // @ts-ignore
    const alreadyApproved = alreadyApprovedToken(token, guruAllowance, usdcAllowance, price);
    console.log(`Is the ${token} token alreadyApproved ?`, alreadyApproved);
    // return early if approval has already happened
    if (alreadyApproved) {
      console.log("Approval has already happened...");
      return dispatch(
        fetchAccountSuccess({
          purchaseMarketItem: {
            guruAllowance,
            usdcAllowance,
          },
        }),
      );
    }
    try {
      if (approveMax) {
        if (token === "guru") {
          approveTx = await guruContract.approve(marketAddress, ethers.constants.MaxUint256);
        } else if (token === "usdc") {
          approveTx = await usdcContract.approve(marketAddress, ethers.constants.MaxUint256);
        }
      } else {
        if (token === "guru") {
          approveTx = await guruContract.approve(marketAddress, price);
        } else if (token === "usdc") {
          approveTx = await usdcContract.approve(marketAddress, price);
        }
      }
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, type: "approve" }));

        await approveTx.wait();
      }
    } catch (e) {
      // @ts-ignore
      setError({ message: e.message });
      return;
    }

    guruAllowance = await guruContract.allowance(address, marketAddress);
    usdcAllowance = await usdcContract.allowance(address, marketAddress);

    if (approveTx) {
      dispatch(clearPendingTxn(approveTx.hash));
    }

    return dispatch(
      fetchAccountSuccess({
        purchaseMarketItem: {
          guruAllowance,
          usdcAllowance,
        },
      }),
    );
  },
);

export interface IBuyNftAsyncThunk {
  readonly itemId: BigNumber;
  readonly provider: any;
  readonly history: History<LocationState>;
  readonly setError: any;
  readonly setIsTokenBought: any;
}

export const buyNft = createAsyncThunk(
  "nft/buyNft",
  async ({ itemId, provider, history, setError, setIsTokenBought }: IBuyNftAsyncThunk, { dispatch }) => {
    let PurchaseTx;
    try {
      const signer = provider.getSigner();
      const addressSigner = await signer.getAddress();

      const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);

      PurchaseTx = await marketContract.purchaseMarketItem(itemId);
      dispatch(
        fetchPendingTxns({
          txnHash: PurchaseTx.hash,
          type: "buy_nft_" + itemId,
        }),
      );
      await PurchaseTx.wait();

      const guruContract = new ethers.Contract(tokenAddress, IERC20.abi, signer);
      let guruAllowance = await guruContract.allowance(addressSigner, marketAddress);

      setIsTokenBought(true);
      // history.push(`/items`);

      return dispatch(
        fetchAccountSuccess({
          purchaseMarketItem: {
            guruAllowance,
          },
        }),
      );
    } catch ({ message }) {
      setError({ message });
    } finally {
      if (PurchaseTx) {
        dispatch(clearPendingTxn(PurchaseTx.hash));
      }
    }
  },
);
