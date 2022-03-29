// MUI
import { Box, IconButton, Tooltip } from "@material-ui/core";

// icons
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { colors } from "../themes/dark";
import React, { useMemo } from "react";

interface PassiveIncomePercentProps {
  payoutPercentage: number;
  size?: string;
}

const PassiveIncomePercent = ({ payoutPercentage, size = "m" }: PassiveIncomePercentProps) => {
  const minusPayoutPercentage = useMemo(() => 100 - payoutPercentage, [payoutPercentage]);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      flexDirection="column"
      width="6.5rem"
      justifyContent="center"
      position="relative"
    >
      <Box width="100%" display="flex" maxWidth={size === "l" ? 135 : 80} marginTop={1}>
        <Box bgcolor="white" height="3px" borderRadius={2} width={`${payoutPercentage}%`} marginRight="2px" />
        <Box bgcolor={colors.gold[500]} height="3px" borderRadius={2} width={`${minusPayoutPercentage}%`} />
      </Box>
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        maxWidth={size === "l" ? 135 : 80}
        fontSize={size === "l" ? 16 : 10}
        marginTop="2px"
      >
        <Box color="white">{payoutPercentage}%</Box>
        <Box color={colors.gold[500]}>{minusPayoutPercentage}%</Box>
      </Box>
      {Boolean(size !== "l") && (
        <Tooltip
          placement="top"
          interactive
          title={
            <>
              These percentages indicate the proportions of the sale that are allocated towards the creator and towards
              <a href="#" style={{ color: colors.gold[500], textDecoration: "none" }}>
                {" "}
                passive income{" "}
              </a>
              . These percentages could affect future resale value.
            </>
          }
        >
          <IconButton style={{ position: "absolute", right: "-5px" }}>
            <InfoOutlinedIcon color="primary" style={{ width: "15px" }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default PassiveIncomePercent;
