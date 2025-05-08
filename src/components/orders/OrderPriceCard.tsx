
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleDollarSign } from "lucide-react";
import { MobileOrder } from "@/types/order";

interface OrderPriceCardProps {
  order: MobileOrder;
}

const OrderPriceCard = ({ order }: OrderPriceCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price);
  };

  const getRecurringPriceDescription = (occurrence: number | undefined) => {
    if (!occurrence) return "One-time";
    if (occurrence === 1) return "First month";
    if (occurrence === -1) return "Monthly (standard)";
    return `First ${occurrence} months`;
  };

  const hasUpfrontPrice = order.upfrontPrice && 
    order.upfrontPrice.price && 
    (order.upfrontPrice.price.taxIncludedAmount > 0 || order.upfrontPrice.price.dutyFreeAmount > 0);

  const hasRecurringPrices = order.recurringPrices && order.recurringPrices.length > 0;

  if (!hasUpfrontPrice && !hasRecurringPrices) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-emerald-500" />
          Price Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasRecurringPrices && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.recurringPrices.map((price, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium capitalize">
                    {price.priceType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </TableCell>
                  <TableCell>
                    {getRecurringPriceDescription(price.recurringChargeOccurrence)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(price.price.taxIncludedAmount)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {price.paymentMethodRef?.type?.replace(/([A-Z])/g, ' $1').toLowerCase() || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {hasUpfrontPrice && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Upfront Pricing</h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">{formatPrice(order.upfrontPrice.price.taxIncludedAmount)}</p>
              <p className="text-xs text-gray-500">Type: {order.upfrontPrice.priceType}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderPriceCard;
