import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket, QrCode, Shield, ExternalLink } from "lucide-react";
import { useState } from "react";

interface TicketCardProps {
  ticket: {
    id: string;
    tokenId?: string;
    purchasePrice: number;
    isUsed: boolean;
    purchasedAt: string;
  };
  event: {
    id: string;
    title: string;
    artistName: string;
    venue: string;
    eventDate: string;
    imageUrl?: string;
  };
}

export default function TicketCard({ ticket, event }: TicketCardProps) {
  const [showQR, setShowQR] = useState(false);
  
  const eventDate = new Date(event.eventDate);
  const purchasedDate = new Date(ticket.purchasedAt);
  const isEventPast = eventDate < new Date();
  
  const formattedEventDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedPurchaseDate = purchasedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShowQR = () => {
    setShowQR(!showQR);
    console.log(`Toggle QR code for ticket: ${ticket.id}`);
  };

  const handleViewOnChain = () => {
    console.log(`View on blockchain: ${ticket.tokenId}`);
    // In real app, would open blockchain explorer
  };

  return (
    <Card className={`overflow-hidden ${ticket.isUsed ? 'opacity-75' : ''}`}>
      {/* Ticket Header */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {ticket.isUsed ? (
            <Badge variant="secondary" className="bg-gray-500/90 text-white">
              Used
            </Badge>
          ) : isEventPast ? (
            <Badge variant="destructive" className="bg-red-500/90 text-white">
              Expired
            </Badge>
          ) : (
            <Badge className="bg-green-500/90 text-white border-green-400">
              <Ticket className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          )}
        </div>

        {/* Token ID */}
        {ticket.tokenId && (
          <Badge 
            variant="outline" 
            className="absolute top-3 right-3 bg-black/50 text-white border-white/20 font-mono text-xs"
          >
            #{ticket.tokenId}
          </Badge>
        )}

        {/* Anti-Scalping Indicator */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-black/50 text-white border-green-400/50 text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Anti-Scalp Protected
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-1">
          <h3 className="font-heading font-semibold text-lg leading-tight" data-testid="text-ticket-event-title">
            {event.title}
          </h3>
          <p className="text-primary font-medium" data-testid="text-ticket-artist-name">
            {event.artistName}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedEventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
          <div className="text-sm">
            <div className="font-medium" data-testid="text-ticket-purchase-price">
              Purchased for ${ticket.purchasePrice}
            </div>
            <div className="text-muted-foreground text-xs">
              on {formattedPurchaseDate}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Original Price
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && !ticket.isUsed && !isEventPast && (
          <div className="p-4 bg-white rounded-md border text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-md mx-auto mb-3 flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-xs text-muted-foreground">
              Scan this QR code at the venue for entry
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!ticket.isUsed && !isEventPast && (
            <Button
              variant="default"
              onClick={handleShowQR}
              className="flex-1"
              data-testid={`button-qr-${ticket.id}`}
            >
              <QrCode className="mr-2 h-4 w-4" />
              {showQR ? "Hide QR" : "Show QR"}
            </Button>
          )}
          
          {ticket.tokenId && (
            <Button
              variant="outline"
              size={!ticket.isUsed && !isEventPast ? "default" : "default"}
              onClick={handleViewOnChain}
              className={!ticket.isUsed && !isEventPast ? "" : "flex-1"}
              data-testid={`button-blockchain-${ticket.id}`}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Chain
            </Button>
          )}
        </div>

        {/* Resale Protection Notice */}
        <div className="text-xs text-muted-foreground text-center bg-muted/30 rounded-md p-2">
          <Shield className="h-3 w-3 inline mr-1" />
          This ticket is identity-linked and cannot be resold above face value
        </div>
      </CardContent>
    </Card>
  );
}