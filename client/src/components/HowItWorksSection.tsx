import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, UserCheck, Ticket, Gift } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Link your wallet to Moca Network and create your decentralized identity. Your privacy is protected with zero-knowledge proofs.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      number: 2,
      icon: UserCheck,
      title: "Verify Your Fan Status",
      description: "Prove you're a real fan without revealing personal data. Build reputation through verified event attendance and artist engagement.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      number: 3,
      icon: Ticket,
      title: "Purchase Protected Tickets",
      description: "Buy identity-linked tickets that can't be scalped. Smart contracts ensure fair pricing and artist revenue sharing on resales.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      number: 4,
      icon: Gift,
      title: "Unlock Exclusive Rewards",
      description: "Access VIP experiences, exclusive merchandise, and special perks based on your verified fan reputation across artists and venues.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            How MocaLake Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your fan experience with privacy-first verification 
            and anti-scalping protection.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-12 h-px bg-border z-0" 
                       style={{ 
                         display: index % 2 === 0 ? 'block' : 'none',
                         transform: index === 0 ? 'translateX(-100%)' : 'none'
                       }} 
                  />
                )}
                
                <Card className="relative hover-elevate h-full">
                  <CardContent className="p-6 space-y-4">
                    {/* Step Number Badge */}
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline" 
                        className="w-8 h-8 rounded-full p-0 flex items-center justify-center font-bold font-heading text-sm"
                      >
                        {step.number}
                      </Badge>
                      
                      <div className={`w-12 h-12 rounded-lg ${step.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-heading font-semibold" data-testid={`text-step-title-${index}`}>
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <span>Ready to get started?</span>
            <span className="text-muted-foreground">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}