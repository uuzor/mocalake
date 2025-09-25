import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Award, DollarSign, Zap, Eye } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Privacy-First Verification",
      description: "Prove you're a real fan without revealing personal data using zero-knowledge proofs and decentralized identity.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Users,
      title: "Anti-Scalping Protection", 
      description: "Identity-linked tickets that can't be sold above face value, ensuring fair access for real fans.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Award,
      title: "Cross-Platform Reputation",
      description: "Build portable fan credentials across artists and venues that travel with your decentralized identity.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: DollarSign,
      title: "Artist Revenue Share",
      description: "Smart contracts ensure creators get their fair share of resale profits automatically and transparently.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Zap,
      title: "Exclusive Fan Rewards",
      description: "Unlock VIP experiences and exclusive perks based on your verified attendance history and fan reputation.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Eye,
      title: "Universal Identity",
      description: "One identity that works across the entire entertainment ecosystem, powered by Moca Network's infrastructure.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
            Revolutionary Fan Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MocaLake combines the power of decentralized identity with entertainment to create 
            a new standard for fan verification and event ticketing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover-elevate h-full">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-heading" data-testid={`text-feature-title-${index}`}>
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}