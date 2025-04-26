import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { format } from "date-fns";
import { Giveaway, Winner, insertGiveawaySchema, CategoryEnum, RegionEnum } from "@shared/schema";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Calendar, Trophy, Gift, Trash2, Edit, Check, Search } from "lucide-react";

// Extended schema with additional validation
const createGiveawaySchema = insertGiveawaySchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  prize: z.string().min(3, "Prize must be at least 3 characters"),
  category: CategoryEnum,
  region: RegionEnum,
  eligibilityRequirements: z.string().min(5, "Requirements must be at least 5 characters"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof createGiveawaySchema>;

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState("giveaways");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Queries
  const { data: giveaways, isLoading: isLoadingGiveaways } = useQuery<Giveaway[]>({
    queryKey: ['/api/giveaways'],
  });

  const { data: winners, isLoading: isLoadingWinners } = useQuery<Winner[]>({
    queryKey: ['/api/winners'],
  });

  // Mutations
  const createGiveawayMutation = useMutation({
    mutationFn: (newGiveaway: FormValues) => 
      apiRequest("POST", "/api/giveaways", newGiveaway),
    onSuccess: () => {
      toast({
        title: "Giveaway created successfully!",
        description: "Your new giveaway has been added.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways'] });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create giveaway",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const selectWinnerMutation = useMutation({
    mutationFn: (giveawayId: number) => 
      apiRequest("POST", `/api/giveaways/${giveawayId}/select-winner`, {}),
    onSuccess: () => {
      toast({
        title: "Winner selected successfully!",
        description: "A winner has been chosen for this giveaway.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways'] });
      queryClient.invalidateQueries({ queryKey: ['/api/winners'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to select winner",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const deleteGiveawayMutation = useMutation({
    mutationFn: (giveawayId: number) => 
      apiRequest("DELETE", `/api/giveaways/${giveawayId}`, {}),
    onSuccess: () => {
      toast({
        title: "Giveaway deleted",
        description: "The giveaway has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/giveaways'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete giveaway",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Form for creating new giveaways
  const form = useForm<FormValues>({
    resolver: zodResolver(createGiveawaySchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      prize: "",
      category: "Tech",
      region: "Global",
      eligibilityRequirements: "Must be 18 years or older, Valid email address required, One entry per person",
      value: "",
      targetEntries: 1000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      isPopular: false,
      isPremium: false,
      isFeatured: false,
      createdByUserId: 1,
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    };
    createGiveawayMutation.mutate(formattedData);

    // Add Disney+ giveaway
    const disneyGiveaway = {
      title: "1-Year Disney+ Premium Subscription",
      description: "Win a full year of Disney+ Premium! Stream your favorite Disney, Marvel, Star Wars, and National Geographic content in 4K HDR.",
      imageUrl: "https://www.seekpng.com/png/detail/238-2389214_disney-plus-logo-white.png",
      prize: "Disney+ Premium Annual Subscription",
      category: "Disney+",
      region: "Global",
      eligibilityRequirements: "Must be 18 years or older, Valid email address required, One entry per person",
      value: "$109.99",
      targetEntries: 1000,
      startDate: new Date(),
      endDate: new Date("2024-05-01"),
      isActive: true,
      isPopular: true,
      isPremium: true,
      isFeatured: true,
      createdByUserId: 1
    };
    createGiveawayMutation.mutate(disneyGiveaway);

    // Add Paramount+ giveaway
    const paramountGiveaway = {
      title: "1-Year Paramount+ Premium Subscription",
      description: "Win a year of Paramount+ Premium! Access to exclusive shows, movies, and live sports including NFL on CBS.",
      imageUrl: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.southpark.nordics:b46a8cf3-21c7-450e-b068-46fa5dcd8323?quality=0.7&gen=ntrn&legacyStatusCode=true",
      prize: "Paramount+ Premium Annual Subscription",
      category: "Paramount+",
      region: "Global",
      eligibilityRequirements: "Must be 18 years or older, Valid email address required, One entry per person",
      value: "$99.99",
      targetEntries: 1000,
      startDate: new Date(),
      endDate: new Date("2024-05-01"),
      isActive: true,
      isPopular: true,
      isPremium: true,
      isFeatured: true,
      createdByUserId: 1
    };
    createGiveawayMutation.mutate(paramountGiveaway);
  };

  // Filter giveaways based on search term
  const filteredGiveaways = giveaways?.filter(giveaway => 
    searchTerm === "" || 
    giveaway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giveaway.prize.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-neutral-600">Manage giveaways, select winners, and monitor platform activity.</p>
      </div>

      <Tabs defaultValue="giveaways" onValueChange={setSelectedTab} value={selectedTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="giveaways" className="flex items-center">
            <Gift className="mr-2 w-4 h-4" />
            Giveaways
          </TabsTrigger>
          <TabsTrigger value="winners" className="flex items-center">
            <Trophy className="mr-2 w-4 h-4" />
            Winners
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center">
            <Gift className="mr-2 w-4 h-4" />
            New Giveaway
          </TabsTrigger>
        </TabsList>

        {/* Giveaways Tab */}
        <TabsContent value="giveaways">
          <Card>
            <CardHeader>
              <CardTitle>Manage Giveaways</CardTitle>
              <CardDescription>
                View, edit, and manage all giveaways on the platform.
              </CardDescription>
              <div className="mt-4 relative">
                <Input
                  placeholder="Search giveaways..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingGiveaways ? (
                <div className="text-center py-8">Loading giveaways...</div>
              ) : filteredGiveaways && filteredGiveaways.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Prize</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGiveaways.map((giveaway) => {
                        const now = new Date();
                        const endDate = new Date(giveaway.endDate);
                        const isEnded = now > endDate;
                        
                        return (
                          <TableRow key={giveaway.id}>
                            <TableCell className="font-medium">{giveaway.title}</TableCell>
                            <TableCell>{giveaway.prize}</TableCell>
                            <TableCell>{giveaway.category}</TableCell>
                            <TableCell>
                              {giveaway.isActive ? (
                                isEnded ? (
                                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                    Ended
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                    Active
                                  </span>
                                )
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                  Inactive
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{format(new Date(giveaway.endDate), "MMM dd, yyyy")}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => deleteGiveawayMutation.mutate(giveaway.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {isEnded && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => selectWinnerMutation.mutate(giveaway.id)}
                                  >
                                    <Trophy className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-lg font-semibold">No giveaways found</h3>
                  <p className="text-neutral-500">
                    {searchTerm ? "Try a different search term" : "Create your first giveaway"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Winners Tab */}
        <TabsContent value="winners">
          <Card>
            <CardHeader>
              <CardTitle>Winners List</CardTitle>
              <CardDescription>
                View all winners and their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWinners ? (
                <div className="text-center py-8">Loading winners...</div>
              ) : winners && winners.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Winner ID</TableHead>
                        <TableHead>Giveaway ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Announcement Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Testimonial</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {winners.map((winner) => (
                        <TableRow key={winner.id}>
                          <TableCell className="font-medium">{winner.id}</TableCell>
                          <TableCell>{winner.giveawayId}</TableCell>
                          <TableCell>{winner.userId}</TableCell>
                          <TableCell>{format(new Date(winner.announcementDate), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{winner.location || "N/A"}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {winner.testimonial || "No testimonial provided"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-lg font-semibold">No winners yet</h3>
                  <p className="text-neutral-500">
                    Once you select winners, they will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Giveaway Tab */}
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Giveaway</CardTitle>
              <CardDescription>
                Fill in the details to create a new giveaway.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter giveaway title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prize</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter prize details" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter giveaway description" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CategoryEnum.options.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RegionEnum.options.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g. $500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetEntries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Entries</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="E.g. 1000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-neutral-500" />
                              <Input 
                                type="date"
                                {...field}
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-neutral-500" />
                              <Input 
                                type="date"
                                {...field}
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eligibilityRequirements"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Eligibility Requirements</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter eligibility requirements (comma separated)" 
                              {...field} 
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Active</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Featured</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPopular"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Popular</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPremium"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Premium</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createGiveawayMutation.isPending}
                  >
                    {createGiveawayMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Giveaway...
                      </span>
                    ) : (
                      "Create Giveaway"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
