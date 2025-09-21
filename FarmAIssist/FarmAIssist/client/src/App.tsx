import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import AuthForm from "./components/AuthForm";
import QueryInterface from "./components/QueryInterface";
import AdvisoryFeed from "./components/AdvisoryFeed";
import Profile from "./components/Profile";
import QueryHistory from "./components/QueryHistory";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Switch>
        <Route path="/">
          <LandingPage />
        </Route>
        
        <Route path="/auth">
          <AuthForm mode="signin" />
        </Route>
        
        <ProtectedRoute path="/query" component={() => <QueryInterface />} />
        
        <Route path="/advisory">
          <AdvisoryFeed />
        </Route>
        
        <ProtectedRoute path="/profile" component={() => <Profile />} />
        
        <ProtectedRoute path="/history" component={() => <QueryHistory />} />
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;