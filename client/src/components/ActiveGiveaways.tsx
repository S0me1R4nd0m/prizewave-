import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import GiveawayCard from "./GiveawayCard";
import { Giveaway } from "@shared/schema";

interface ActiveGiveawaysProps {
  limit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
}

export default function ActiveGiveaways({ 
  limit = 6, 
  showPagination = true, 
  showFilters = true 
}: ActiveGiveawaysProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const offset = (page - 1) * limit;
  
  const { data, isLoading } = useQuery<Giveaway[]>({
    queryKey: ['/api/giveaways/active', offset, limit],
    queryFn: async () => {
      const response = await fetch(`/api/giveaways/active?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
  
  // Total pages (in a real app, would be from API)
  const totalPages = data && data.length > 0 ? 10 : 1;
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };
  
  // Pagination UI renderer
  const renderPagination = () => {
    if (!showPagination) return null;
    
    const pages = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          className={`w-10 h-10 rounded-full ${page === i ? 'bg-primary text-white' : 'hover:bg-neutral-100'} mr-2`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Button>
      );
    }
    
    return (
      <div className="flex justify-center mt-12">
        <nav className="flex items-center">
          <Button
            variant="outline"
            className="w-10 h-10 rounded-full mr-2 hover:bg-neutral-100"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                className="w-10 h-10 rounded-full hover:bg-neutral-100 mr-2"
                onClick={() => handlePageClick(1)}
              >
                1
              </Button>
              {startPage > 2 && <span className="mx-2">...</span>}
            </>
          )}
          
          {pages}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="mx-2">...</span>}
              <Button
                variant="outline"
                className="w-10 h-10 rounded-full hover:bg-neutral-100 mr-2"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            className="w-10 h-10 rounded-full hover:bg-neutral-100"
            disabled={page === totalPages}
            onClick={handleNextPage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </nav>
      </div>
    );
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">Active Giveaways</h2>
          
          {showFilters && (
            <div className="flex space-x-2">
              <Button variant="outline" className="px-4 py-2 bg-white border border-neutral-300 rounded-md flex items-center text-neutral-700 hover:bg-neutral-100 transition-colors">
                <Filter className="mr-2 w-4 h-4" />
                <span>Filter</span>
              </Button>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search giveaways..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(limit)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <Skeleton className="w-full h-48" />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-7 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-5" />
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
          ) : data && data.length > 0 ? (
            data.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-neutral-500">No active giveaways available right now.</p>
              <p className="text-neutral-500 mt-2">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>

        {renderPagination()}
      </div>
    </section>
  );
}
