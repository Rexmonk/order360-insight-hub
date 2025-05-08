
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '@/services/orderService';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MobileOrder } from '@/types/order';

// Import all order detail components
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import OrderPriceCard from '@/components/orders/OrderPriceCard';
import OrderItemsCard from '@/components/orders/OrderItemsCard';
import OrderTimelineCard from '@/components/orders/OrderTimelineCard';
import OrderCharacteristicsCard from '@/components/orders/OrderCharacteristicsCard';
import OrderContactsCard from '@/components/orders/OrderContactsCard';
import OrderRelatedPartiesCard from '@/components/orders/OrderRelatedPartiesCard';
import OrderDocumentsCard from '@/components/orders/OrderDocumentsCard';

// Sample mobile order JSON
const sampleMobileOrderData: MobileOrder = {
  "id": "954386e3-a3e9-4445-9b3a-863760e8fc68",
  "externalId": "a52495a0-bc8d-4b4c-a8a3-ae6610cc7073",
  "publicIdentifier": "2246727552",
  "state": "acknowledged",
  "stateDescription": "Order acknowledged",
  "orderCaptureDate": "2025-04-15T12:10:59.846647242Z",
  "channel": {
    "id": "OneShop"
  },
  "relatedParties": [
    {
      "id": "aef24ee9-a7b0-4e28-968b-f167f9e21e63",
      "role": "owner"
    },
    {
      "entityReferredType": "Party",
      "id": "OS000",
      "role": "salesOrganisation"
    }
  ],
  "contacts": [
    {
      "id": "b0dc298a-b527-4c00-84c1-088172e82a73",
      "type": "mobile",
      "role": {
        "name": "main"
      }
    },
    {
      "id": "79f47a87-a5cd-490d-b703-7e21ded50971",
      "type": "address",
      "role": {
        "name": "main"
      }
    },
    {
      "id": "873a5bc1-ae46-45ed-87eb-a793b1499c31",
      "type": "email",
      "role": {
        "name": "main"
      }
    },
    {
      "id": "6d178adc-dd7f-4e68-a800-8e44b47b2cbd",
      "type": "address",
      "role": {
        "name": "goodsDelivery"
      }
    },
    {
      "id": "b422debe-d626-4ab3-917d-1e114cd4e32e",
      "type": "address",
      "role": {
        "name": "billing"
      }
    }
  ],
  "upfrontPrice": {
    "priceType": "upfrontPrice",
    "price": {
      "taxIncludedAmount": 0,
      "dutyFreeAmount": 0
    },
    "priceAlterations": [
      {
        "price": {}
      }
    ],
    "paymentMethodRef": {}
  },
  "recurringPrices": [
    {
      "priceType": "recurringFee",
      "recurringChargePeriod": "month",
      "recurringChargeDuration": 1,
      "recurringChargeOccurrence": 1,
      "price": {
        "taxIncludedAmount": 39.95,
        "dutyFreeAmount": 0
      },
      "paymentMethodRef": {
        "id": "67b9e3c2-b8fc-4939-b074-ba3728cae191",
        "type": "bankAccountDebit"
      }
    },
    {
      "priceType": "recurringFee",
      "recurringChargePeriod": "month",
      "recurringChargeDuration": 1,
      "recurringChargeOccurrence": -1,
      "price": {
        "taxIncludedAmount": 49.95,
        "dutyFreeAmount": 0
      },
      "paymentMethodRef": {
        "id": "67b9e3c2-b8fc-4939-b074-ba3728cae191",
        "type": "bankAccountDebit"
      }
    }
  ],
  "orderItems": [
    {
      "id": "8de53ecb9e4c40c7a606c8fb24aa864c",
      "name": "MagentaMobil M 5. Gen",
      "description": "Auftrag eingegangen",
      "state": "acknowledged",
      "subStateDescription": "",
      "action": "add",
      "businessProcess": "acquisition",
      "quantity": 1,
      "product": {},
      "productOffering": {
        "id": "MF_15476",
        "name": "MagentaMobil M 5. Gen",
        "group": "tariff",
        "characteristics": [
          {
            "name": "selectedProductOfferingTerm",
            "value": "agreement24",
            "productSpecCharRelationship": []
          },
          {
            "name": "DataVolumePostpaid5GLTE",
            "value": "1",
            "productSpecCharRelationship": []
          },
          {
            "name": "telefonie_sms",
            "value": "2",
            "productSpecCharRelationship": []
          },
          {
            "name": "AGB_ID",
            "value": "2199",
            "productSpecCharRelationship": []
          },
          {
            "name": "additionalShortDescription",
            "value": "Unbegrenztes Datenvolumen mit MagentaEINS | LTE Max und 5G",
            "productSpecCharRelationship": []
          },
          {
            "name": "isEsimEligible",
            "value": "true",
            "productSpecCharRelationship": []
          }
        ],
        "categories": [
          { "id": "MOBILEPOSTPAID" },
          { "id": "mobile" },
          { "id": "postpaid" },
          { "id": "smartphone-tarife" },
          { "id": "voice" }
        ]
      },
      "recurringPrices": [
        {
          "id": "MF_15476-OTC-Price",
          "name": "oneTimeTariffFee",
          "priceType": "activationFee",
          "recurringChargePeriod": "month",
          "recurringChargeDuration": 1,
          "recurringChargeOccurrence": 1,
          "unitOfMeasure": {},
          "price": {
            "currencyCode": "EUR",
            "taxIncludedAmount": 39.95,
            "dutyFreeAmount": 0
          },
          "characteristics": []
        },
        {
          "id": "MF_15476-MRC-Price",
          "name": "monthlyTariffFee",
          "priceType": "recurringFee",
          "recurringChargePeriod": "month",
          "recurringChargeDuration": 1,
          "recurringChargeOccurrence": -1,
          "unitOfMeasure": {},
          "price": {
            "currencyCode": "EUR",
            "taxIncludedAmount": 49.95,
            "dutyFreeAmount": 0
          },
          "characteristics": []
        }
      ],
      "stateChanges": [
        {
          "id": "8de53ecb9e4c40c7a606c8fb24aa864c",
          "state": "acknowledged",
          "description": "Auftrag eingegangen",
          "subStateDescription": "",
          "validFor": {
            "startDateTime": "2025-04-15T12:10:59.848755123Z"
          }
        }
      ]
    },
    {
      "id": "461843676827476ebc548ee3928cf5a8",
      "name": "std_dlv_1",
      "description": "Auftrag eingegangen",
      "state": "acknowledged",
      "subStateDescription": "",
      "action": "add",
      "quantity": 1,
      "product": {},
      "productOffering": {
        "id": "std_dlv_offe",
        "name": "std_dlv_1",
        "group": "deliveryMethod",
        "characteristics": []
      },
      "upfrontPrice": {
        "id": "test",
        "name": "basePrice",
        "priceType": "upfrontPrice",
        "unitOfMeasure": {},
        "price": {
          "currencyCode": "EUR",
          "taxIncludedAmount": 0,
          "dutyFreeAmount": 0
        }
      },
      "stateChanges": [
        {
          "id": "461843676827476ebc548ee3928cf5a8",
          "state": "acknowledged",
          "description": "Auftrag eingegangen",
          "subStateDescription": "",
          "validFor": {
            "startDateTime": "2025-04-15T12:10:59.848790994Z"
          }
        }
      ]
    },
    {
      "id": "c418dcd3f89f40d8b759452770175072",
      "name": "ebill",
      "description": "Auftrag eingegangen",
      "state": "acknowledged",
      "subStateDescription": "",
      "action": "add",
      "quantity": 1,
      "product": {},
      "productOffering": {
        "id": "bill_dlv_1",
        "name": "ebill",
        "group": "billDeliveryMethod",
        "characteristics": []
      },
      "stateChanges": [
        {
          "id": "c418dcd3f89f40d8b759452770175072",
          "state": "acknowledged",
          "description": "Auftrag eingegangen",
          "subStateDescription": "",
          "validFor": {
            "startDateTime": "2025-04-15T12:10:59.848798884Z"
          }
        }
      ]
    }
  ],
  "relatedEntities": [
    {
      "entityType": "shoppingCart",
      "relationType": "isChildOf",
      "relatedEntityId": "67f8df32f073cb614cf65869"
    }
  ],
  "characteristics": [
    {
      "name": "cartType",
      "valueType": "string",
      "value": "acquisition"
    },
    {
      "name": "PaymentVersion",
      "valueType": "string",
      "value": "V2"
    },
    {
      "name": "orderURL",
      "valueType": "string",
      "value": "nulla52495a0-bc8d-4b4c-a8a3-ae6610cc7073"
    },
    {
      "name": "utm_sales_organisation",
      "valueType": "string",
      "value": "OS000"
    },
    {
      "name": "utm_advertising_banner",
      "valueType": "string",
      "value": "A123"
    },
    {
      "name": "identificationVerificationType",
      "valueType": "string",
      "value": "offline"
    },
    {
      "name": "eCare.kkmNumber",
      "valueType": "string",
      "value": "2246727552"
    }
  ],
  "partyPrivacyProfiles": [],
  "stateChanges": [
    {
      "id": "954386e3-a3e9-4445-9b3a-863760e8fc68",
      "state": "acknowledged",
      "description": "Auftrag eingegangen",
      "subStateDescription": "",
      "validFor": {
        "startDateTime": "2025-04-15T12:10:59.846647242Z"
      }
    },
    {
      "id": "954386e3-a3e9-4445-9b3a-863760e8fc68",
      "state": "inProgress",
      "description": "Auftrag ist in Bearbeitung",
      "subStateDescription": "Den Ausführungstermin finden Sie unten in den Details unter \"Ausführung\"."
    },
    {
      "id": "954386e3-a3e9-4445-9b3a-863760e8fc68",
      "state": "completed",
      "description": "Auftrag wird abgeschlossen",
      "subStateDescription": ""
    }
  ],
  "documents": [
    {
      "id": "CO_a35d0b52-1991-4a52-a39a-e08b8656b1dd",
      "name": "Consent"
    }
  ]
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demonstration, we'll use the sample JSON data directly
    const fetchOrderDetails = async () => {
      try {
        // First try to get data from the order service
        if (id) {
          const orderData = getOrderById(id);
          
          if (orderData) {
            setOrder(orderData as unknown as MobileOrder);
          } else {
            // Use our sample mobile order data
            setOrder(sampleMobileOrderData);
          }
        } else {
          setError("No order ID provided");
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error retrieving order details');
        // Fallback to sample data on error (for demo)
        setOrder(sampleMobileOrderData);
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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/order-overview')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <OrderSummaryCard order={order} />
          
          {/* Order Timeline */}
          <OrderTimelineCard order={order} />
          
          {/* Order Items */}
          <OrderItemsCard order={order} />
          
          {/* Order Pricing */}
          <OrderPriceCard order={order} />
          
          {/* Related Parties */}
          <OrderRelatedPartiesCard order={order} />
          
          {/* Contact Information */}
          <OrderContactsCard order={order} />
          
          {/* Order Characteristics */}
          <OrderCharacteristicsCard order={order} />
          
          {/* Documents */}
          <OrderDocumentsCard order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
