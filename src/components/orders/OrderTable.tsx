import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order, getOrders } from "@/services/orderService";
import { DateRange } from "react-day-picker";

// Filter form component
const FilterForm = ({ 
  onFilter 
}: { 
  onFilter: (filters: any) => void 
}) => {
  const [searchType, setSearchType] = useState<string>('orderId');
  const [searchValue, setSearchValue] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [businessProcess, setBusinessProcess] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters = {
      searchType: searchValue ? searchType : '',
      search: searchValue,
      channel,
      businessProcess,
      state: status,
      dateFrom: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      dateTo: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
    };
    
    onFilter(filters);
  };

  const resetFilters = () => {
    setSearchType('orderId');
    setSearchValue('');
    setChannel('');
    setBusinessProcess('');
    setStatus('');
    setDateRange({ from: undefined, to: undefined });
    
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-white p-4 rounded-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Filter */}
        <div className="space-y-2 col-span-2">
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="orderId">Order ID</SelectItem>
                  <SelectItem value="partyId">Party ID</SelectItem>
                  <SelectItem value="offeringId">Offering ID</SelectItem>
                  <SelectItem value="profileId">Profile ID</SelectItem>
                  <SelectItem value="salesOrganization">Sales Organization</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Channel Filter */}
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger id="channel">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Channels</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Call Center">Call Center</SelectItem>
              <SelectItem value="Partner">Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Business Process Filter */}
        <div className="space-y-2">
          <Label htmlFor="businessProcess">Business Process</Label>
          <Select value={businessProcess} onValueChange={setBusinessProcess}>
            <SelectTrigger id="businessProcess">
              <SelectValue placeholder="All Processes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Processes</SelectItem>
              <SelectItem value="New Order">New Order</SelectItem>
              <SelectItem value="Change Order">Change Order</SelectItem>
              <SelectItem value="Cancel Order">Cancel Order</SelectItem>
              <SelectItem value="Upgrade">Upgrade</SelectItem>
              <SelectItem value="Downgrade">Downgrade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="Created">Created</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label>Filter by Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-end gap-2 col-span-2">
          <Button type="submit" className="bg-primary hover:bg-primary-600 flex-1">
            Apply Filters
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetFilters}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
};

const OrderTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    const fetchOrders = () => {
      const result = getOrders(currentPage, pageSize, filters);
      setOrders(result.orders);
      setTotalCount(result.totalCount);
    };
    
    fetchOrders();
  }, [currentPage, pageSize, filters]);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handleRowClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying new filters
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  // Generate page links for pagination
  const getPageLinks = () => {
    const links = [];
    
    // Always show first page
    links.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      links.push(
        <PaginationItem key="ellipsis1">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
      
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      links.push(
        <PaginationItem key="ellipsis2">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      links.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return links;
  };

  return (
    <div>
      <FilterForm onFilter={applyFilters} />
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Public Identifier</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Business Process</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Offering ID</TableHead>
              <TableHead>Offering Name</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(order.id)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.publicIdentifier}</TableCell>
                  <TableCell>{order.channel}</TableCell>
                  <TableCell>{order.businessProcess}</TableCell>
                  <TableCell>
                    <span 
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        order.state === 'Completed' && "bg-green-100 text-green-800",
                        order.state === 'In Progress' && "bg-blue-100 text-blue-800",
                        order.state === 'Canceled' && "bg-red-100 text-red-800",
                        order.state === 'Created' && "bg-gray-100 text-gray-800",
                        order.state === 'Accepted' && "bg-purple-100 text-purple-800",
                      )}
                    >
                      {order.state}
                    </span>
                  </TableCell>
                  <TableCell>{order.offeringId}</TableCell>
                  <TableCell>{order.offeringName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{formatDate(order.lastUpdatedDate)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No orders found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalCount > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount} orders
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              
              {getPageLinks()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
