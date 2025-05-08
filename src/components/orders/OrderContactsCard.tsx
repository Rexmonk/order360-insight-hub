
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { MobileOrder } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface OrderContactsCardProps {
  order: MobileOrder;
}

const OrderContactsCard = ({ order }: OrderContactsCardProps) => {
  const hasContacts = order.contacts && order.contacts.length > 0;
  
  if (!hasContacts) return null;

  const getContactIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'address':
        return <MapPin className="h-4 w-4" />;
      case 'mobile':
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Phone className="h-5 w-5 text-indigo-500" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.contacts.map((contact, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center gap-2">
                {getContactIcon(contact.type)}
                <h3 className="font-medium capitalize">
                  {contact.type}
                </h3>
                <Badge variant="outline" className="ml-auto bg-white">
                  {contact.role.name}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">ID: {contact.id.substring(0, 8)}...</p>
                {contact.medium && (
                  <div className="mt-1 text-sm">
                    {Object.entries(contact.medium).map(([key, value], i) => (
                      <div key={i} className="mt-1">
                        <span className="font-medium capitalize">{key}: </span>
                        <span className="text-gray-700 break-words">
                          {typeof value === 'object' 
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderContactsCard;
