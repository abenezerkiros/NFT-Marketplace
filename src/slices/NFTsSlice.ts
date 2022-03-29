import { createAsyncThunk, createSelector, createSlice, current } from "@reduxjs/toolkit";
import { ethers } from "ethers";

// abi
import NFT from "../abi/NidhiNFT.json";
import Market from "../abi/NidhiMarket.json";

// state
import { setAll } from "../helpers";
import { RootState } from "../store";

// constants
import { marketAddress, nftAddress, tokenConfig } from "src/constants";

// types
import { IBaseAddressAsyncThunk } from "./AccountSlice";
import { IBaseNft } from "./MarketplaceSlice";

export interface IBaseNftAsyncThunk extends IBaseAddressAsyncThunk {
  readonly userRole: "creator" | "owner";
  readonly lastItemId: number;
  readonly pageSize: number;
}

export interface INftDetailsAsyncThunk extends IBaseAddressAsyncThunk {
  readonly itemId: string;
}

export const getMarketItem = createAsyncThunk(
  "nft/getMarketItem",
  async ({ provider, itemId }: INftDetailsAsyncThunk) => {
    try {
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);

      const meta = await nftContract.metadata(itemId);
      const regex = /^http[s]?:\/\//g;

      let img;
      /** Keep image as-is if it's a URL, otherwise make it a IPFS URL. **/
      if (regex.test(meta.image)) {
        img = meta.image;
      } else {
        //img = `https://ipfs.infura.io:5001/api/v0/cat?arg=${meta.image}`;
        img = `https://infura-ipfs.io/ipfs/${meta.image}`;
      }

      const item = await marketContract.getMarketItem(itemId);

      const paymentTokenSymbol =
        // @ts-ignore
        tokenConfig[process.env.REACT_APP_NETWORK][item.paymentToken.toLowerCase()]?.symbol.toLowerCase() || "guru";

      return {
        creatorDeeplink: item.creatorDeeplink,
        ownerDeeplink: item.ownerDeeplink,
        sellerDeeplink: item.sellerDeeplink,
        creator: item.creator,
        creatorName: item.creatorName,
        itemId: item.itemId,
        tokenId: item.tokenId,
        image: img,
        description: meta?.description,
        external_url: meta?.externalURL,
        name: meta?.name,
        price: item.price,
        burnNFTValue: item.totalValue,
        seller: item.seller,
        sellerName: item.sellerName,
        owner: item.owner,
        ownerName: item.ownerName,
        payoutPercentage: `${item.payoutPercentage.toNumber() / 100}`,
        paymentToken: item.paymentToken,
        nftContract: item.nftContract,
        listed: item.listed,
        redeemableValue: item.redeemableValue,
        totalValue: item.totalValue,
        paymentTokenSymbol,
      };
    } catch (e) {
      console.error("Error with getting NFT: ", e);
    }
  },
);

// export interface IBaseLoadMyNft extends IBaseNft {
//   readonly burnNFTValue: BigNumber;
// }

export const loadNfts = createAsyncThunk(
  "nft/loadNfts",
  async ({ provider, address, userRole, lastItemId, pageSize = 10 }: IBaseNftAsyncThunk) => {
    let signer;
    try {
      signer = provider.getSigner();
    } catch (e) {
      console.error("CouldNot get a signer");
    }

    const marketContract = new ethers.Contract(marketAddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);

    try {
      let data;
      if (userRole === "creator") {
        data = await marketContract.fetchItemsByCreator(address, lastItemId, pageSize, false);
      }
      if (userRole === "owner") {
        data = await marketContract.fetchItemsByOwner(address, lastItemId, pageSize, false);
      }

      const nft = await Promise.all(
        data.map(async (i: any) => {
          // const price = ethers.utils.formatUnits(i.price.toString(), "gwei");
          // marketplace only supports Nidhi NFTs, we can rely on .metadata() being available
          const meta = await tokenContract.metadata(i.tokenId.toNumber());
          const regex = /^http[s]?:\/\//g;
          let img;
          /** Keep image as-is if it's a URL, otherwise make it a IPFS URL. **/
          if (regex.test(meta.image)) {
            img = meta.image;
          } else {
            //img = `https://ipfs.infura.io:5001/api/v0/cat?arg=${meta.image}`;
            img = `https://infura-ipfs.io/ipfs/${meta.image}`;
          }

          const paymentTokenSymbol =
            // @ts-ignore
            tokenConfig[process.env.REACT_APP_NETWORK][i.paymentToken.toLowerCase()]?.symbol.toLowerCase() || "guru";

          return {
            creatorDeeplink: i.creatorDeeplink,
            ownerDeeplink: i.ownerDeeplink,
            sellerDeeplink: i.sellerDeeplink,
            creator: i.creator,
            creatorName: i.creatorName,
            itemId: i.itemId,
            tokenId: i.tokenId,
            image: img,
            description: meta?.description,
            external_url: meta?.externalURL,
            name: meta?.name,
            price: i.price,
            seller: i.seller,
            sellerName: i.sellerName,
            owner: i.owner,
            ownerName: i.ownerName,
            payoutPercentage: `${i.payoutPercentage.toNumber() / 100}`,
            paymentToken: i.paymentToken,
            nftContract: i.nftContract,
            listed: i.listed,
            totalValue: i.totalValue,
            paymentTokenSymbol,
            redeemableValue: i.redeemableValue,
            burnNFTValue: i.totalValue,
          };
        }),
      );
      return {
        nft,
        isInitial: !lastItemId,
        // @ts-ignore
        lastItemId: nft.length && nft.slice(-1)[0] ? nft.slice(-1)[0].itemId : null,
      };
    } catch (e) {
      console.error("Error with getting NFTs: ", e);
    }
  },
);

interface INftsSlice {
  myNft: {
    loading: boolean;
    lastItemId: number;
    nft: IBaseNft[];
  };
  nftDetails: {
    loading: boolean;
    nft: IBaseNft;
  };
}
const initialState: INftsSlice = {
  myNft: {
    loading: false,
    lastItemId: 0,
    nft: [],
  },
  nftDetails: {
    loading: false,
    nft: {} as IBaseNft,
  },
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    fetchAllNft(state, action) {
      setAll(state, action.payload);
    },
    clearNftDetails(state) {
      state.nftDetails.nft = initialState.nftDetails.nft;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMarketItem.pending, state => {
        state.nftDetails.loading = true;
      })
      .addCase(getMarketItem.fulfilled, (state, action) => {
        console.log("getMarketItem action", action.payload);
        state.nftDetails.nft = action.payload as IBaseNft;
        setAll(state, action.payload);
        state.nftDetails.loading = false;
      })
      .addCase(getMarketItem.rejected, (state, { error }) => {
        console.log("getMarketItem error", error);
        state.nftDetails.loading = false;
      })

      .addCase(loadNfts.pending, state => {
        state.myNft.loading = true;
      })
      .addCase(loadNfts.fulfilled, (state, action) => {
        // @ts-ignore
        state.myNft.lastItemId = action.payload?.lastItemId;
        if (action.payload) {
          if (action.payload?.isInitial) {
            // @ts-ignore
            state.myNft.nft = action.payload.nft;
          } else {
            // @ts-ignore
            state.myNft.nft = [...current(state.myNft.nft), ...action.payload?.nft];
          }
        }
        setAll(state, action.payload);
        state.myNft.loading = false;
      })
      .addCase(loadNfts.rejected, (state, { error }) => {
        state.myNft.loading = false;
      });
  },
});

export default nftSlice.reducer;

export const { fetchAllNft, clearNftDetails } = nftSlice.actions;

const baseInfo = (state: RootState) => state.nft;

export const getNftState = createSelector(baseInfo, nft => nft);
