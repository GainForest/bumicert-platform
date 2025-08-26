import { CeloIcon } from "@/icons/CeloIcon";
import { SVGProps } from "react";
import { celo, type Chain } from "viem/chains";

export type ExtendedChain = Chain & {
  logo: React.ComponentType<SVGProps<SVGSVGElement>>;
};

export const CeloChain: ExtendedChain = {
  ...celo,
  logo: CeloIcon,
};
