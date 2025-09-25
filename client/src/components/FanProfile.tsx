import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Shield, Award, Calendar, TrendingUp } from "lucide-react";

interface FanProfileProps {
  user: {
    id: string;
    walletAddress: string;
    mocaId?: string;
    username?: string;
    reputationScore: number;
    verifiedFan: boolean;
    createdAt: string;
  };
  credentials?: Array<{
    id: string;
    artistName: string;
    credentialType: string;
    credentialData: string;
    issuedAt: string;
  }>;
}

export default function FanProfile({ user, credentials = [] }: FanProfileProps) {
  const reputationLevel = user.reputationScore >= 800 ? "Diamond" : 
                         user.reputationScore >= 600 ? "Gold" : 
                         user.reputationScore >= 400 ? "Silver" : "Bronze";
  
  const reputationColor = user.reputationScore >= 800 ? "text-purple-500" : 
                         user.reputationScore >= 600 ? "text-yellow-500" : 
                         user.reputationScore >= 400 ? "text-gray-400" : "text-orange-600";

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-heading">
              {user.username?.slice(0, 2).toUpperCase() || "CF"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-xl font-heading" data-testid="text-username">
                {user.username || "Anonymous Fan"}
              </CardTitle>
              {user.verifiedFan && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground font-mono">
              {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
            </div>
            
            {user.mocaId && (
              <div className="text-xs text-muted-foreground">
                Moca ID: {user.mocaId}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Reputation Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Fan Reputation</span>
            </div>
            <div className="text-right">
              <div className={`font-bold font-heading ${reputationColor}`} data-testid="text-reputation-score">
                {user.reputationScore}
              </div>
              <div className="text-xs text-muted-foreground">{reputationLevel} Tier</div>
            </div>
          </div>
          
          <Progress value={(user.reputationScore / 1000) * 100} className="h-2" />
          
          <div className="text-xs text-muted-foreground text-center">
            {1000 - user.reputationScore} points to next tier
          </div>
        </div>

        {/* Credentials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-medium">Fan Credentials</span>
            <Badge variant="outline" className="ml-auto">
              {credentials.length}
            </Badge>
          </div>
          
          {credentials.length > 0 ? (
            <div className="grid gap-2">
              {credentials.slice(0, 3).map((credential) => {
                const data = JSON.parse(credential.credentialData);
                return (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/50 border"
                  >
                    <div>
                      <div className="font-medium text-sm" data-testid={`text-credential-artist-${credential.id}`}>
                        {credential.artistName}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {credential.credentialType.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      {data.supportLevel || data.attendanceRate || "Verified"}
                    </Badge>
                  </div>
                );
              })}
              
              {credentials.length > 3 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  +{credentials.length - 3} more credentials
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-4">
              No credentials yet. Attend events to earn your first credentials!
            </div>
          )}
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
          <Calendar className="h-4 w-4" />
          <span>Member since {memberSince}</span>
        </div>
      </CardContent>
    </Card>
  );
}