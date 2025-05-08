
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { MobileOrder } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface OrderTimelineCardProps {
  order: MobileOrder;
}

const OrderTimelineCard = ({ order }: OrderTimelineCardProps) => {
  const hasStateChanges = order.stateChanges && order.stateChanges.length > 0;
  
  if (!hasStateChanges) return null;

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
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
      case "inprogress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      case "created":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "accepted":
      case "acknowledged":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format state for display
  const getDisplayState = (state: string) => {
    if (!state) return "Unknown";
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          Order Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 border-l-2 border-gray-200 space-y-8">
          {order.stateChanges.map((change, index) => (
            <div className="relative" key={index}>
              <div className={`absolute -left-[25px] w-5 h-5 rounded-full flex items-center justify-center
                ${index === 0 ? 'bg-purple-500' : 
                  index === order.stateChanges.length - 1 ? 'bg-green-500' : 'bg-blue-500'}`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {change.validFor?.startDateTime ? 
                    formatDate(change.validFor.startDateTime) : 
                    'Date not specified'}
                </span>
                <Badge className={getStatusColor(change.state)}>
                  {getDisplayState(change.state)}
                </Badge>
              </div>
              
              <h3 className="font-medium">
                {change.description || `Status: ${getDisplayState(change.state)}`}
              </h3>
              
              {change.subStateDescription && (
                <p className="mt-1 text-gray-600 text-sm pl-2 border-l-2 border-gray-200">
                  {change.subStateDescription}
                </p>
              )}
              
              {change.subState && (
                <div className="mt-2 flex">
                  <Badge variant="outline" className="bg-gray-50">
                    {change.subState}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTimelineCard;
