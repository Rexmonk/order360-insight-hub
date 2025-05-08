
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { MobileOrder } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface OrderRelatedPartiesCardProps {
  order: MobileOrder;
}

const OrderRelatedPartiesCard = ({ order }: OrderRelatedPartiesCardProps) => {
  const hasRelatedParties = order.relatedParties && order.relatedParties.length > 0;
  
  if (!hasRelatedParties) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          Related Parties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.relatedParties.map((party, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  ID: {party.id}
                </h3>
                {party.role && (
                  <Badge variant="outline" className="bg-white">
                    {party.role}
                  </Badge>
                )}
              </div>
              {party.entityReferredType && (
                <p className="text-sm text-gray-500 mt-1">
                  Type: {party.entityReferredType}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderRelatedPartiesCard;
