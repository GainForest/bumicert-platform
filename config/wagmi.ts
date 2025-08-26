import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";
import { CeloChain } from "@/config/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const DEV_CHAINS = [CeloChain] as const;
const PROD_CHAINS = [CeloChain] as const;
export const SUPPORTED_CHAINS =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
    ? PROD_CHAINS
    : DEV_CHAINS;

// Create wagmiConfig
export const config = createConfig({
  chains: [...SUPPORTED_CHAINS], // required
  // projectId, // required
  // metadata, // required
  // ssr: true,
  // storage: createStorage({
  //   storage: cookieStorage,
  // }),
  transports: {
    [CeloChain.id]: http("https://forno.celo.org"),
  },
});
