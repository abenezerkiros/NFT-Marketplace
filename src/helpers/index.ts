import { BigNumber } from "ethers";
import { tokenConfig } from "../constants";
import { alreadyApprovedToken } from "../slices/PurchaseThunk";
import { IBaseNft } from "../slices/MarketplaceSlice";

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

export function setAll(state: any, properties: any) {
  if (!properties) return;
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
}

export function shortAddress(str: string | undefined) {
  if (!str) return;
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export async function checkAllowance(nft: IBaseNft, allowance: { guruAllowance: BigNumber; usdcAllowance: BigNumber }) {
  const { price, paymentToken } = nft;
  console.log({ paymentToken, price });
  const { guruAllowance, usdcAllowance } = allowance;
  const paymentTokenSymbol =
    // @ts-ignore
    tokenConfig[process?.env?.REACT_APP_NETWORK][paymentToken.toLowerCase()]?.symbol.toLowerCase();

  const alreadyApproved = alreadyApprovedToken(paymentTokenSymbol, guruAllowance, usdcAllowance, price);

  if (alreadyApproved) {
    console.log("Allowance already approved.");
    return true;
  } else {
    console.log("Not approved count of tokens.");
    return false;
  }
}
