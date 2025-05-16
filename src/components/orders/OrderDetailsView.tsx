import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileCog,
  Calendar,
  Package,
  User,
  Clock,
  UnfoldVertical,
  FoldVertical,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TooltipArrow, TooltipContent } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import ShipmentTrackingDrawer from "./ShipmentTrackingDrawer";

interface OrderDetailsViewProps {
  order: any;
}

const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
  const navigate = useNavigate();

  const [toggleOrderItem, setToggleOrderItem] = useState({});

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

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

  // Get the channel name
  const getChannelName = () => {
    if (order.channel.id) {
      return order.channel.id;
    }
    return "Unknown Channel";
  };

  // Get business process
  const getBusinessProcess = () => {
    // Check for business process in different parts of the object
    if (order.businessProcess) {
      return order.businessProcess;
    }
    if (
      order.orderItems &&
      order.orderItems.length > 0 &&
      order.orderItems[0].businessProcess
    ) {
      return order.orderItems[0].businessProcess;
    }
    return "N/A";
  };

  // Format state for display
  const getDisplayState = (state: string) => {
    if (!state) return "Unknown";

    // Convert to title case
    return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/order-overview")}
            aria-label="Back to Order Overview"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <ShipmentTrackingDrawer orderId={order.id} />
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate(`/bpmn-diagram/${order.id}`)}
          >
            <FileCog className="mr-2 h-4 w-4" />
            View Process Diagram
          </Button>
        </div>
      </div>

      {/* Order Header Info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-xl">
                Order ID : {order.id}
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({order.publicIdentifier})
                      </span>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent
                        content="test"
                        className="text-xs p-1 bg-primary rounded text-white "
                        data-side="top"
                        side="top"
                      >
                        Public Identifier
                        <TooltipArrow className="ToolTipArrow fill-primary" />
                      </TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>
                Created on{" "}
                {formatDate(order.orderCaptureDate || order.orderDate)}
              </CardDescription>
            </div>
            {order.state && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    order.state
                  )}`}
                >
                  {getDisplayState(order.state)}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Channel</h3>
                <p className="mt-1">{getChannelName()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileCog className="h-4 w-4 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Business Process
                </h3>
                <p className="mt-1">{getBusinessProcess()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h3>
                <p className="mt-1">
                  {formatDate(order.lastUpdatedDate || order.orderCaptureDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline or Stages */}
      {order.stateChanges && order.stateChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
              {order.stateChanges.map((change: any, index: number) => (
                <div className="relative" key={`${change.id}-${index}`}>
                  <div
                    className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                      index === order.stateChanges.length - 1
                        ? "bg-primary"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="mb-1 text-sm text-gray-500">
                    {change.validFor && change.validFor.startDateTime
                      ? formatDate(change.validFor.startDateTime)
                      : "Date not specified"}
                  </div>
                  {change.state && (
                    <div>
                      Status :{" "}
                      <span
                        className={
                          `inline-block p-1 rounded text-xs ` +
                          getStatusColor(change.state)
                        }
                      >
                        {getDisplayState(change.state)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-medium">{change.description}</h3>
                  {change.subStateDescription && (
                    <p className="mt-1 text-gray-600">
                      {change.subStateDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      {order.orderItems && order.orderItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {order.orderItems.map((item: any, index: number) => (
                <Collapsible
                  className="CollapsibleRoot"
                  open={toggleOrderItem?.[item.id]}
                  onOpenChange={() => {
                    setToggleOrderItem({
                      ...toggleOrderItem,
                      [item.id]: !toggleOrderItem[item.id],
                    });
                    console.log("toggleOrderItem", toggleOrderItem);
                  }}
                >
                  <Card
                    key={item.id || `item-${index}`}
                    className="overflow-hidden border-gray-200"
                  >
                    <CardHeader className="bg-gray-50 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-medium">
                          {item.productOffering?.name || "Product Item"}
                          {item.state && (
                            <span
                              className={`px-2 ml-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                item.state
                              )}`}
                            >
                              {getDisplayState(item.state)}
                            </span>
                          )}
                        </CardTitle>
                        <CollapsibleTrigger asChild>
                          {toggleOrderItem?.[item.id] ? (
                            <FoldVertical />
                          ) : (
                            <UnfoldVertical />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CardDescription>
                        ID: {item?.id || "N/A"} • Quantity: {item.quantity}
                      </CardDescription>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="py-3">
                        <dl className="divide-y divide-gray-100">
                          {item?.externalId && (
                            <div className="px-2 py-2 grid grid-cols-3">
                              <dt className="text-sm font-medium text-gray-500">
                                External ID
                              </dt>
                              <dd className="text-sm text-gray-900 col-span-2">
                                {item?.externalId}
                              </dd>
                            </div>
                          )}
                          <div className="px-2 py-2 grid grid-cols-3">
                            <dt className="text-sm font-medium text-gray-500">
                              Description
                            </dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                              {item.description || "No description"}
                            </dd>
                          </div>
                          <div className="px-2 py-2 grid grid-cols-3">
                            <dt className="text-sm font-medium text-gray-500">
                              Sub State Description
                            </dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                              {item.subStateDescription ||
                                "No sub state description"}
                            </dd>
                          </div>
                          <div className="px-2 py-2 grid grid-cols-3">
                            <dt className="text-sm font-medium text-gray-500">
                              Action
                            </dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                              {item.action || "N/A"}
                            </dd>
                          </div>
                          <div className="px-2 py-2 grid grid-cols-3">
                            <dt className="text-sm font-medium text-gray-500">
                              Business Process
                            </dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                              {item.businessProcess || "N/A"}
                            </dd>
                          </div>
                          {item.productOffering?.group && (
                            <div className="px-2 py-2 grid grid-cols-3">
                              <dt className="text-sm font-medium text-gray-500">
                                Group
                              </dt>
                              <dd className="text-sm text-gray-900 col-span-2">
                                {item.productOffering.group}
                              </dd>
                            </div>
                          )}
                          {item?.product?.id && (
                            <div className="px-2 py-2 grid grid-cols-3">
                              <dt className="text-sm font-medium text-gray-500">
                                Product
                              </dt>
                              <dd className="text-sm text-gray-900 col-span-2">
                                {item.product.id}
                              </dd>
                            </div>
                          )}
                        </dl>

                        <Card className="mt-4">
                          <CardHeader className="bg-gray-50 py-3">
                            <CardTitle className="flex text-md items-center gap-2">
                              <Package className="h-5 w-5" />
                              Product Offering
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="divide-y divide-gray-100">
                              <div className="px-2 py-2 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">
                                  ID
                                </dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {item.productOffering.id || "No id"}
                                </dd>
                              </div>
                              <div className="px-2 py-2 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">
                                  Name
                                </dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {item.productOffering.name || "No name"}
                                </dd>
                              </div>
                              <div className="px-2 py-2 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">
                                  Description
                                </dt>
                                <dd
                                  className="text-sm text-gray-900 col-span-2  overflow-auto"
                                  style={{ maxHeight: "100px" }}
                                >
                                  {item.productOffering.description ||
                                    "No description"}
                                </dd>
                              </div>
                              <div className="px-2 py-2 grid grid-cols-3">
                                <dt className="text-sm font-medium text-gray-500">
                                  Group
                                </dt>
                                <dd className="text-sm text-gray-900 col-span-2">
                                  {item.productOffering.group || "No group"}
                                </dd>
                              </div>
                              {item.productOffering?.categories && (
                                <div className="px-2 py-2 grid grid-cols-3">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Categories
                                  </dt>
                                  <dd className="text-sm text-gray-900 col-span-2">
                                    {item.productOffering.categories.map(
                                      (item: any, index: number, arr: []) =>
                                        item.id +
                                        `${index == arr.length - 1 ? "" : ","}`
                                    )}
                                  </dd>
                                </div>
                              )}

                              {item.productOffering?.characteristics.length >
                                0 && (
                                <div className="px-2 py-2 grid grid-cols-3">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Characteristics
                                  </dt>
                                  <dd
                                    className="text-sm text-gray-900 col-span-2 overflow-auto"
                                    style={{ maxHeight: "150px" }}
                                  >
                                    {item.productOffering.characteristics.map(
                                      (item: any, index: number, arr: []) =>
                                        item.value ? (
                                          <div className="bg-gray-200 rounded p-2 mr-2 inline-block mb-2">
                                            {item.name + " : " + item.value ||
                                              "-"}
                                          </div>
                                        ) : (
                                          ""
                                        )
                                    )}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </CardContent>
                        </Card>
                        <Card className="mt-4">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              State Changes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
                              {item.stateChanges.map(
                                (change: any, index: number) => (
                                  <div
                                    className="relative"
                                    key={`${change.id}-${index}`}
                                  >
                                    <div
                                      className={`absolute -left-[25px] w-4 h-4 rounded-full ${
                                        index === order.stateChanges.length - 1
                                          ? "bg-primary"
                                          : "bg-gray-400"
                                      }`}
                                    ></div>
                                    <div className="mb-1 text-sm text-gray-500">
                                      {change.validFor &&
                                      change.validFor.startDateTime
                                        ? formatDate(
                                            change.validFor.startDateTime
                                          )
                                        : "Date not specified"}
                                    </div>
                                    {change.state && (
                                      <div>
                                        Status :{" "}
                                        <span
                                          className={
                                            `inline-block p-1 rounded text-xs ` +
                                            getStatusColor(change.state)
                                          }
                                        >
                                          {getDisplayState(change.state)}
                                        </span>
                                      </div>
                                    )}
                                    <h3 className="font-medium">
                                      {change.description}
                                    </h3>
                                    {change.subStateDescription && (
                                      <p className="mt-1 text-gray-600">
                                        {change.subStateDescription}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Related Parties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.relatedParties && order.relatedParties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.relatedParties.map((party: any, index: number) => (
                <div
                  key={`${party.id}-${index}`}
                  className="bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <p className="text-sm font-medium">
                    {party.role || "Unknown Role"}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {party.id || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Type: {party.entityReferredType || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No related parties information available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.documents && order.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.documents.map((item: any, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <p className="text-sm font-medium">
                    Entity Type : {item.entityType || "Unknown Entity Type"}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {item.id || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Name: {item.name || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No related parties information available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Appointments */}
      {order.appointments && order.appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.appointments.map((appointment: any, index: number) => (
                <div
                  key={appointment.id || `appointment-${index}`}
                  className="bg-blue-50 p-4 rounded-md border border-blue-200"
                >
                  <h3 className="font-medium">
                    Appointment ID: {appointment.id}
                  </h3>
                  {appointment.validFor && (
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Start:</span>{" "}
                        {formatDate(appointment.validFor.startDateTime)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">End:</span>{" "}
                        {formatDate(appointment.validFor.endDateTime)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Characteristics */}
      {order.characteristics && order.characteristics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Characteristics</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="characteristics">
                <AccordionTrigger>View Characteristics</AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-50 p-4 rounded overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.characteristics.map(
                          (char: any, index: number) => (
                            <tr key={`${char.name}-${index}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {char.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {char.valueType || "string"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {char.value}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON Viewer (for developers/debugging) */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Order Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="raw-json">
              <AccordionTrigger>View Raw JSON</AccordionTrigger>
              <AccordionContent>
                <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto">
                  <pre className="text-xs">
                    {JSON.stringify(order, null, 2)}
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsView;
