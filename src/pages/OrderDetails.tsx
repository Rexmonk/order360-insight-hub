
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getOrder } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShipmentTrackingDrawer from "@/components/orders/ShipmentTrackingDrawer";
import SalesCommissionDrawer from "@/components/orders/SalesCommissionDrawer";
import ProductInventoryDrawer from "@/components/orders/ProductInventoryDrawer";
import CustomerDataDrawer from "@/components/orders/CustomerDataDrawer";
import AddressManagementDrawer from "@/components/orders/AddressManagementDrawer";
import ProductCatalogDrawer from "@/components/orders/ProductCatalogDrawer";
import { Toaster } from "@/components/ui/toaster";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-purple-100 text-purple-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <Toaster />
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      ) : order ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-0 h-9 w-9"
              >
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Primary buttons */}
              <Button 
                variant="default"
                onClick={() => navigate(`/bpmn-diagram/${id}`)}
              >
                View Order Flow
              </Button>
              <ShipmentTrackingDrawer orderId={id} />
              
              {/* Secondary Actions in Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">More Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Additional Information</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <ProductInventoryDrawer orderId={id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <CustomerDataDrawer orderId={id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SalesCommissionDrawer orderId={id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <AddressManagementDrawer orderId={id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ProductCatalogDrawer orderId={id} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>General order information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p>{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Channel</p>
                    <p>{order.channel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Process</p>
                    <p>{order.businessProcess}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{order.customerPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Products in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 flex flex-col items-center">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        {index < order.timeline.length - 1 && <div className="flex-1 w-0.5 bg-gray-200 my-1"></div>}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}
                        </p>
                        <p className="font-medium capitalize">{event.status}</p>
                        <p className="text-sm">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center flex-col gap-4">
          <p className="text-xl">Order not found</p>
          <Button onClick={() => navigate('/order-overview')}>
            Back to Orders
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default OrderDetails;
