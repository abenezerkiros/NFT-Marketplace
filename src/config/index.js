const NETWORK = process.env.REACT_APP_NETWORK;

if (NETWORK === "mainnet") {
  console.log = function () {};
}

export const config = {
  network: require(`./${NETWORK}.json`),
  //   TODO map/refactor config
  //   nftContract: {
  //     address: ,
  //     abi: nft,
  //   },
  //   marketContract: {
  //     address: ,
  //     abi: market,
  //   },
};
