import { Button } from "@/components/ui/button";
import { Leaf, Menu, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logoutMutation } = useAuth();

  return (
    <header className="bg-card border-b border-card-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-md">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">FarmerAssist</h1>
              <p className="text-xs text-muted-foreground">Kerala Department of Agriculture</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  data-testid="button-profile"
                  className="gap-2"
                >
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  data-testid="button-theme-toggle"
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-sign-out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  data-testid="button-sign-in"
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  asChild
                  data-testid="button-sign-up"
                >
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-card-border py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2 py-2 text-sm">
                  <User className="h-4 w-4" />
                  {user.name}
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  asChild
                  data-testid="button-mobile-profile"
                >
                  <Link href="/profile">
                    <Settings className="h-4 w-4" />
                    Profile & Settings
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  data-testid="button-mobile-theme"
                >
                  {theme === "light" ? "🌙" : "☀️"}
                  Switch to {theme === "light" ? "Dark" : "Light"} Mode
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-2"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-mobile-sign-out"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  asChild
                  data-testid="button-mobile-sign-in"
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start"
                  asChild
                  data-testid="button-mobile-sign-up"
                >
                  <Link href="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}