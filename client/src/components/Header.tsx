
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "", 
    email: "", 
    fullName: "",
    country: "",
    subscribedToNewsletter: false 
  });
  const { toast } = useToast();

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const isActive = (path: string) => {
    const [location] = useLocation();
    return location === path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setShowAuthModal(false);
      setFormData({ username: "", password: "", email: "" });
      toast({ title: isLogin ? "Logged in successfully" : "Account created successfully" });
      
      setLocation("/");
    } catch (error) {
      toast({ 
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            PrizeWave
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 ml-12">
            <Link href="/" className={`font-medium ${isActive('/') ? 'text-primary' : 'text-neutral-700 hover:text-primary'} transition-colors`}>
              Home
            </Link>
            <Link href="/giveaways" className={`font-medium ${isActive('/giveaways') ? 'text-primary' : 'text-neutral-700 hover:text-primary'} transition-colors`}>
              Giveaways
            </Link>
            <Link href="/winners" className={`font-medium ${isActive('/winners') ? 'text-primary' : 'text-neutral-700 hover:text-primary'} transition-colors`}>
              Winners
            </Link>
            <Link href="/how-it-works" className={`font-medium ${isActive('/how-it-works') ? 'text-primary' : 'text-neutral-700 hover:text-primary'} transition-colors`}>
              How It Works
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => {
              setIsLogin(true);
              setShowAuthModal(true);
            }}
          >
            Log In
          </Button>
          <Button
            onClick={() => {
              setIsLogin(false);
              setShowAuthModal(true);
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <h2 className="text-2xl font-bold mb-4">{isLogin ? "Log In" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                required
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <Input
                required
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    required
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.subscribedToNewsletter}
                    onChange={(e) => setFormData({ ...formData, subscribedToNewsletter: e.target.checked })}
                  />
                  <span className="text-sm">Subscribe to newsletter</span>
                </label>
              </>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>
          <p className="text-center mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </DialogContent>
      </Dialog>
    </header>
  );
}
