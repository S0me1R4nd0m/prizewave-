import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Giveaways from "@/pages/Giveaways";
import Winners from "@/pages/Winners";
import HowItWorks from "@/pages/HowItWorks";
import Admin from "@/pages/Admin";
import GiveawayDetail from "@/pages/GiveawayDetail";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/giveaways" component={Giveaways} />
        <Route path="/giveaway/:id" component={GiveawayDetail} />
        <Route path="/winners" component={Winners} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/admin" component={Admin} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
