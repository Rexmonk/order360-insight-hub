
import { format } from "date-fns";
import { Truck } from "lucide-react";
import { 
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ShipmentTracking } from "@/types/shipment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for the shipment tracking
const mockShipmentTracking: ShipmentTracking[] = [
  {
    id: "ST12345",
    href: "string",
    carrier: "FedEx Express",
    trackingCode: "FDX9876543210",
    carrierTrackingUrl: "https://www.fedex.com/track/9876543210",
    trackingDate: "2025-05-16T09:33:38.708Z",
    status: "in-transit",
    statusChangeDate: "2025-05-16T09:33:38.708Z",
    statusChangeReason: "Package in transit to delivery location",
    weight: 1.5,
    estimatedDeliveryDate: "2025-05-18T16:00:00.000Z",
    addressFrom: {
      id: "ADR-001",
      href: "string",
      fullAddressName: "Central Warehouse",
      streetName: "Distribution Road",
      streetNr: "100",
      city: "Atlanta",
      stateOrProvince: "GA",
      country: "USA",
      postcode: "30301"
    },
    addressTo: {
      id: "ADR-002",
      href: "string",
      fullAddressName: "Customer Address",
      streetName: "Main Street",
      streetNr: "123",
      city: "Boston",
      stateOrProvince: "MA",
      country: "USA",
      postcode: "02108"
    },
    checkpoint: [
      {
        status: "picked-up",
        message: "Package picked up",
        date: "2025-05-14T10:23:45.000Z",
        checkPost: "Atlanta Hub",
        city: "Atlanta",
        stateOrProvince: "GA",
        country: "USA",
        characteristics: []
      },
      {
        status: "in-transit",
        message: "Package departed facility",
        date: "2025-05-14T16:45:22.000Z",
        checkPost: "Atlanta Hub",
        city: "Atlanta",
        stateOrProvince: "GA",
        country: "USA",
        characteristics: []
      },
      {
        status: "in-transit",
        message: "Package arrived at sorting facility",
        date: "2025-05-15T08:30:15.000Z",
        checkPost: "Chicago Hub",
        city: "Chicago",
        stateOrProvince: "IL",
        country: "USA",
        characteristics: []
      },
      {
        status: "in-transit",
        message: "Package departed facility",
        date: "2025-05-15T14:22:10.000Z",
        checkPost: "Chicago Hub",
        city: "Chicago",
        stateOrProvince: "IL",
        country: "USA",
        characteristics: []
      },
      {
        status: "in-transit",
        message: "Package arrived at destination facility",
        date: "2025-05-16T07:15:32.000Z",
        checkPost: "Boston Distribution Center",
        city: "Boston",
        stateOrProvince: "MA",
        country: "USA",
        characteristics: []
      }
    ],
    order: [
      {
        id: "ORD12345",
        href: "string",
        name: "Customer Order",
        referredType: "CustomerOrder"
      }
    ],
    relatedCustomer: {
      id: "CUST-789",
      href: "string",
      name: "John Doe",
      description: "Premium customer"
    },
    createDate: "2025-05-14T09:15:22.000Z",
    characteristics: [],
    shippingOrderItems: [
      {
        id: 1,
        name: "APP iPhone 15 128GB Blue",
        characteristics: [],
        relatedEntities: []
      }
    ]
  }
];

interface ShipmentTrackingDrawerProps {
  orderId?: string;
}

const ShipmentTrackingDrawer = ({ orderId }: ShipmentTrackingDrawerProps) => {
  const shipments = mockShipmentTracking;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-transit":
      case "intransit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "picked-up":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatAddress = (address: any) => {
    const parts = [];
    if (address.fullAddressName) parts.push(address.fullAddressName);
    if (address.streetNr || address.streetName) {
      let street = "";
      if (address.streetNr) street += address.streetNr;
      if (address.streetName) street += " " + address.streetName;
      parts.push(street.trim());
    }
    if (address.city) parts.push(address.city);
    if (address.stateOrProvince) parts.push(address.stateOrProvince);
    if (address.postcode) parts.push(address.postcode);
    if (address.country) parts.push(address.country);
    
    return parts.join(", ");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Truck className="mr-2 h-4 w-4" />
          Shipment Tracking
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl">Shipment Tracking</DrawerTitle>
          <DrawerDescription>
            Tracking information for order {orderId || ""}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[80vh] px-4">
          {shipments.length > 0 ? (
            <div className="space-y-6 pb-10">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="space-y-4">
                  {/* Shipment Overview */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Shipment Details
                        </CardTitle>
                        <Badge className={getStatusColor(shipment.status)}>
                          {shipment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                          <p className="font-medium">{shipment.trackingCode}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Carrier</p>
                          <p>{shipment.carrier}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Weight</p>
                          <p>{shipment.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tracking Date</p>
                          <p>{formatDate(shipment.trackingDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                          <p>{formatDate(shipment.estimatedDeliveryDate)}</p>
                        </div>
                        {shipment.carrierTrackingUrl && (
                          <div className="col-span-2">
                            <a 
                              href={shipment.carrierTrackingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline"
                            >
                              View on carrier website
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Items */}
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {shipment.shippingOrderItems.map((item) => (
                          <div key={item.id} className="p-3 border rounded-md">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Item ID: {item.id}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Address Details */}
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">Shipping Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">From</h3>
                          <p className="whitespace-pre-wrap">
                            {formatAddress(shipment.addressFrom)}
                          </p>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h3 className="font-semibold mb-2">To</h3>
                          <p className="whitespace-pre-wrap">
                            {formatAddress(shipment.addressTo)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tracking Timeline */}
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">Tracking History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
                        {shipment.checkpoint.map((checkpoint, index) => (
                          <div className="relative" key={`${checkpoint.status}-${index}`}>
                            <div className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                              index === 0 ? "bg-primary" : "bg-gray-400"
                            }`}>
                            </div>
                            <div className="mb-1 text-sm text-gray-500">
                              {formatDate(checkpoint.date)}
                            </div>
                            <Badge className={`mb-2 ${getStatusColor(checkpoint.status)}`}>
                              {checkpoint.status.toUpperCase()}
                            </Badge>
                            <h3 className="font-medium">{checkpoint.message}</h3>
                            <p className="text-sm text-gray-600">
                              {checkpoint.checkPost}, {checkpoint.city}, {checkpoint.stateOrProvince}, {checkpoint.country}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Information */}
                  {shipment.relatedCustomer && (
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 border rounded-md">
                          <p className="font-medium">{shipment.relatedCustomer.name}</p>
                          <p className="text-sm text-gray-500">ID: {shipment.relatedCustomer.id}</p>
                          {shipment.relatedCustomer.description && (
                            <p className="text-sm text-gray-500">{shipment.relatedCustomer.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No shipment tracking information available.</p>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default ShipmentTrackingDrawer;
