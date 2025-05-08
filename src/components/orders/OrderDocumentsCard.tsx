
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { MobileOrder } from "@/types/order";

interface OrderDocumentsCardProps {
  order: MobileOrder;
}

const OrderDocumentsCard = ({ order }: OrderDocumentsCardProps) => {
  const hasDocuments = order.documents && order.documents.length > 0;
  
  if (!hasDocuments) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-sky-500" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.documents.map((doc, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center">
              <FileText className="h-10 w-10 text-gray-400 mr-3" />
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <p className="text-sm text-gray-500">ID: {doc.id.substring(0, 8)}...</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDocumentsCard;
