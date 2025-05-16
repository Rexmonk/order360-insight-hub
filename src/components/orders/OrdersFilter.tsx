import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  BUSINESS_PROCESS_FILTER_OPTIONS,
  CHANNEL_FILTER_OPTIONS,
  ORDER_FILTER_OPTIONS,
  ORDER_FILTER_SEARCH_DD,
} from "@/constants/uiConstants";

interface OrderFilters {
  searchType?: string;
  search?: string;
  channel?: string;
  businessProcess?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface FilterFormProps {
  onFilter: (filters: OrderFilters) => void;
  initialFilters: OrderFilters;
}

const OrderFilterForm = ({ onFilter, initialFilters }: FilterFormProps) => {
  const [searchType, setSearchType] = useState<string>(
    initialFilters.searchType || "orderId"
  );
  const [searchValue, setSearchValue] = useState<string>(
    initialFilters.search || ""
  );
  const [channel, setChannel] = useState<string>(
    initialFilters.channel || "all"
  );
  const [businessProcess, setBusinessProcess] = useState<string>(
    initialFilters.businessProcess || "all"
  );
  const [status, setStatus] = useState<string>(initialFilters.state || "all");
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const range: DateRange = {
      from: undefined,
      to: undefined,
    };

    if (initialFilters.dateFrom) {
      const fromDate = parse(initialFilters.dateFrom, "yyyy-MM-dd", new Date());
      if (isValid(fromDate)) {
        range.from = fromDate;
      }
    }

    if (initialFilters.dateTo) {
      const toDate = parse(initialFilters.dateTo, "yyyy-MM-dd", new Date());
      if (isValid(toDate)) {
        range.to = toDate;
      }
    }

    return range;
  });

  // Check if other filters should be disabled (when Order ID is selected)
  const shouldDisableOtherFilters =
    searchType === "orderId" && searchValue.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If searching by Order ID and there's a value, reset other filters
    const filters = {
      searchType: searchValue ? searchType : "",
      search: searchValue,
      // Only include other filters if not searching by Order ID with a value
      channel: shouldDisableOtherFilters
        ? ""
        : channel !== "all"
        ? channel
        : "",
      businessProcess: shouldDisableOtherFilters
        ? ""
        : businessProcess !== "all"
        ? businessProcess
        : "",
      state: shouldDisableOtherFilters ? "" : status !== "all" ? status : "",
      dateFrom: shouldDisableOtherFilters
        ? ""
        : dateRange.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : "",
      dateTo: shouldDisableOtherFilters
        ? ""
        : dateRange.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : "",
    };

    // If Order ID is selected with a value, reset the filter form's state for other filters
    if (shouldDisableOtherFilters) {
      setChannel("all");
      setBusinessProcess("all");
      setStatus("all");
      setDateRange({ from: undefined, to: undefined });
    }

    onFilter(filters);
  };

  const resetFilters = () => {
    setSearchType("orderId");
    setSearchValue("");
    setChannel("all");
    setBusinessProcess("all");
    setStatus("all");
    setDateRange({ from: undefined, to: undefined });

    onFilter({});
  };

  // Handle search type change - reset other filters if Order ID is selected
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);

    // If switching to Order ID, keep current filters but they'll be disabled if a search value is entered
    // If switching away from Order ID with disabled filters, keep them reset
    if (value !== "orderId" && shouldDisableOtherFilters) {
      // We were using Order ID search before, reset these filters explicitly
      setChannel("all");
      setBusinessProcess("all");
      setStatus("all");
      setDateRange({ from: undefined, to: undefined });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mb-6 bg-white p-4 rounded-md border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Filter */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="channel">Search</Label>
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={handleSearchTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ORDER_FILTER_SEARCH_DD.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.selectItem}
                    </SelectItem>
                  ))}
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
          <Select
            value={channel}
            onValueChange={setChannel}
            disabled={shouldDisableOtherFilters}
          >
            <SelectTrigger
              id="channel"
              className={
                shouldDisableOtherFilters ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {CHANNEL_FILTER_OPTIONS.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.selectItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Process Filter */}
        <div className="space-y-2">
          <Label htmlFor="businessProcess">Business Process</Label>
          <Select
            value={businessProcess}
            onValueChange={setBusinessProcess}
            disabled={shouldDisableOtherFilters}
          >
            <SelectTrigger
              id="businessProcess"
              className={
                shouldDisableOtherFilters ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <SelectValue placeholder="All Processes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              {BUSINESS_PROCESS_FILTER_OPTIONS.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.selectItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={setStatus}
            disabled={shouldDisableOtherFilters}
          >
            <SelectTrigger
              id="status"
              className={
                shouldDisableOtherFilters ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_FILTER_OPTIONS.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.selectItem}
                </SelectItem>
              ))}
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
                  !dateRange.from && "text-muted-foreground",
                  shouldDisableOtherFilters && "opacity-50 cursor-not-allowed"
                )}
                disabled={shouldDisableOtherFilters}
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
                disabled={shouldDisableOtherFilters}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end gap-2 col-span-2">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-600 flex-1"
          >
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

export default OrderFilterForm;
export type { OrderFilters };
