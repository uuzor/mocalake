import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Shield, Ticket } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    artistName: string;
    venue: string;
    eventDate: string;
    ticketPrice: number;
    maxTickets: number;
    soldTickets: number;
    imageUrl?: string;
    isVerified?: boolean;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const soldOutPercentage = (event.soldTickets / event.maxTickets) * 100;
  const isAlmostSoldOut = soldOutPercentage > 80;
  const isSoldOut = soldOutPercentage >= 100;
  
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Mock purchase delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPurchasing(false);
    console.log(`Purchasing ticket for event: ${event.title}`);
  };

  return (
    <Card className="group hover-elevate overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Verification Badge */}
        {event.isVerified && (
          <Badge className="absolute top-3 left-3 bg-green-500/90 text-white border-green-400">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        
        {/* Availability Badge */}
        <Badge 
          variant={isSoldOut ? "destructive" : isAlmostSoldOut ? "secondary" : "default"}
          className="absolute top-3 right-3"
        >
          {isSoldOut ? "Sold Out" : `${event.maxTickets - event.soldTickets} left`}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <h3 className="font-heading font-semibold text-lg leading-tight" data-testid="text-event-title">
              {event.title}
            </h3>
            <p className="text-primary font-medium" data-testid="text-artist-name">
              {event.artistName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-heading" data-testid="text-ticket-price">
              ${event.ticketPrice}
            </div>
            <div className="text-xs text-muted-foreground">per ticket</div>
          </div>
        </div>
        
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
            {event.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{event.soldTickets} / {event.maxTickets} tickets sold</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              isSoldOut ? 'bg-destructive' : isAlmostSoldOut ? 'bg-accent' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(soldOutPercentage, 100)}%` }}
          />
        </div>

        {/* Purchase Button */}
        <Button 
          onClick={handlePurchase}
          disabled={isSoldOut || isPurchasing}
          className="w-full"
          data-testid={`button-purchase-${event.id}`}
        >
          {isPurchasing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Processing...
            </>
          ) : isSoldOut ? (
            "Sold Out"
          ) : (
            <>
              <Ticket className="mr-2 h-4 w-4" />
              Purchase Anti-Scalp Ticket
            </>
          )}
        </Button>

        {/* Anti-Scalping Notice */}
        {!isSoldOut && (
          <div className="text-xs text-muted-foreground text-center bg-muted/50 rounded-md p-2">
            <Shield className="h-3 w-3 inline mr-1" />
            Protected by identity verification • No resale above face value
          </div>
        )}
      </CardContent>
    </Card>
  );
}