import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Order, getOrders } from "@/services/orderService";
import OrderFilterForm from "./OrdersFilter";
import OrderDataTable from "./OrderDataTable";
import OrderPagination from "./OrderPagination";

const OrderTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const size = searchParams.get("pageSize");
    return size ? parseInt(size, 10) : 10;
  });
  const [filters, setFilters] = useState(() => {
    // Initialize filters from URL query parameters
    const initialFilters: Record<string, string> = {};

    // Map search params to filter object
    if (searchParams.has("searchType"))
      initialFilters.searchType = searchParams.get("searchType") || "";
    if (searchParams.has("search"))
      initialFilters.search = searchParams.get("search") || "";
    if (searchParams.has("channel"))
      initialFilters.channel = searchParams.get("channel") || "";
    if (searchParams.has("businessProcess"))
      initialFilters.businessProcess =
        searchParams.get("businessProcess") || "";
    if (searchParams.has("state"))
      initialFilters.state = searchParams.get("state") || "";
    if (searchParams.has("dateFrom"))
      initialFilters.dateFrom = searchParams.get("dateFrom") || "";
    if (searchParams.has("dateTo"))
      initialFilters.dateTo = searchParams.get("dateTo") || "";

    return initialFilters;
  });

  // Update URL with current filters, page, and pageSize
  useEffect(() => {
    const params = new URLSearchParams();

    // Add page parameter
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    // Add pageSize parameter if not the default
    if (pageSize !== 10) {
      params.set("pageSize", pageSize.toString());
    }

    // Add filter parameters if they have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Update the URL without causing navigation
    setSearchParams(params, { replace: true });
  }, [currentPage, pageSize, filters, setSearchParams]);

  useEffect(() => {
    const fetchOrders = () => {
      getOrders(currentPage, pageSize, filters).then((response) => {
        setOrders(response.orders);
        setTotalCount(response.totalCount);
      });
    };

    fetchOrders();
  }, [currentPage, pageSize, filters]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    // Reset to first page when changing page size to avoid empty results
    setCurrentPage(1);
  };

  const applyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying new filters
  };

  return (
    <div>
      <OrderFilterForm onFilter={applyFilters} initialFilters={filters} />
      <OrderDataTable orders={orders} />

      {totalCount > 0 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default OrderTable;
