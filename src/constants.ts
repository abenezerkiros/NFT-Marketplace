// config
import { config } from "src/config";

// icons
import { ReactComponent as GuruIcon } from "src/styles/images/guru.svg";
import { ReactComponent as UsdcIcon } from "src/styles/images/usdc.svg";

export const tokenAddress = config.network.guru; // GURU
export const stakingTokenAddress = config.network.sGuru; // sGURU
export const stakingContractAddress = config.network.staking; // Staking
export const marketAddress = config.network.market; // Nidhi Market deployed to
export const nftAddress = config.network.nft; // Nidhi NFT deployed to
export const profileAddress = config.network.profile; // Profile deployed to
export const routerAddress = config.network.router; // Sushiswap router
export const publicRpcUrl = config.network.publicRpcUrl;

export const tokenConfig = {
  mumbai: {
    "0x28701a232b566729381c53e47a3f53b08f50eb4c": {
      icon: GuruIcon,
      symbol: "GURU",
      unit: "gwei",
    },
    "0xa0fb0349526b7213b6be0f1d9a62f952a9179d96": {
      icon: UsdcIcon,
      symbol: "USDC",
      unit: "mwei",
    },
  },
  mainnet: {
    "0x057e0bd9b797f9eeeb8307b35dbc8c12e534c41e": {
      icon: GuruIcon,
      symbol: "GURU",
      unit: "gwei",
    },
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": {
      icon: UsdcIcon,
      symbol: "USDC",
      unit: "mwei",
    },
  },
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}
// not longer needed
export const addresses: IAddresses = {
  // Mumbai
  80001: {
    GURU: "0x28701a232B566729381C53E47a3f53b08F50eb4C", // guru 0x28701a232B566729381C53E47a3f53b08F50eb4C
    sGURU: "0x7F244A5DA32D3C1727e604Cb16554bFae89579A8", // sGuru 0x7F244A5DA32D3C1727e604Cb16554bFae89579A8
    USDC: "0xa0fb0349526b7213b6be0f1d9a62f952a9179d96", // usdc 0xa0fb0349526b7213b6be0f1d9a62f952a9179d96
  },
};
