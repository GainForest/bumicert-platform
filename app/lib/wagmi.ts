import { http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createConfig } from "wagmi";

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
}); 