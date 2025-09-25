import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Shield, Zap } from "lucide-react";
import { useMocaKit } from "@/hooks/useMocaKit";

export default function WalletConnect() {
  const { isConnected, isLoading, userAddress, connectWallet, disconnectWallet } = useMocaKit();

  if (isConnected && userAddress) {
    return (
      <Card className="border-green-500/20 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-md">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-heading">Wallet Connected</CardTitle>
                <CardDescription className="font-mono text-sm">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              Moca Network Identity Active
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnectWallet}
              data-testid="button-disconnect-wallet"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-3">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl font-heading">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect with Moca Network to access decentralized fan verification and secure ticket purchases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full h-11 font-medium"
          data-testid="button-connect-wallet"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect with Moca Network
            </>
          )}
        </Button>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Privacy Protected
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Zero-Knowledge Proofs
          </div>
        </div>
      </CardContent>
    </Card>
  );
}