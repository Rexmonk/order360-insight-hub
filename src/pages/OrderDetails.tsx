
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '@/services/orderService';
import Layout from '@/components/layout/Layout';
import OrderDetailsView from '@/components/orders/OrderDetailsView';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Sample JSON data for demonstration (in a real app this would come from an API)
const sampleOrderData = {
  "id": "1ab51664-a00b-43c1-93ee-903eaf12c981",
  "externalId": "f4015ad3-ebbd-4980-9fe1-20bf483d2a8a",
  "publicIdentifier": "2246767161",
  "state": "acknowledged",
  "stateDescription": "Order acknowledged",
  "orderCaptureDate": "2025-05-06T11:49:37.17725Z",
  "channel": {
      "id": "MagentaView",
      "name": "MagentaView"
  },
  "relatedParties": [
      {
          "entityReferredType": "Party",
          "id": "9P700",
          "role": "salesOrganisation"
      },
      {
          "entityReferredType": "Party",
          "id": "VM2352",
          "role": "salesRepresentative"
      },
      {
          "entityReferredType": "Party",
          "id": "CCIn",
          "role": "subChannel"
      },
      {
          "entityReferredType": "Party",
          "id": "21",
          "role": "salesChannel"
      },
      {
          "entityReferredType": "Party",
          "id": "1002194",
          "role": "salesPartnerNumber"
      },
      {
          "entityReferredType": "Party",
          "id": "d448f8cc-c41b-4771-98c6-f9809e715c91"
      },
      {
          "entityReferredType": "Party",
          "id": "TEMP_683ca952-fc1f-4e9b-b94a-4e8b1760de82",
          "role": "owner"
      }
  ],
  "orderItems": [
      {
          "id": "c2ac1e3d2f7c4fec9708011c493ee032",
          "description": "Auftrag eingegangen",
          "state": "acknowledged",
          "subStateDescription": "",
          "action": "add",
          "businessProcess": "acquisition",
          "quantity": 1,
          "productOffering": {
              "id": "FN_89843265_89843278",
              "name": "MagentaZuhause S",
              "group": "tariff"
          }
      }
  ],
  "stateChanges": [
      {
          "id": "1ab51664-a00b-43c1-93ee-903eaf12c981",
          "state": "acknowledged",
          "description": "Auftrag eingegangen",
          "subStateDescription": "",
          "validFor": {
              "startDateTime": "2025-05-06T11:49:37.17725Z"
          }
      },
      {
          "id": "1ab51664-a00b-43c1-93ee-903eaf12c981",
          "state": "inProgress",
          "description": "Auftrag ist in Bearbeitung",
          "subStateDescription": "Den Ausführungstermin finden Sie unten in den Details unter \"Ausführung\"."
      },
      {
          "id": "1ab51664-a00b-43c1-93ee-903eaf12c981",
          "state": "inProgress",
          "description": "Der Telekom Aussendienst kommt zu Ihnen",
          "subState": "technicianFinished",
          "subStateDescription": ""
      },
      {
          "id": "1ab51664-a00b-43c1-93ee-903eaf12c981",
          "state": "completed",
          "description": "Auftrag wird abgeschlossen",
          "subStateDescription": ""
      }
  ]
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demonstration, we'll use both the mock service and our sample JSON data
    const fetchOrderDetails = async () => {
      try {
        // First try to get data from the order service
        if (id) {
          const orderData = getOrderById(id);
          
          if (orderData) {
            // Transform the service data to match our expected format
            const transformedOrder = {
              ...orderData,
              // Add properties from sample data that might not exist in our service
              externalId: orderData.id,
              stateDescription: `Order ${orderData.state.toLowerCase()}`,
              orderCaptureDate: orderData.orderDate,
              channel: { id: orderData.channel, name: orderData.channel },
              orderItems: [
                {
                  id: `item-${orderData.id}`,
                  description: orderData.offeringName,
                  state: orderData.state.toLowerCase(),
                  action: "add",
                  businessProcess: orderData.businessProcess.toLowerCase(),
                  quantity: 1,
                  productOffering: {
                    id: orderData.offeringId,
                    name: orderData.offeringName,
                    group: "tariff"
                  }
                }
              ],
              stateChanges: [
                {
                  id: orderData.id,
                  state: orderData.state.toLowerCase(),
                  description: `Order ${orderData.state.toLowerCase()}`,
                  validFor: {
                    startDateTime: orderData.orderDate
                  }
                }
              ]
            };
            setOrder(transformedOrder);
          } else {
            // Fallback to sample data (simulating API)
            setOrder(sampleOrderData);
          }
        } else {
          setError("No order ID provided");
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error retrieving order details');
        // Fallback to sample data on error (for demo)
        setOrder(sampleOrderData);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-2"></div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Unable to retrieve order details'}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <OrderDetailsView order={order} />
    </Layout>
  );
};

export default OrderDetails;
