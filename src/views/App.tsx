import Layout from "./Home";
import { getDefaultWaasConnectors, KitProvider } from "@0xsequence/kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { chains } from "~/helpers";
import { KitCheckoutProvider } from "@0xsequence/kit-checkout";
import "react-toastify/dist/ReactToastify.css";

import { Toaster } from "sonner";

import { Chain, Transport } from "viem";
import { allNetworks, findNetworkConfig } from "@0xsequence/network";
import { defaultChainId } from "../config/sales/salesConfigs";
import "@0xsequence/design-system/styles.css";
import "boilerplate-design-system/styles.css";

const queryClient = new QueryClient();

function getTransportConfigs(
  chains: [Chain, ...Chain[]],
): Record<number, Transport> {
  return chains.reduce(
    (acc, chain) => {
      const network = findNetworkConfig(allNetworks, chain.id);
      if (network) acc[chain.id] = http(network.rpcUrl);
      return acc;
    },
    {} as Record<number, Transport>,
  );
}

const App = () => {
  const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
  const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
  const appleRedirectURI = window.location.origin + window.location.pathname;
  const walletConnectId = import.meta.env.VITE_WALLET_CONNECT_ID;

  const connectors = getDefaultWaasConnectors({
    walletConnectProjectId: walletConnectId,
    waasConfigKey,
    googleClientId,
    // Notice: Apple Login only works if deployed on https (to support Apple redirects)
    appleClientId,
    appleRedirectURI,
    defaultChainId,
    appName: "Kit Starter",
    projectAccessKey,
  });

  const transports = getTransportConfigs(chains);

  const config = createConfig({
    transports,
    connectors,
    chains,
  });

  const kitConfig = {
    projectAccessKey,
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <KitProvider config={kitConfig}>
          <KitCheckoutProvider>
            <Toaster />
            <Layout />
          </KitCheckoutProvider>
        </KitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;