import { useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { coreTestnet, CORE_TESTNET_CHAIN_ID } from '../config/wagmiConfig';

// Don't redeclare window.ethereum with a specific type
// Just use this simpler approach:
interface EthereumProvider {
  request: (args: any) => Promise<any>;
  on: (eventName: string, handler: any) => void;
  removeListener: (eventName: string, handler: any) => void;
  chainId?: string;
}

/**
 * NetworkEnforcer - A component that ensures users stay on Core Testnet
 */
const NetworkEnforcer = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  // Force switch to Core Testnet whenever the network changes to something else
  useEffect(() => {
    if (!isConnected) return;

    const enforceNetwork = async () => {
      // If user is on wrong network, force switch to Core Testnet
      if (chainId !== CORE_TESTNET_CHAIN_ID) {
        // First try wagmi's switchChain
        try {
          await switchChain({ chainId: CORE_TESTNET_CHAIN_ID });
          alert("This application only works on Core Testnet. You've been automatically switched back.");
          return;
        } catch (error) {
          console.error("Failed to switch using wagmi:", error);
        }

        // Fallback to direct ethereum provider request
        const ethereum = window.ethereum as EthereumProvider | undefined;
        if (ethereum) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${CORE_TESTNET_CHAIN_ID.toString(16)}` }],
            });
            alert("This application only works on Core Testnet. You've been automatically switched back.");
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${CORE_TESTNET_CHAIN_ID.toString(16)}`,
                      chainName: coreTestnet.name,
                      nativeCurrency: coreTestnet.nativeCurrency,
                      rpcUrls: [coreTestnet.rpcUrls.default.http[0]],
                      blockExplorerUrls: [coreTestnet.blockExplorers?.default.url],
                    },
                  ],
                });
                alert("Core Testnet has been added to your wallet. Please connect to it to use this application.");
              } catch (addError) {
                console.error("Failed to add the network:", addError);
              }
            } else {
              console.error("Failed to switch network:", switchError);
            }
          }
        }
      }
    };

    enforceNetwork();

    // Set up a listener for ethereum provider chain changes
    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      if (newChainId !== CORE_TESTNET_CHAIN_ID) {
        enforceNetwork();
      }
    };

    const ethereum = window.ethereum as EthereumProvider | undefined;
    if (ethereum) {
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [chainId, isConnected, switchChain]);

  return null; // This component doesn't render anything
};

export default NetworkEnforcer;