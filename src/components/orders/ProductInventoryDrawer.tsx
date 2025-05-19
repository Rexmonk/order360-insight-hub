
import { useState } from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ProductInventory } from "@/types/product";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { crudService } from "@/services/crudService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductInventoryDrawerProps {
  orderId?: string;
}

const ProductInventoryDrawer = ({ orderId }: ProductInventoryDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productInventory, setProductInventory] = useState<ProductInventory | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

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
    } catch (error) {
      console.error("Error fetching product inventory:", error);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchProductInventory();
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
    <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>Product Inventory</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent side="right" className="w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Product Inventory</DrawerTitle>
          <DrawerDescription>
            Product details for order {orderId}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-200px)] px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-3">Loading product data...</span>
            </div>
          ) : productInventory ? (
            <div className="space-y-6 pb-6">
              {/* Product Summary */}
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
                  <CardTitle>Product Offering</CardTitle>
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

              {/* Product Characteristics */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {productInventory.productCharacteristics.map((char) => (
                      <div key={char.name} className="border p-2 rounded-md">
                        <dt className="text-sm font-medium">{char.name}</dt>
                        <dd className="text-sm truncate">{char.value}</dd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Prices */}
              {productInventory.productPrices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
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
                              {price.recurringChargePeriod}
                              {price.recurringChargeDuration > 1 && ` (${price.recurringChargeDuration})`}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-sm font-medium text-gray-500">Valid</span>
                            <p>{formatDate(price.validFor.startDateTime)} - {formatDate(price.validFor.endDateTime)}</p>
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
                    <CardTitle>Agreements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productInventory.agreements.map((agreement) => (
                      <div key={agreement.id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Agreement {agreement.id}</h4>
                          <Badge variant="outline">{agreement.status}</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Period</span>
                            <p>
                              {formatDate(agreement.agreementPeriod.startDateTime)} - {formatDate(agreement.agreementPeriod.endDateTime)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Notice Period</span>
                            <p>{agreement.noticePeriod.timePeriod} {agreement.noticePeriod.type}(s)</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Cancel Until</span>
                            <p>{formatDate(agreement.cancelUntilDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Realizing Services */}
              {productInventory.realizingServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Realizing Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {productInventory.realizingServices.map((service) => (
                        <div key={service.id} className="border p-4 rounded-md">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-500">ID: {service.id}</p>
                          <p className="text-sm text-gray-500">Version: {service.version}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accounts */}
              {productInventory.accounts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {productInventory.accounts.map((account) => (
                        <div key={account.id} className="border p-3 rounded-md">
                          <h4 className="font-medium">{account.name}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <span className="text-sm text-gray-500">ID</span>
                              <p className="text-sm">{account.id}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Type</span>
                              <p className="text-sm">{account.accountType}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Role</span>
                              <p className="text-sm">{account.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Raw JSON View */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="raw-json">
                  <AccordionTrigger>Raw JSON Data</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(productInventory, null, 2)}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No product inventory data available
            </div>
          )}
        </ScrollArea>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductInventoryDrawer;
