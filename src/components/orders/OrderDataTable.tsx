import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Order, OrderItem, StateItem } from "@/services/orderService";

interface OrderDataTableProps {
  orders: Order[];
}

const OrderDataTable = ({ orders }: OrderDataTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (order: Order) => {
    navigate(`/order-details/${order.id}`, { state: order });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getLastUpdateDate = (stateChanges: StateItem[]): string | null => {
    // Bottom-up parsing: Start from the end and look for the first validFor with a date
    for (let i = stateChanges?.length - 1; i >= 0; i--) {
      const validFor = stateChanges[i].validFor;
      if (validFor) {
        // If both dates are present, prefer endDateTime
        const date = validFor.endDateTime || validFor.startDateTime;
        if (date) {
          return formatDate(date);
        }
      }
    }
    return null; // Return null if no valid date is found
  };

  type ExtractType =
    | "businessProcess"
    | "productOfferingId"
    | "productOfferingName";

  const getUniqueOrderValues = (
    orderItems: OrderItem[],
    type: ExtractType
  ): string => {
    const values = new Set<string>();

    orderItems.forEach((item) => {
      if (type === "businessProcess") {
        const bp = item.businessProcess?.trim();
        if (bp) {
          values.add(bp);
        }
      }

      if (type === "productOfferingId") {
        const poId = item.productOffering?.id?.trim();
        if (poId) {
          values.add(poId);
        }
      }

      if (type === "productOfferingName") {
        const poName = item.productOffering?.name?.trim();
        if (poName) {
          values.add(poName);
        }
      }
    });

    return Array.from(values).join(", ");
  };

  return (
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
            orders.map((order, index) => (
              <TableRow
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(order)}
              >
                <TableCell className="font-medium text-nowrap">
                  {order.id ? order.id : "-"}
                </TableCell>
                <TableCell>
                  {order.publicIdentifier ? order.publicIdentifier : "-"}
                </TableCell>
                <TableCell className="text-nowrap">
                  {order.channel.id || "-"}
                </TableCell>
                <TableCell>
                  {getUniqueOrderValues(order.orderItems, "businessProcess")}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      order.state === "Completed" &&
                        "bg-green-100 text-green-800",
                      order.state === "In Progress" &&
                        "bg-blue-100 text-blue-800",
                      order.state === "Canceled" && "bg-red-100 text-red-800",
                      order.state === "Created" && "bg-gray-100 text-gray-800",
                      order.state === "Accepted" &&
                        "bg-purple-100 text-purple-800"
                    )}
                  >
                    {order.state ? order.state : "-"}
                  </span>
                </TableCell>
                <TableCell>
                  {getUniqueOrderValues(
                    order.orderItems,
                    "productOfferingId"
                  ) || "-"}
                </TableCell>
                <TableCell>
                  {getUniqueOrderValues(
                    order.orderItems,
                    "productOfferingName"
                  ) || "-"}
                </TableCell>
                <TableCell className="text-nowrap">
                  {order?.stateChanges?.[0]?.validFor?.startDateTime
                    ? formatDate(
                        order?.stateChanges?.[0]?.validFor?.startDateTime
                      )
                    : "-"}
                </TableCell>
                <TableCell className="text-nowrap">
                  {getLastUpdateDate(order?.stateChanges) || "-"}
                </TableCell>
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
  );
};

export default OrderDataTable;
