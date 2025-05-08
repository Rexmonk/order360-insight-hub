import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import Layout from "@/components/layout/Layout";
import OrderDetailsView from "@/components/orders/OrderDetailsView";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Sample JSON data for demonstration (in a real app this would come from an API)
const sampleOrderData = {
  id: "f8a24dbe-7139-4744-8de4-5f320d66b2f3",
  publicIdentifier: "3009313235729",
  orderType: "B2KA",
  state: "acknowledged",
  stateDescription: "",
  orderCaptureDate: "2025-03-22T18:05:27.070131003Z",
  channel: {
    id: "OneApp",
  },
  orderItems: [
    {
      id: "01",
      description: "Auftrag eingegangen",
      state: "acknowledged",
      subStateDescription: "",
      action: "add",
      businessProcess: "addonManagement",
      product: {
        id: "MF_1632078716",
      },
      productOffering: {
        id: "DP_GDPDFF04",
      },
      stateChanges: [
        {
          id: "01",
          state: "acknowledged",
          description: "Auftrag eingegangen",
          subStateDescription: "",
          validFor: {
            startDateTime: "2025-03-22T18:05:27.072657402Z",
          },
        },
      ],
    },
    {
      id: "02",
      description: "Auftrag eingegangen",
      state: "acknowledged",
      subStateDescription: "",
      action: "add",
      businessProcess: "addonManagement",
      product: {
        id: "MF_1632078798",
      },
      productOffering: {
        id: "MF_GDPDFF04",
      },
      stateChanges: [
        {
          id: "02",
          state: "acknowledged",
          description: "Auftrag eingegangen",
          subStateDescription: "",
          validFor: {
            startDateTime: "2025-03-22T18:05:27.072706793Z",
          },
        },
      ],
    },
  ],
  characteristics: [
    {
      name: "eCare.kkmNumber",
      valueType: "string",
      value: "3009313235729",
    },
  ],
  stateChanges: [
    {
      id: "f8a24dbe-7139-4744-8de4-5f320d66b2f3",
      state: "acknowledged",
      description: "Auftrag eingegangen",
      subStateDescription: "",
      validFor: {
        startDateTime: "2025-03-22T18:05:27.070131003Z",
      },
    },
    {
      id: "f8a24dbe-7139-4744-8de4-5f320d66b2f3",
      state: "inProgress",
      description: "Auftrag ist in Bearbeitung",
      subStateDescription:
        'Den Ausführungstermin finden Sie unten in den Details unter "Ausführung".',
    },
    {
      id: "f8a24dbe-7139-4744-8de4-5f320d66b2f3",
      state: "completed",
      description: "Auftrag wird abgeschlossen",
      subStateDescription: "",
    },
  ],
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
                    group: "tariff",
                  },
                },
              ],
              stateChanges: [
                {
                  id: orderData.id,
                  state: orderData.state.toLowerCase(),
                  description: `Order ${orderData.state.toLowerCase()}`,
                  validFor: {
                    startDateTime: orderData.orderDate,
                  },
                },
              ],
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
        console.error("Error fetching order:", err);
        setError("Error retrieving order details");
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
            {error || "Unable to retrieve order details"}
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
