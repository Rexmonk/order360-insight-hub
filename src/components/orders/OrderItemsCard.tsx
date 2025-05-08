
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { MobileOrder } from "@/types/order";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OrderItemsCardProps {
  order: MobileOrder;
}

const OrderItemsCard = ({ order }: OrderItemsCardProps) => {
  const hasOrderItems = order.orderItems && order.orderItems.length > 0;

  if (!hasOrderItems) return null;

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
          <Package className="h-5 w-5 text-blue-500" />
          Order Items ({order.orderItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.orderItems.map((item, index) => (
          <Card key={index} className="overflow-hidden border-gray-200">
            <CardHeader className="bg-gray-50 py-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-md font-medium">
                    {item.name || (item.productOffering?.name || 'Product Item')}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ID: {item.id.substring(0, 8)}... • Quantity: {item.quantity || 1}
                  </p>
                </div>
                <Badge className={getStatusColor(item.state)}>
                  {getDisplayState(item.state)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Details</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm"><span className="font-medium">Description:</span> {item.description || 'No description'}</p>
                    {item.action && (
                      <p className="text-sm"><span className="font-medium">Action:</span> {item.action}</p>
                    )}
                    {item.businessProcess && (
                      <p className="text-sm"><span className="font-medium">Business Process:</span> {item.businessProcess}</p>
                    )}
                  </div>
                </div>

                {item.productOffering && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Product Offering</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><span className="font-medium">Name:</span> {item.productOffering.name}</p>
                      <p className="text-sm"><span className="font-medium">ID:</span> {item.productOffering.id}</p>
                      <p className="text-sm"><span className="font-medium">Group:</span> {item.productOffering.group}</p>
                      
                      {item.productOffering.categories && item.productOffering.categories.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Categories:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.productOffering.categories.map((cat, i) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {cat.id}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Product characteristics accordion */}
              {item.productOffering?.characteristics && item.productOffering.characteristics.length > 0 && (
                <div className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="characteristics">
                      <AccordionTrigger className="text-sm font-semibold">
                        Product Characteristics ({item.productOffering.characteristics.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {item.productOffering.characteristics.map((char, i) => (
                                <tr key={i}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {char.name}
                                  </td>
                                  <td className="px-3 py-2 whitespace-normal text-sm text-gray-500 max-w-xs break-words">
                                    {char.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {/* Item prices */}
              {item.recurringPrices && item.recurringPrices.length > 0 && (
                <div className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="prices">
                      <AccordionTrigger className="text-sm font-semibold">
                        Item Pricing ({item.recurringPrices.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {item.recurringPrices.map((price, i) => (
                                <tr key={i}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {price.priceType}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {price.name || 'N/A'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {price.price?.currencyCode || '€'} {price.price?.taxIncludedAmount || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderItemsCard;
