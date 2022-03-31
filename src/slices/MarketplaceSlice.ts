import { createAsyncThunk, createSelector, createSlice, current } from "@reduxjs/toolkit";
import { BigNumber, BigNumberish, ethers } from "ethers";

// constants
import { marketAddress, nftAddress, tokenConfig } from "../constants";

// state
import { IBaseAddressAsyncThunk } from "./AccountSlice";
import { RootState } from "../store";

// helpers
import { setAll } from "../helpers";

// ABI
import NFT from "../abi/NidhiNFT.json";
import Market from "../abi/NidhiMarket.json";

export interface IBaseMarketAsyncThunk extends IBaseAddressAsyncThunk {
  readonly lastItemId: number;
  readonly pageSize: number;
}

export interface IBaseNft {
  creatorDeeplink: string;
  ownerDeeplink: string;
  sellerDeeplink: string;
  itemId: BigNumber;
  image: string;
  description: string;
  external_url: string;
  name: string;
  price: BigNumberish;
  tokenId: number;
  seller: string;
  sellerName: string;
  owner: string;
  ownerName: string;
  creator: string;
  creatorName: string;
  payoutPercentage: string;
  paymentToken: string;
  nftContract: string;
  listed: boolean;
  burnNFTValue: BigNumberish;
  redeemableValue: BigNumberish;
  totalValue: string;
  paymentTokenSymbol: "guru" | "usdc";
}

export const loadMarketplace = createAsyncThunk(
  "marketplace/loadNfts",
  async ({ provider, lastItemId, pageSize = 12 }: IBaseMarketAsyncThunk) => {
    /* create a generic provider and query for unsold market items */
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketAddress, Market.abi, provider);
    const data = await marketContract.fetchMarketItems(lastItemId, pageSize, false);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    try {
      const nft = await Promise.all(
        data.map(async (i: any) => {
          // const tokenUri = await nftContract.tokenURI(i.tokenId);
          //const meta = await .get(tokenUri);
          // const price = ethers.utils.formatUnits(i.price.toString(), "gwei");
          // marketplace only supports Nidhi NFTs, we can rely on .metadata() being available
          const meta = await nftContract.metadata(i.tokenId.toNumber());
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
            itemId: i.itemId,
            image: img,
            description: meta.description || "",
            external_url: "",
            name: meta.name || "",
            price: i.price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            sellerName: i.sellerName,
            owner: i.owner,
            ownerName: i.ownerName,
            creator: i.creator,
            creatorName: i.creatorName,
            payoutPercentage: `${i.payoutPercentage.toNumber() / 100}`,
            paymentToken: i.paymentToken,
            nftContract: i.nftContract,
            listed: i.listed,
            redeemableValue: i.redeemableValue,
            totalValue: i.totalValue,
            burnNFTValue: i.totalValue,
            paymentTokenSymbol,
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
  market: {
    loading: boolean;
    lastItemId: number;
    nft: IBaseNft[];
  };
}

const initialState: INftsSlice = {
  market: {
    loading: false,
    lastItemId: 0,
    nft: [],
  },
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    fetchAllMarket(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMarketplace.pending, state => {
        state.market.loading = true;
      })
      .addCase(loadMarketplace.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        // @ts-ignore
        state.market.lastItemId = action.payload?.lastItemId;
        if (action.payload) {
          if (action.payload?.isInitial) {
            // @ts-ignore
            state.market.nft = action.payload.nft;
          } else {
            // @ts-ignore
            state.market.nft = [...current(state.market.nft), ...action.payload?.nft];
          }
        }
        setAll(state, action.payload);
        state.market.loading = false;
      })
      .addCase(loadMarketplace.rejected, (state, { error }) => {
        state.market.loading = false;
        console.log(error);
      });
  },
});

export default marketSlice.reducer;

export const { fetchAllMarket } = marketSlice.actions;

const baseInfo = (state: RootState) => state.market;

export const getMarketState = createSelector(baseInfo, market => market);
