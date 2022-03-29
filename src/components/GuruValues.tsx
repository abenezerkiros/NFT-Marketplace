import { BigNumberish } from "ethers";

// MUI
import { SvgIcon, Typography } from "@material-ui/core";

// constants
import { tokenConfig, publicRpcUrl } from "src/constants";

// hooks
import { usePrice } from "src/hooks/usePrice";
import { useWeb3Context } from "src/hooks/web3Context";

interface Props {
  text: string;
  price: BigNumberish;
  size?: string;
  className?: string;
  paymentToken: string;
  showUSDC?: boolean;
  doFormat?: boolean;
}

const GuruValues = ({ text, price, size, className, paymentToken, showUSDC = false, doFormat = true }: Props) => {
  const { provider } = useWeb3Context();
  let formatted;
  if (doFormat) {
    const { formattedPrice } = usePrice(price, paymentToken, provider);
    formatted = formattedPrice;
  }

  return (
    <div className={className}>
      <Typography variant={size === "l" ? "h6" : "body2"} component="p">
        {text}
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        {paymentToken && (
          <SvgIcon
            // @ts-ignore
            component={tokenConfig[process?.env?.REACT_APP_NETWORK][paymentToken.toLowerCase()]?.icon}
            viewBox="0 0 18 16"
            width={size === "l" ? "26" : "16"}
            height={size === "l" ? "24" : "14"}
            style={{ marginRight: "10px" }}
          />
        )}
        <Typography variant={size === "l" ? "h4" : "h6"} style={{ fontWeight: 700 }}>
          {doFormat ? formatted?.price : price}
          {doFormat && showUSDC && formatted?.priceUSD && (
            <small style={{ fontSize: 14, marginLeft: 6, fontWeight: 400 }}>({formatted?.priceUSD} USDC)</small>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default GuruValues;
