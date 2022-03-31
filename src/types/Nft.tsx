import { BigNumber, BigNumberish } from "ethers";

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

export interface IListPreviewNft {
  name: string;
  creator: string;
  image: string;
  description: string;
  paymentTokenSymbol: "guru" | "usdc";
  price: BigNumberish | BigNumber,
  paymentToken: string,
  tokenId: number,
  payoutPercentage: string,
}
