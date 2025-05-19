
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Package, AlertCircle, FileCheck, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { ProductInventory } from "@/types/product";
import { crudService } from "@/services/crudService";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductInventoryDrawerProps {
  orderId: string | undefined;
}

export default function ProductInventoryDrawer({ orderId }: ProductInventoryDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [productInventory, setProductInventory] = useState<ProductInventory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProductInventory = async () => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real application, you would use the orderId to fetch the product inventory
      const data = await crudService.get<ProductInventory>({
        endpoint: `/orders/${orderId}/product-inventory`,
      });
      setProductInventory(data);
      toast({
        title: "Success",
        description: "Product inventory data loaded",
      });
    } catch (err) {
      console.error("Error fetching product inventory:", err);
      setError("Failed to load product inventory data");
      toast({
        title: "Error",
        description: "Failed to load product inventory data",
        variant: "destructive",
      });
      
      // For demo purposes, set mock data
      setProductInventory({
        id: "MH_204459544",
        name: "Doku",
        description: "Standard-Option",
        label: "Doku",
        status: "Pending_terminate",
        categories: [
          { id: "ott" },
          { id: "tv" }
        ],
        group: "addon",
        isCustomerVisible: true,
        startDate: "2025-04-10T22:00:00.000Z",
        orderDate: "2025-04-11T09:32:12.721Z",
        terminationDate: "2027-04-07T22:00:00.000Z",
        productOffering: {
          id: "MH_10004",
          name: "Doku"
        },
        productCharacteristics: [
          { name: "guid", value: "100049017300037960130001" },
          { name: "aaxProductId", value: "MH_1843663990" },
          { name: "HWOnlySales", value: "false" },
          { name: "minRecurringPrice", value: "0" },
          { name: "selectedProductOfferingTerm", value: "agreement00" },
          { name: "instalmentAmountMinimumDutyFree", value: "0" },
          { name: "isDynamicPrice", value: "false" },
          { name: "instalmentAmountStep", value: "0" },
          { name: "minUpfrontPrice", value: "0" },
          { name: "AGB_ID", value: "1942" },
          { name: "instalmentAmountStepDutyFree", value: "0" },
          { name: "instalmentAmountMinimum", value: "0" },
          { name: "metaTagDescription", value: "" },
          { name: "metaTagTitle", value: "" }
        ],
        productRelationships: [],
        customer: {
          id: "MH_5302825411"
        },
        accounts: [
          {
            id: "RBS_01961a28-b0cb-7472-9644-6abc12705df9",
            accountType: "billing",
            role: "mainBA",
            name: "Buchungskonto"
          }
        ],
        productPrices: [
          {
            id: "MH_400011047",
            name: "TV Paket Doku",
            label: "Grundpreis",
            priceType: "recurringFee",
            recurringChargePeriod: "month",
            recurringChargeDuration: 1.0,
            unitOfMeasure: {
              unit: "units",
              amount: 1
            },
            validFor: {
              startDateTime: "2025-04-10T22:00:00.000Z",
              endDateTime: "2027-04-07T22:00:00.000Z"
            },
            price: {
              currencyCode: "EUR",
              taxIncludedAmount: 6,
              dutyFreeAmount: 5.042016,
              taxRate: 19.0,
              amount: 6.0
            }
          }
        ],
        agreements: [
          {
            id: "MH_204459544",
            agreementPeriod: {
              startDateTime: "2025-04-10T22:00:00.000Z",
              endDateTime: "2025-05-28T22:00:00.000Z"
            },
            businessId: "MH_204459544",
            cancelUntilDate: "2025-04-28T22:00:00.000Z",
            duration: {
              timePeriod: 0,
              type: "month"
            },
            initialDate: "2025-04-10T22:00:00.000Z",
            noticePeriod: {
              timePeriod: 35,
              type: "month"
            },
            prolongationPeriod: {
              timePeriod: 0,
              type: "month"
            },
            status: "terminationRequested"
          }
        ],
        realizingServices: [
          {
            id: "100049017300037960130001_accessData",
            name: "accessData",
            version: "1.0.0"
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
      terminated: "bg-red-100 text-red-800 border-red-200",
      pending_terminate: "bg-orange-100 text-orange-800 border-orange-200",
      pending: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const normalizedStatus = status.toLowerCase();
    const colorClass = statusColors[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <Badge className={`${colorClass} border`}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={fetchProductInventory}
        >
          <Package className="h-4 w-4" />
          <span>Product Inventory</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Inventory
          </DrawerTitle>
          <DrawerDescription>
            View product inventory details for this order
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {error && !productInventory && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
              <h3 className="text-lg font-medium">Failed to load data</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={fetchProductInventory}>Try Again</Button>
            </div>
          )}

          {productInventory && (
            <div className="space-y-6">
              {/* Product Summary Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {productInventory.name}
                      <span className="text-sm font-normal text-gray-500">
                        ({productInventory.id})
                      </span>
                    </CardTitle>
                    {getStatusBadge(productInventory.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1">{productInventory.description}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Group</dt>
                      <dd className="mt-1 capitalize">{productInventory.group}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1">{formatDate(productInventory.startDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Termination Date</dt>
                      <dd className="mt-1">{formatDate(productInventory.terminationDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Categories</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {productInventory.categories.map((category) => (
                          <Badge key={category.id} variant="outline">
                            {category.id}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Customer Visible</dt>
                      <dd className="mt-1">{productInventory.isCustomerVisible ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Product Offering */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Product Offering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1">{productInventory.productOffering.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1">{productInventory.productOffering.id}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Pricing Information */}
              {productInventory.productPrices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Pricing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productInventory.productPrices.map((price) => (
                      <div key={price.id} className="border p-4 rounded-md">
                        <h4 className="font-medium">{price.name}</h4>
                        <p className="text-sm text-gray-500">{price.label}</p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Amount</span>
                            <p>
                              {price.price.amount} {price.price.currencyCode}
                              <span className="text-xs ml-1 text-gray-500">
                                (Tax: {price.price.taxRate}%)
                              </span>
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Billing Period</span>
                            <p>
                              {price.recurringChargeDuration} {price.recurringChargePeriod}(s)
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Valid From</span>
                            <p>{formatDate(price.validFor.startDateTime)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Valid Until</span>
                            <p>{formatDate(price.validFor.endDateTime)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Agreements */}
              {productInventory.agreements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Agreements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productInventory.agreements.map((agreement) => (
                      <div key={agreement.id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Agreement: {agreement.id}</h4>
                          <Badge
                            className={agreement.status === "terminationRequested"
                              ? "bg-orange-100 text-orange-800 border-orange-200 border"
                              : "bg-blue-100 text-blue-800 border-blue-200 border"}
                          >
                            {agreement.status}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Start Date</span>
                            <p>{formatDate(agreement.agreementPeriod.startDateTime)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">End Date</span>
                            <p>{formatDate(agreement.agreementPeriod.endDateTime)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Cancel Until</span>
                            <p>{formatDate(agreement.cancelUntilDate)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Duration</span>
                            <p>
                              {agreement.duration.timePeriod} {agreement.duration.type}(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Product Characteristics */}
              {productInventory.productCharacteristics.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5" />
                      Product Characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden">
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
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {productInventory.productCharacteristics.map((char, index) => (
                            <tr key={`${char.name}-${index}`}>
                              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {char.name}
                              </td>
                              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                {char.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Realizing Services */}
              {productInventory.realizingServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Realizing Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productInventory.realizingServices.map((service) => (
                        <div key={service.id} className="border p-3 rounded-md">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500">ID: {service.id}</p>
                          <p className="text-sm text-gray-500">Version: {service.version}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
