
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { MobileOrder } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface OrderCharacteristicsCardProps {
  order: MobileOrder;
}

const OrderCharacteristicsCard = ({ order }: OrderCharacteristicsCardProps) => {
  const hasCharacteristics = order.characteristics && order.characteristics.length > 0;
  
  if (!hasCharacteristics) return null;

  // Group characteristics by type/category
  const groupCharacteristics = () => {
    const groups: {[key: string]: typeof order.characteristics} = {
      'order': [],
      'tracking': [],
      'technical': [],
      'other': []
    };
    
    order.characteristics?.forEach(char => {
      if (char.name.toLowerCase().includes('utm_') || 
          char.name.toLowerCase().includes('track')) {
        groups['tracking'].push(char);
      } else if (char.name.toLowerCase().includes('type') || 
                char.name.toLowerCase().includes('version') || 
                char.name.toLowerCase().includes('id') ||
                char.name.toLowerCase().includes('url')) {
        groups['order'].push(char);
      } else if (char.name.toLowerCase().includes('verification') || 
                char.name.toLowerCase().includes('ecare')) {
        groups['technical'].push(char);
      } else {
        groups['other'].push(char);
      }
    });
    
    return groups;
  };
  
  const characteristicGroups = groupCharacteristics();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-500" />
          Order Characteristics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(characteristicGroups).map(([groupName, chars]) => {
            if (chars.length === 0) return null;
            
            return (
              <div key={groupName} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="font-medium mb-2 capitalize flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">
                    {groupName}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {chars.map((char, i) => (
                    <div key={i} className="bg-white p-2 rounded-sm border border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{char.name}</p>
                      <p className="text-sm text-gray-600 break-words">{char.value}</p>
                      {char.valueType && (
                        <p className="text-xs text-gray-400">Type: {char.valueType}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCharacteristicsCard;
