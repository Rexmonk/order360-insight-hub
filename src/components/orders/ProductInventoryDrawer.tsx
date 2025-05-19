
import { useState } from "react";
import { Package } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ProductInventory } from "@/types/product";
import { format } from "date-fns";
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
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Product Inventory
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Product Inventory Details</SheetTitle>
          <SheetDescription>
            Product details for order {orderId || ""}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-2 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-500">Loading product inventory...</p>
              </div>
            </div>
          ) : productInventory ? (
            <div className="space-y-6">
              {/* Product Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Product Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-900">{productInventory.name}</h4>
                    {getStatusBadge(productInventory.status)}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">ID: {productInventory.id}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p>{productInventory.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Group</p>
                      <p className="capitalize">{productInventory.group}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Start Date</p>
                      <p>{formatDate(productInventory.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Termination Date</p>
                      <p>{formatDate(productInventory.terminationDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Offering */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Product Offering</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID</p>
                        <p>{productInventory.productOffering.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p>{productInventory.productOffering.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Characteristics */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productInventory.productCharacteristics.map((char, idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <p className="font-medium capitalize">{char.name}</p>
                        <p className="text-sm text-gray-700">{char.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Prices */}
              {productInventory.productPrices.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productInventory.productPrices.map((price) => (
                        <div key={price.id} className="border rounded-md p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{price.name}</h4>
                              <p className="text-sm text-gray-500">{price.label}</p>
                            </div>
                            <div className="mt-2 sm:mt-0 px-4 py-2 bg-green-50 text-green-800 font-medium rounded-lg">
                              {price.price.amount} {price.price.currencyCode}
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Tax Rate</span>
                              <p>{price.price.taxRate}%</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Billing Period</span>
                              <p className="capitalize">{price.recurringChargePeriod}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Agreements */}
              {productInventory.agreements.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">Agreements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productInventory.agreements.map((agreement) => (
                        <div key={agreement.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">Agreement {agreement.id}</h4>
                            <Badge className="capitalize">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accounts */}
              {productInventory.accounts.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productInventory.accounts.map((account) => (
                        <div key={account.id} className="border rounded-md p-3">
                          <h4 className="font-semibold text-gray-900">{account.name}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-medium">{account.id}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Type:</span>{" "}
                              <span className="font-medium capitalize">{account.accountType}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Role:</span>{" "}
                              <span className="font-medium capitalize">{account.role}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Realizing Services */}
              {productInventory.realizingServices.length > 0 && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productInventory.realizingServices.map((service) => (
                        <div key={service.id} className="border rounded-md p-3">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="text-gray-500">ID:</span>{" "}
                              <span className="font-medium">{service.id}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">Version:</span>{" "}
                              <span className="font-medium">{service.version}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Raw JSON View */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="raw-json" className="border rounded-lg">
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                    <span className="text-gray-700 font-medium">Raw JSON Data</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                      <pre className="text-xs whitespace-pre-wrap text-gray-700">
                        {JSON.stringify(productInventory, null, 2)}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No product inventory information available.</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ProductInventoryDrawer;
