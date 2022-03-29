import { ethers } from "ethers";
import { useEffect, useState } from "react";

// config
import { config } from "src/config";

// ABI
import routerABI from "../abi/UniswapV2Router02.json";

export const usePrice = (listPrice: ethers.BigNumberish | null, paymentToken: string, provider: any) => {
  const [formattedPrice, setFormattedPrice] = useState<{ price: string; priceUSD: string }>({
    price: "0",
    priceUSD: "0",
  });

  useEffect(() => {
    const getPrice = async () => {
      if (listPrice)
        try {
          const routerContract = new ethers.Contract(config.network.router, routerABI, provider);
          const tokenInfo = config.network.tokens[paymentToken.toLowerCase()];
          if (typeof tokenInfo === "undefined") {
            console.log(`Unconfigured token: ${paymentToken}`);
            return {};
          }
          const result = {
            price: parseFloat(ethers.utils.formatUnits(listPrice, tokenInfo.unit)).toFixed(2),
            priceUSD: "",
          };

          if (tokenInfo.usdSwapRoute) {
            const usd = config.network.tokens[tokenInfo.usdSwapRoute[0]];
            // TODO: this is breaking the app
            try {
              const amountsIn = await routerContract.getAmountsIn(listPrice, tokenInfo.usdSwapRoute);
              const priceUSD = amountsIn[0];
              result.priceUSD = parseFloat(ethers.utils.formatUnits(priceUSD, usd.unit)).toFixed(2);
            } catch (err) {
              console.log("err", err);
              result.priceUSD = "";
            }
          }

          // @ts-ignore
          setFormattedPrice(result);
        } catch (err) {
          console.log("something went wrong", err);
        }
    };
    if (listPrice?.toString() && paymentToken) {
      getPrice();
    }
  }, [listPrice, paymentToken]);

  return { formattedPrice };
};
