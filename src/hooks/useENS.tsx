import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useENS = (address: string | null | undefined) => {
  const [ensName, setENSName] = useState<string | null>();

  useEffect(() => {
    async function resolveENS() {
      if (address && ethers.utils.isAddress(address)) {
        const provider = await ethers.providers.getDefaultProvider();
        const name = await provider.lookupAddress(address);
        if (name) setENSName(name);
      }
    }
    resolveENS();
  }, [address]);

  return { ensName };
};
