import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem';

// Define the Core Testnet chain
export const coreTestnet = defineChain({
  id: 1114,
  name: 'Core Testnet',
  nativeCurrency: {
    name: 'tCORE',
    symbol: 'tCORE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test2.btcs.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CoreScan',
      url: 'https://scan.test2.btcs.network/',
    },
  },
  testnet: true,
});

// Create the wagmi config with only Core Testnet as an available chain
export const wagmiConfig = createConfig({
  chains: [coreTestnet],
  transports: {
    [coreTestnet.id]: http(),
  },
  ssr: false,
});

// Utility function to check if the user is on Core Testnet
// You can import and use this in your components
export const CORE_TESTNET_CHAIN_ID = 1114;

export function isOnCoreTestnet(chainId: number | undefined): boolean {
  return chainId === CORE_TESTNET_CHAIN_ID;
}

// Helper function to get a user-friendly error message based on chain status
export function getChainErrorMessage(chainId: number | undefined): string | null {
  if (chainId === undefined) {
    return "No blockchain network detected. Please connect your wallet.";
  }
  
  if (chainId !== CORE_TESTNET_CHAIN_ID) {
    return `You're connected to the wrong network. Please switch to Core Testnet (Chain ID: ${CORE_TESTNET_CHAIN_ID}).`;
  }
  
  return null; // No error
}