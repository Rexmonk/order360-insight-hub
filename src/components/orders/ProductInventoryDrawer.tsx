
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
    <Drawer open={isOpen} onOpenChange={handleOpenChange} shouldScaleBackground={true}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-primary/20 shadow-sm hover:shadow-md transition-all">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">Product Inventory</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-4xl mx-auto">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="text-2xl font-semibold text-primary">Product Inventory</DrawerTitle>
          <DrawerDescription className="text-gray-600">
            Product details for order {orderId}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-220px)] px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-4 text-lg font-medium text-gray-700">Loading product data...</span>
            </div>
          ) : productInventory ? (
            <div className="space-y-8 py-6">
              {/* Product Summary */}
              <Card className="border-0 shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-primary/5 border-b pb-4">
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
                <CardContent className="pt-4">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-gray-900 font-medium">{productInventory.description}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Group</dt>
                      <dd className="mt-1 text-gray-900 font-medium capitalize">{productInventory.group}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1 text-gray-900 font-medium">{formatDate(productInventory.startDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Termination Date</dt>
                      <dd className="mt-1 text-gray-900 font-medium">{formatDate(productInventory.terminationDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Categories</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {productInventory.categories.map((category) => (
                          <Badge key={category.id} variant="outline" className="bg-primary/5 border-primary/30 text-primary-600">
                            {category.id}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Customer Visible</dt>
                      <dd className="mt-1 text-gray-900 font-medium">
                        {productInventory.isCustomerVisible ? (
                          <span className="inline-flex items-center gap-1 text-green-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            No
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Product Offering */}
              <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-full">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    Product Offering
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-gray-900 font-medium">{productInventory.productOffering.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">ID</dt>
                      <dd className="mt-1 text-gray-900 font-medium">{productInventory.productOffering.id}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Product Characteristics */}
              <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 rounded-full">
                      <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Product Characteristics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {productInventory.productCharacteristics.map((char) => (
                      <div key={char.name} className="border border-gray-100 p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        <dt className="text-sm font-medium text-primary">{char.name}</dt>
                        <dd className="text-sm mt-1 text-gray-800 font-medium truncate">{char.value}</dd>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Prices */}
              {productInventory.productPrices.length > 0 && (
                <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <div className="p-1.5 bg-green-50 rounded-full">
                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {productInventory.productPrices.map((price) => (
                      <div key={price.id} className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{price.name}</h4>
                            <p className="text-sm text-gray-500">{price.label}</p>
                          </div>
                          <div className="mt-3 sm:mt-0 px-4 py-2 bg-green-50 text-green-800 font-medium rounded-lg">
                            {price.price.amount} {price.price.currencyCode}
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Tax Details</span>
                            <p className="text-gray-700">
                              Rate: {price.price.taxRate}% 
                              <span className="block text-sm text-gray-500">
                                Tax included: {price.price.taxIncludedAmount} {price.price.currencyCode}
                              </span>
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Billing Period</span>
                            <p className="text-gray-700 capitalize">
                              {price.recurringChargePeriod}
                              {price.recurringChargeDuration > 1 && ` (${price.recurringChargeDuration})`}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-sm font-medium text-gray-500">Valid Period</span>
                            <p className="text-gray-700 flex items-center gap-2">
                              <span className="whitespace-nowrap">{formatDate(price.validFor.startDateTime)}</span>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                              <span className="whitespace-nowrap">{formatDate(price.validFor.endDateTime)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Agreements */}
              {productInventory.agreements.length > 0 && (
                <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 rounded-full">
                        <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Agreements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {productInventory.agreements.map((agreement) => (
                      <div key={agreement.id} className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900">Agreement {agreement.id}</h4>
                          <Badge className="px-2.5 py-1 capitalize bg-amber-100 text-amber-800 border-amber-200">
                            {agreement.status}
                          </Badge>
                        </div>
                        <div className="mt-4 space-y-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-medium text-gray-500">Period</span>
                            <p className="text-gray-700 flex items-center gap-2 mt-1">
                              <span className="whitespace-nowrap">{formatDate(agreement.agreementPeriod.startDateTime)}</span>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                              <span className="whitespace-nowrap">{formatDate(agreement.agreementPeriod.endDateTime)}</span>
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Notice Period</span>
                              <p className="text-gray-700">{agreement.noticePeriod.timePeriod} {agreement.noticePeriod.type}(s)</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Cancel Until</span>
                              <p className="text-gray-700">{formatDate(agreement.cancelUntilDate)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Realizing Services */}
              {productInventory.realizingServices.length > 0 && (
                <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded-full">
                        <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      Realizing Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productInventory.realizingServices.map((service) => (
                        <div key={service.id} className="border border-gray-100 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500 flex justify-between">
                              <span>ID:</span>
                              <span className="font-medium text-gray-700">{service.id}</span>
                            </p>
                            <p className="text-sm text-gray-500 flex justify-between">
                              <span>Version:</span>
                              <span className="font-medium text-gray-700">{service.version}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accounts */}
              {productInventory.accounts.length > 0 && (
                <Card className="border-0 shadow-md rounded-xl bg-gradient-to-b from-white to-gray-50">
                  <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <div className="p-1.5 bg-cyan-50 rounded-full">
                        <svg className="h-4 w-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {productInventory.accounts.map((account) => (
                        <div key={account.id} className="border border-gray-100 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-gray-900">{account.name}</h4>
                          <div className="mt-2 space-y-2">
                            <p className="text-sm flex justify-between">
                              <span className="text-gray-500">ID:</span>
                              <span className="font-medium text-gray-700 max-w-[70%] truncate">{account.id}</span>
                            </p>
                            <p className="text-sm flex justify-between">
                              <span className="text-gray-500">Type:</span>
                              <span className="font-medium text-gray-700 capitalize">{account.accountType}</span>
                            </p>
                            <p className="text-sm flex justify-between">
                              <span className="text-gray-500">Role:</span>
                              <span className="font-medium text-gray-700 capitalize">{account.role}</span>
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
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">No product inventory data available</p>
              <p className="text-sm text-gray-400">Try refreshing the drawer or check the order status</p>
            </div>
          )}
        </ScrollArea>
        <DrawerFooter className="border-t flex flex-row justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          {productInventory && (
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Export Data
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductInventoryDrawer;
