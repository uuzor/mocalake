import { useState, useEffect, useCallback } from "react";
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";

interface UseMocaKitReturn {
  isConnected: boolean;
  isLoading: boolean;
  userAddress: string | null;
  userUUID: string | null;
  mocaService: AirService | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: any;
}

export function useMocaKit(): UseMocaKitReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [mocaService, setMocaService] = useState<AirService | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const initService = async () => {
    try {
      console.log("started Moca service with partnerId:");
      const partnerId = "cfe1fef1-a5f3-4e62-a04e-c695017d6801";
      if (!partnerId) {
        console.warn("MOCA_PARTNER_ID not configured - using fallback mode");
        // For now, set a fallback to continue development
        // In production, this should be properly configured
        return;
      }
      console.log("Initializing Moca service with partnerId:");

      const service = new AirService({
        partnerId,
        modalZIndex: 9999,
      });

      console.log("Initializing Moca service with build:");

      await service.init({
        buildEnv: BUILD_ENV.SANDBOX,
        enableLogging: false,
        skipRehydration: false,
      });

      console.log("setting Moca service with partnerId:");
      setMocaService(service);
      console.log("Moca service initialized successfully");
      // Preload wallet for better performance
      await service.preloadWallet();
      console.log("Moca wallet preloaded successfully");
    } catch (error) {
      console.error("Failed to initialize Moca service:", error);
    }
  };

  // Initialize Moca service
  useEffect(() => {
    
    initService();
    
  }, []);

  const connectWallet = useCallback(async () => {
    await initService();
    
    if (!mocaService) {
      console.error("Moca service not initialized");
      return;
    }

    setIsLoading(true);
    try {
      // Trigger login flow
      const loginResult = await mocaService.login();

      if (loginResult) {
        // Get provider and account information
        const walletProvider = mocaService.getProvider();
        const accounts = await walletProvider.request({
          method: "eth_accounts",
          params: [],
        });

        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          setIsConnected(true);
          setUserAddress(accounts[0] as string);
          setUserUUID(Date.now().toString()); // Temporary UUID
          setProvider(walletProvider);

          // Store connection state
          localStorage.setItem("moca_connected", "true");
          localStorage.setItem("moca_address", accounts[0] as string);
          localStorage.setItem("moca_uuid", Date.now().toString());

          console.log("Wallet connected successfully:", accounts[0]);
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [mocaService]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setUserAddress(null);
    setUserUUID(null);
    setProvider(null);

    // Clear stored connection state
    localStorage.removeItem("moca_connected");
    localStorage.removeItem("moca_address");
    localStorage.removeItem("moca_uuid");

    console.log("Wallet disconnected");
  }, []);

  // Restore connection state on load
  useEffect(() => {
    const restoreConnection = () => {
      const wasConnected = localStorage.getItem("moca_connected");
      const storedAddress = localStorage.getItem("moca_address");
      const storedUUID = localStorage.getItem("moca_uuid");

      if (wasConnected && storedAddress && mocaService) {
        setIsConnected(true);
        setUserAddress(storedAddress);
        setUserUUID(storedUUID);

        // Get provider if service is ready
        try {
          const walletProvider = mocaService.getProvider();
          setProvider(walletProvider);
        } catch (error) {
          console.warn("Could not restore provider:", error);
        }
      }
    };

    if (mocaService) {
      restoreConnection();
    }
  }, [mocaService]);

  return {
    isConnected,
    isLoading,
    userAddress,
    userUUID,
    mocaService,
    connectWallet,
    disconnectWallet,
    provider,
  };
}
