import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import WalletConnect from "@/components/WalletConnect";
import EventCard from "@/components/EventCard";
import FanProfile from "@/components/FanProfile";
import TicketCard from "@/components/TicketCard";
import { mockEvents, mockUser, mockCredentials, mockTickets } from "@/lib/mockData";
import { useMocaKit } from "@/hooks/useMocaKit";
import NotFound from "@/pages/not-found";

function Home() {
  const { isConnected } = useMocaKit();

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      
      {/* Wallet Connect Section */}
      <section id="wallet-connect" className="py-24 bg-muted/10">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <WalletConnect />
          </div>
        </div>
      </section>

      {/* Connected User Experience */}
      {isConnected && (
        <>
          {/* Events Section */}
          <section id="events" className="py-24">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold">
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover verified events with anti-scalping protection
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {mockEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>

          {/* Dashboard Section */}
          <section className="py-24 bg-muted/20">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold">
                  Your Fan Dashboard
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Manage your identity, tickets, and reputation
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fan Profile */}
                <div className="lg:col-span-1">
                  <FanProfile user={mockUser} credentials={mockCredentials} />
                </div>
                
                {/* Tickets */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading font-semibold">
                      Your Tickets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockTickets.map((ticket) => {
                        const event = mockEvents.find(e => e.id === ticket.eventId);
                        return event ? (
                          <TicketCard key={ticket.id} ticket={ticket} event={event} />
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/10 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-sm text-muted-foreground">
            <div className="font-heading font-semibold text-primary mb-2">
              MocaLake
            </div>
            <p>Powered by Moca Network • Decentralized Fan Verification</p>
            <p className="mt-2">Building the future of privacy-first entertainment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
