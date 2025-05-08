
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, CircleCheck, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import { MobileOrder } from "@/types/order";

interface OrderSummaryCardProps {
  order: MobileOrder;
}

const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "in progress":
      case "inprogress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "canceled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "created":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "accepted":
      case "acknowledged":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CircleCheck className="h-5 w-5 text-green-600" />;
      case "in progress":
      case "inprogress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "canceled":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-purple-600" />;
    }
  };

  // Format state for display
  const getDisplayState = (state: string) => {
    if (!state) return "Unknown";
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  };

  const getChannelId = () => {
    if (typeof order.channel === "string") {
      return order.channel;
    }
    return order.channel?.id || "Unknown Channel";
  };

  return (
    <Card className="overflow-hidden border-gray-200">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                Order {order.publicIdentifier}
              </CardTitle>
              <Badge className={getStatusColor(order.state)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.state)}
                  {getDisplayState(order.state)}
                </span>
              </Badge>
            </div>
            <CardDescription>
              ID: {order.id.substring(0, 8)}...
            </CardDescription>
          </div>
          
          <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              Created: {formatDate(order.orderCaptureDate)}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              Channel: {getChannelId()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {order.stateDescription && (
          <div className="px-6 py-3 bg-gray-50 border-t border-b border-gray-200">
            <p className="text-sm font-medium">{order.stateDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
