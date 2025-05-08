
import { Order } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCog } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetailsViewProps {
  order: Order;
}

const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Created':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Accepted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/order-overview')}
            aria-label="Back to Order Overview"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>

        <Button
          className="bg-secondary hover:bg-secondary-600"
          onClick={() => navigate(`/bpmn-diagram/${order.id}`)}
        >
          <FileCog className="mr-2 h-4 w-4" />
          View Process Diagram
        </Button>
      </div>

      {/* Order Header Info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-xl">
                Order {order.id}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({order.publicIdentifier})
                </span>
              </CardTitle>
              <CardDescription>
                Created on {formatDate(order.orderDate)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.state)}`}
              >
                {order.state}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Channel</h3>
              <p className="mt-1">{order.channel}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Business Process</h3>
              <p className="mt-1">{order.businessProcess}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1">{formatDate(order.lastUpdatedDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline or Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
              <div className="mb-1 text-sm text-gray-500">
                {formatDate(order.orderDate)}
              </div>
              <h3 className="font-medium">Order Created</h3>
              <p className="mt-1 text-gray-600">
                Order {order.id} was created through {order.channel} channel
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
              <div className="mb-1 text-sm text-gray-500">
                {formatDate(order.lastUpdatedDate)}
              </div>
              <h3 className="font-medium">Order Status Updated</h3>
              <p className="mt-1 text-gray-600">
                Order status changed to {order.state}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Basic Information</h3>
                <dl className="divide-y divide-gray-100">
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Offering ID</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.offeringId}</dd>
                  </div>
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Offering Name</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.offeringName}</dd>
                  </div>
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Party ID</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.partyId}</dd>
                  </div>
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Profile ID</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.profileId}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Information</h3>
                <dl className="divide-y divide-gray-100">
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Sales Organization</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.salesOrganization}</dd>
                  </div>
                  <div className="px-2 py-2 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Group</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{order.group}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div>
              <h3 className="font-medium mb-2">Order Details</h3>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(order.details).map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <AccordionItem key={key} value={key}>
                        <AccordionTrigger className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </AccordionTrigger>
                        <AccordionContent>
                          <dl className="divide-y divide-gray-100">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="px-2 py-2 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500 capitalize">
                                  {subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {typeof subValue === 'string' && 
                                   (subValue.includes('T') && subValue.includes('Z') && subValue.includes('-')) ? 
                                    formatDate(subValue) : subValue.toString()}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  } else {
                    return (
                      <div key={key} className="px-2 py-2 grid grid-cols-3 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {typeof value === 'string' && 
                           (value.includes('T') && value.includes('Z') && value.includes('-')) ? 
                            formatDate(value) : value.toString()}
                        </dd>
                      </div>
                    );
                  }
                })}
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsView;
