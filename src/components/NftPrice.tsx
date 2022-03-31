import { ethers } from "ethers";

// MUI
import { SvgIcon, Typography } from "@material-ui/core";

// constants
import { tokenConfig, publicRpcUrl } from "src/constants";

// hooks
import { usePrice } from "src/hooks/usePrice";
import { useWeb3Context } from "src/hooks/web3Context";

// icons
import { ReactComponent as GuruIcon } from "src/styles/images/guru.svg";

interface PriceProps {
  explore?: boolean;
  price: any;
  paymentToken: string;
}

const NftPrice = ({ explore = false, price, paymentToken }: PriceProps) => {
  const width = explore ? "70%" : "100%";
  const { provider, connected } = useWeb3Context();
  // @ts-ignore
  const useProvider = connected ? provider : new ethers.providers.JsonRpcProvider(publicRpcUrl);
  const { formattedPrice } = usePrice(price, paymentToken, useProvider);

  return (
    <div style={{ width }}>
      <Typography variant="body2" component="p">
        Price
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SvgIcon
          // @ts-ignore
          component={tokenConfig[process?.env?.REACT_APP_NETWORK][paymentToken.toLowerCase()]?.icon || GuruIcon}
          viewBox="0 0 18 16"
          style={{ marginRight: "6px" }}
        />
        <Typography variant="h6" style={{ fontWeight: 700 }}>
          {formattedPrice?.price}
          {formattedPrice?.priceUSD && (
            <small style={{ fontSize: 10, marginLeft: 6, fontWeight: 400 }}>({formattedPrice?.priceUSD} USDC)</small>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default NftPrice;
