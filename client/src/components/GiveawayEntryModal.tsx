import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X, CheckCircle } from "lucide-react";
import { Giveaway } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface GiveawayEntryModalProps {
  giveaway: Giveaway;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Please select your country"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  newsletter: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GiveawayEntryModal({
  giveaway,
  isOpen,
  onClose,
}: GiveawayEntryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "",
      terms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, we would have a user authentication system
      // and would use the actual user ID
      const mockUserId = 1;
      
      // Create entry in the database
      await apiRequest("POST", "/api/entries", {
        giveawayId: giveaway.id,
        userId: mockUserId,
      });
      
      // Invalidate queries to refetch giveaway data
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways'] });
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways/active'] });
      queryClient.invalidateQueries({ queryKey: [`/api/giveaways/${giveaway.id}`] });
      
      toast({
        title: "Entry submitted successfully!",
        description: "Good luck in the giveaway!",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting entry:", error);
      toast({
        title: "Error submitting entry",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse eligibility requirements from string to array
  const eligibilityRequirements = giveaway.eligibilityRequirements
    .split(",")
    .map((req) => req.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-primary text-white">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">Enter Giveaway</DialogTitle>
            <DialogClose className="text-white hover:text-neutral-200 transition-colors">
              <X className="w-5 h-5" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              className="w-16 h-16 object-cover rounded-lg"
              src={giveaway.imageUrl}
              alt={giveaway.title}
            />
            <div className="ml-4">
              <h4 className="text-lg font-semibold">{giveaway.title}</h4>
              <p className="text-neutral-600 text-sm">
                {giveaway.value ? `Value: ${giveaway.value}` : ""}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="font-medium mb-2">Eligibility Requirements</h5>
            <ul className="text-neutral-700 text-sm space-y-2">
              {eligibilityRequirements.map((requirement, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="text-secondary mr-2 w-4 h-4" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your full name"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-neutral-700">
                      Country
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-4 h-4 text-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-neutral-700">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="w-4 h-4 text-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-neutral-700">
                        Subscribe to our newsletter for future giveaways
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="mt-8">
                <Button
                  type="submit"
                  className="w-full px-4 py-3 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Entry"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
