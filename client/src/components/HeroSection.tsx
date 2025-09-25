import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Zap, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Web3_blockchain_network_visualization_eb6621dd.png";

export default function HeroSection() {
  const handleGetStarted = () => {
    console.log("Get started clicked - scroll to wallet connect");
    // In real app, would scroll to wallet connect section
    document.getElementById("wallet-connect")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnMore = () => {
    console.log("Learn more clicked - scroll to features");
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Decentralized network visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center space-y-8 max-w-4xl">
        {/* Badge */}
        <Badge 
          variant="outline" 
          className="mx-auto bg-primary/10 border-primary/20 text-primary px-4 py-1.5 text-sm font-medium"
        >
          <Sparkles className="h-3 w-3 mr-2" />
          Powered by Moca Network
        </Badge>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Verify Your Fan Identity
            </span>
            <br />
            <span className="text-foreground">Without Revealing Data</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            MocaLake uses decentralized identity to prove you're a real fan while keeping your personal information private. 
            Get anti-scalping protection and unlock exclusive rewards across artists and venues.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Privacy-First Verification</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Anti-Scalping Protection</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Cross-Platform Reputation</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button 
            size="lg" 
            className="h-12 px-8 text-base font-medium group"
            onClick={handleGetStarted}
            data-testid="button-hero-get-started"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 px-8 text-base font-medium bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
            onClick={handleLearnMore}
            data-testid="button-hero-learn-more"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-12 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold font-heading text-foreground">570+</div>
            <div>Partner Companies</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold font-heading text-foreground">700M+</div>
            <div>Addressable Users</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold font-heading text-foreground">100%</div>
            <div>Privacy Protected</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}