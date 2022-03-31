import { BigNumber, ethers } from "ethers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "src/store";
import { setAll } from "../helpers";
import { marketAddress, profileAddress, tokenAddress } from "../constants";
import NidhiProfile from "../abi/NidhiProfile.json";
import IERC20 from "../abi/IERC20.json";

// config
import { config } from "src/config";

export enum NetworkID {
  Mumbai = 80001,
  Polygon = 137,
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk) => {
    let guruBalance = BigNumber.from(0);
    let usdcBalance = BigNumber.from(0);
    let guruAllowance = BigNumber.from(0);
    let usdcAllowance = BigNumber.from(0);

    const guruAddress = config.network.guru.toLowerCase();
    const usdcAddress = config.network.usdc.toLowerCase();

    const signer = provider.getSigner();
    const addressSigner = await signer.getAddress();
    const profileContract = new ethers.Contract(profileAddress, NidhiProfile.abi, signer);
    const profile = await profileContract.userProfiles(address);
    console.log("guruAddress", guruAddress, "usdcAddress", usdcAddress);
    const guruContract = new ethers.Contract(guruAddress, IERC20.abi, signer);
    const usdcContract = new ethers.Contract(usdcAddress, IERC20.abi, signer);
    try {
      guruBalance = await guruContract.balanceOf(address);
      usdcBalance = await usdcContract.balanceOf(address);
      guruAllowance = await guruContract.allowance(addressSigner, marketAddress);
      usdcAllowance = await usdcContract.allowance(addressSigner, marketAddress);
    } catch (e) {
      console.error(e);
    }

    return {
      profileInfo: {
        wallet: address,
        name: profile.name,
        imageURL: profile.imageURL,
        deeplink: profile.deeplink,
        description: profile.description,
        url: profile.url,
        discord: profile.discord,
        twitter: profile.twitter,
        instagram: profile.instagram,
        medium: profile.medium,
        telegram: profile.telegram,
      },
      purchaseMarketItem: {
        guruAllowance,
        usdcAllowance,
      },
      balances: {
        guru: guruBalance, // ethers.utils.formatUnits(guruBalance, "gwei"),
        usdc: usdcBalance, // ethers.utils.formatUnits(usdcBalance, "mwei"),
      },
    };
  },
);

interface IAccountSlice {
  profileInfo: {
    wallet: string;
    name: string;
    imageURL: string;
    deeplink: string;
    description: string;
    url: string;
    discord: string;
    twitter: string;
    instagram: string;
    medium: string;
    telegram: string;
  };
  purchaseMarketItem: {
    guruAllowance: number;
    usdcAllowance: number;
  };
  balances: {
    guru: string;
    usdc: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  profileInfo: {
    wallet: "",
    name: "",
    imageURL: "",
    deeplink: "",
    description: "",
    url: "",
    discord: "",
    twitter: "",
    instagram: "",
    medium: "",
    telegram: "",
  },
  purchaseMarketItem: {
    guruAllowance: 0,
    usdcAllowance: 0,
  },
  balances: {
    guru: "",
    usdc: "",
  },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        console.log("loadAccountDetails", action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
