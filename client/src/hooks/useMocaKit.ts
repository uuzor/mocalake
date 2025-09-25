// TODO: remove mock functionality - this is for design prototype only
import { useState, useEffect } from 'react';

// Mock implementation for design prototype
export function useMocaKit() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    // Mock connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setUserAddress("0x1234567890abcdef");
    setIsLoading(false);
    console.log("Wallet connected (mock)");
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUserAddress(null);
    console.log("Wallet disconnected (mock)");
  };

  return {
    isConnected,
    isLoading,
    userAddress,
    connectWallet,
    disconnectWallet,
  };
}