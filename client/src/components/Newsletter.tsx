import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Please enter your email",
        description: "You need to provide an email address to subscribe.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would make an API call here
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    setEmail("");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/80 to-primary rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-white mb-4">Never Miss a Giveaway</h2>
              <p className="text-white/90 mb-6">
                Subscribe to our newsletter and be the first to know about new giveaways,
                winners, and exclusive offers only available to subscribers.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-neutral-100 transition-colors shadow-md"
                >
                  Subscribe
                </Button>
              </form>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Bell className="text-white w-8 h-8" />
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">Get Notifications</h4>
                    <p className="text-white/80 text-sm">For new giveaways & winners</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Gift className="text-white w-8 h-8" />
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">Early Access</h4>
                    <p className="text-white/80 text-sm">To exclusive giveaways</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
