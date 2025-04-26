import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Giveaway } from "@shared/schema";
import ActiveGiveaways from "@/components/ActiveGiveaways";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function Giveaways() {
  const [category, setCategory] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  
  // Fetch categories and regions
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });
  
  const { data: regions } = useQuery<string[]>({
    queryKey: ['/api/regions'],
    queryFn: async () => {
      const response = await fetch('/api/regions');
      if (!response.ok) throw new Error('Failed to fetch regions');
      return response.json();
    }
  });

  return (
    <div className="pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Explore All Giveaways
          </h1>
          <p className="text-lg text-neutral-600">
            Browse through our collection of exciting giveaways and find something you love.
            New prizes are added regularly, so check back often!
          </p>
        </div>
        
        <div className="mb-10 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Category
            </label>
            <Select
              defaultValue="all"
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Region
            </label>
            <Select
              defaultValue="all"
              value={region}
              onValueChange={setRegion}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions?.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Pass the filters to the ActiveGiveaways component */}
      <ActiveGiveaways limit={9} showPagination={true} showFilters={true} />
    </div>
  );
}
