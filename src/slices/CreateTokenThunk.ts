import { ethers } from "ethers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { marketAddress, nftAddress } from "../constants";

// slices
import { IBaseAsyncThunk } from "./AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

// contracts
import Market from "../abi/NidhiMarket.json";
import NFT from "../abi/NidhiNFT.json";

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly values: any;
  readonly setError: any;
  readonly client: any;
  readonly setNftPreviewValues: any;
  readonly setIsTokenCreated: any;
  readonly setTokenApproved: any;
}

export const tokenCreating = createAsyncThunk(
  "nft/tokenCreating",
  async (
    {
      values,
      provider,
      networkID,
      setError,
      client,
      setNftPreviewValues,
      setIsTokenCreated,
      setTokenApproved,
    }: IChangeApprovalAsyncThunk,
    { dispatch },
  ) => {
    const { name, description, image } = values;
    let tx;
    try {
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      /** Create the item **/
      const NftContract = new ethers.Contract(nftAddress, NFT.abi, signer);

      tx = await NftContract.createToken(name, description, image);
      let tokenCreated;
      let tokenId;
      let creator;
      if (tx) {
        dispatch(fetchPendingTxns({ txnHash: tx.hash, type: "approve" }));
        tokenCreated = await tx.wait();
        tokenId = tokenCreated.events[0].args[2].toNumber();
        creator = tokenCreated.events[2].args[1];
        dispatch(clearPendingTxn(tx.hash));
      }

      await client.pin.add(image);

      const isApproved = await NftContract.isApprovedForAll(signerAddress, marketAddress);
      setTokenApproved(isApproved);
      setIsTokenCreated(true);
      setNftPreviewValues({ ...values, tokenId, creator });
    } catch (e) {
      console.error(e);
      // @ts-ignore
      setError({ message: e.message });
      if (tx) {
        return dispatch(clearPendingTxn(tx.hash));
      }
    }
    return dispatch(clearPendingTxn(tx.hash));
  },
);

export interface ITokenApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly isApproved: boolean;
  readonly setError: any;
  readonly client: any;
  readonly setTokenApproved: any;
}

export const approveCreating = createAsyncThunk(
  "nft/approveCreating",
  async ({ isApproved, provider, setError, setTokenApproved }: ITokenApprovalAsyncThunk, { dispatch }) => {
    let approveAllTx;
    try {
      const signer = provider.getSigner();
      const NftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
      if (!isApproved) {
        approveAllTx = await NftContract.setApprovalForAll(marketAddress, true);
        dispatch(fetchPendingTxns({ txnHash: approveAllTx.hash, type: "approve" }));
        await approveAllTx.wait();
        setTokenApproved(true);
      }
    } catch ({ message }) {
      setError({ message });
    }
    return dispatch(clearPendingTxn(approveAllTx.hash));
  },
);

export interface ITokenListingAsyncThunk extends IChangeApprovalAsyncThunk {
  readonly values: any;
  readonly setError: any;
  readonly client: any;
  readonly setNftPreviewValues: any;
  readonly setTokenListed: any;
}

export const tokenListing = createAsyncThunk(
  "nft/tokenListing",
  async (
    { values, provider, networkID, setError, client, setNftPreviewValues, setTokenListed }: ITokenListingAsyncThunk,
    { dispatch },
  ) => {
    const { price, paymentToken, payoutPercentage, tokenId } = values;
    let formattedIncomePercentage;
    try {
      formattedIncomePercentage = Math.round(parseFloat(payoutPercentage) * 100);
    } catch (e) {
      console.error(e);
    }

    let tx;
    let previewValues;
    try {
      const signer = provider.getSigner();
      /** Then list the item for sale on the marketplace **/
      const MarketContract = new ethers.Contract(marketAddress, Market.abi, signer);
      tx = await MarketContract.listMarketItem(nftAddress, tokenId, paymentToken, price, formattedIncomePercentage);
      console.log("listMarketItem tx: ", tx);
      if (tx) {
        dispatch(fetchPendingTxns({ txnHash: tx.hash, type: "approve" }));
        previewValues = await tx.wait();
        console.log("previewValues", previewValues);
      }
      setTokenListed(true);
      setNftPreviewValues({ ...values, tokenId });
    } catch (e) {
      console.error(e);
      // @ts-ignore
      setError({ message: e.message });
    }
    return dispatch(clearPendingTxn(tx.hash));
  },
);
