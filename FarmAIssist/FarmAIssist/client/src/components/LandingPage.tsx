import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, MessageSquare, Globe, Smartphone, Users, CheckCircle } from "lucide-react";
import { Link, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import heroImage from "@assets/generated_images/Kerala_farmland_hero_image_34fe0ee7.png";

export default function LandingPage() {
  const { user } = useAuth();
  
  // If user is authenticated, redirect to query interface
  if (user) {
    return <Redirect to="/query" />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
              <Leaf className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            FarmerAssist
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-4">
            AI-Powered Agricultural Advisory for Kerala Farmers
          </p>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get expert farming advice in your own language. Ask questions through voice, text, or images and receive personalized agricultural guidance powered by AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 min-w-[160px]"
              asChild
              data-testid="button-hero-signup"
            >
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 min-w-[160px] bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
              data-testid="button-hero-signin"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-300">
            <p>Government of Kerala • Department of Agriculture</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Smart Farming Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets traditional agricultural wisdom to help Kerala farmers succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Language Support</CardTitle>
                <CardDescription>
                  Ask questions in Malayalam, Hindi, Tamil, or English and get responses in your preferred language
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Voice & Image Input</CardTitle>
                <CardDescription>
                  Speak your questions or take photos of crops, pests, or diseases for instant analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert AI Guidance</CardTitle>
                <CardDescription>
                  Access comprehensive agricultural knowledge powered by advanced AI and local farming expertise
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Farmer Community</CardTitle>
                <CardDescription>
                  Connect with fellow farmers and access a library of common agricultural queries and solutions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verified Information</CardTitle>
                <CardDescription>
                  All advice is verified by agricultural experts and tailored to Kerala's unique farming conditions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sustainable Practices</CardTitle>
                <CardDescription>
                  Learn eco-friendly farming techniques that preserve Kerala's natural environment
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Join Thousands of Kerala Farmers
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Start your journey towards smarter, more sustainable farming today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-3"
              asChild
              data-testid="button-cta-signup"
            >
              <Link href="/auth">Create Account</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
              data-testid="button-cta-signin"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}