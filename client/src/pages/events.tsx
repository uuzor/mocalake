import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMocaKit } from "@/hooks/useMocaKit";
import { getTicketCredentialConfig } from "@/config/environment";
import { Calendar, MapPin, Music, Users, DollarSign, Search, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Event {
  id: string;
  title: string;
  description?: string;
  artistName: string;
  venue: string;
  eventDate: string;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  imageUrl?: string;
  createdAt: string;
}

interface EventCardProps {
  event: Event;
  onBuyTicket: (event: Event) => void;
  isProcessing: boolean;
}

function EventCard({ event, onBuyTicket, isProcessing }: EventCardProps) {
  const isEventPast = new Date(event.eventDate) < new Date();
  const isSoldOut = (event.soldTickets || 0) >= event.maxTickets;
  const availableTickets = event.maxTickets - (event.soldTickets || 0);

  return (
    <Card className="hover-elevate" data-testid={`card-event-${event.id}`}>
      {event.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-md">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            data-testid={`img-event-${event.id}`}
          />
        </div>
      )}
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl" data-testid={`text-event-title-${event.id}`}>
            {event.title}
          </CardTitle>
          <Badge variant={isEventPast ? "secondary" : "default"} data-testid={`badge-status-${event.id}`}>
            {isEventPast ? "Past Event" : "Upcoming"}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span data-testid={`text-artist-${event.id}`}>{event.artistName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-venue-${event.id}`}>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${event.id}`}>
              {format(parseISO(event.eventDate), "PPP 'at' p")}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4" data-testid={`text-description-${event.id}`}>
            {event.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold" data-testid={`text-price-${event.id}`}>
              ${event.ticketPrice}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span data-testid={`text-tickets-${event.id}`}>
              {availableTickets} / {event.maxTickets} available
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={isEventPast || isSoldOut || isProcessing}
          onClick={() => onBuyTicket(event)}
          data-testid={`button-buy-ticket-${event.id}`}
        >
          {isProcessing
            ? "Processing..."
            : isEventPast
            ? "Event Ended"
            : isSoldOut
            ? "Sold Out"
            : "Buy Ticket"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EventSkeleton() {
  return (
    <Card>
      <div className="aspect-video w-full">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const filteredAndSortedEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());

      const now = new Date();
      const eventDate = new Date(event.eventDate);
      const isSoldOut = (event.soldTickets || 0) >= event.maxTickets;

      const matchesFilter = filterBy === "all" || 
        (filterBy === "upcoming" && eventDate >= now && !isSoldOut) ||
        (filterBy === "past" && eventDate < now) ||
        (filterBy === "available" && eventDate >= now && !isSoldOut) ||
        (filterBy === "sold-out" && isSoldOut);

      const matchesPrice = priceRange === "all" ||
        (priceRange === "free" && event.ticketPrice === 0) ||
        (priceRange === "low" && event.ticketPrice > 0 && event.ticketPrice <= 50) ||
        (priceRange === "medium" && event.ticketPrice > 50 && event.ticketPrice <= 150) ||
        (priceRange === "high" && event.ticketPrice > 150);

      return matchesSearch && matchesFilter && matchesPrice;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
        case "price-low":
          return a.ticketPrice - b.ticketPrice;
        case "price-high":
          return b.ticketPrice - a.ticketPrice;
        case "name":
          return a.title.localeCompare(b.title);
        case "artist":
          return a.artistName.localeCompare(b.artistName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, sortBy, filterBy, priceRange]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected, userAddress, userUUID, mocaService } = useMocaKit();

  const purchaseTicketMutation = useMutation({
    mutationFn: async ({ event }: { event: Event }) => {
      if (!userAddress) {
        throw new Error("Wallet not connected");
      }

      if (!mocaService) {
        throw new Error("MOCA service not initialized");
      }

      // Use userUUID as DID for now (this should be the actual DID from the service)
      const userDid = userUUID || `did:air:user:${userAddress?.slice(2, 10)}`;

      // Step 1: Get user ID by wallet address
      const userResponse = await fetch(`/api/users/wallet/${userAddress}`);
      let user;
      
      if (!userResponse.ok) {
        // Create user if doesn't exist
        const createUserResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: userAddress,
            mocaId: userDid,
          }),
        });
        
        if (!createUserResponse.ok) {
          throw new Error('Failed to create user');
        }
        
        user = await createUserResponse.json();
      } else {
        user = await userResponse.json();
      }

      // Step 2: Purchase ticket and get credential subject
      const purchaseResponse = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.id,
          userDid: userDid,
        }),
      });

      if (!purchaseResponse.ok) {
        const error = await purchaseResponse.json();
        throw new Error(error.error || 'Failed to purchase ticket');
      }

      const { credentialSubject } = await purchaseResponse.json();

      // Step 3: Generate JWT for credential issuance
      const credentialConfig = getTicketCredentialConfig();
      const jwtResponse = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: credentialConfig.partnerId,
        }),
      });

      if (!jwtResponse.ok) {
        throw new Error('Failed to generate authorization token');
      }

      const { token } = await jwtResponse.json();

      // Step 4: Issue credential using AIR Kit
      await mocaService.issueCredential({
        authToken: token,
        credentialId: credentialConfig.credentialId,
        credentialSubject: credentialSubject,
        issuerDid: credentialConfig.issuerDid,
      });

      return { event, user, credentialSubject };
    },
    onSuccess: ({ event }) => {
      toast({
        title: "Ticket purchased successfully!",
        description: `Your ticket credential for "${event.title}" has been issued to your wallet.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
    onError: (error: any) => {
      console.error('Ticket purchase error:', error);
      toast({
        title: "Failed to purchase ticket",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleBuyTicket = (event: Event) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase tickets.",
        variant: "destructive",
      });
      return;
    }

    if (!mocaService) {
      toast({
        title: "MOCA service not ready",
        description: "Please wait for the service to fully initialize.",
        variant: "destructive",
      });
      return;
    }

    purchaseTicketMutation.mutate({ event });
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-destructive">Failed to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
        <p className="text-muted-foreground">
          Find amazing events and get your tickets through MocaLake's secure credential system.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, artist, or venue..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-events"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort-by">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Event Date</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Event Name</SelectItem>
                  <SelectItem value="artist">Artist Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter">Filter</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger data-testid="select-filter-by">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price Range</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger data-testid="select-price-range">
                  <SelectValue placeholder="All prices..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="low">$1 - $50</SelectItem>
                  <SelectItem value="medium">$51 - $150</SelectItem>
                  <SelectItem value="high">$150+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterBy !== "all" || priceRange !== "all"
              ? "Try adjusting your search or filters"
              : "No events available at the moment"}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBuyTicket={handleBuyTicket}
                isProcessing={purchaseTicketMutation.isPending}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}