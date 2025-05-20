
import React, { useState } from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ProductCatalogProps {
  orderId?: string;
}

interface Characteristic {
  entityType: string;
  name: string;
  label: string;
  isCustomerVisible: boolean;
  minCardinality: number;
  maxCardinality: number;
  valueType: string;
  characteristicValues: Array<{
    valueType: string;
    label: string;
    isDefault: boolean;
    value: string;
  }>;
}

interface ProductOfferingPrice {
  entityType: string;
  id: string;
  productOfferingRelationship: string;
  name: string;
  label?: string;
  version: string;
  isBundle: boolean;
  priceType: string;
  recurringChargePeriod?: string;
  recurringChargeDuration?: number;
  recurringChargeOccurrence?: number;
  price: {
    currencyCode: string;
    taxIncludedAmount: number;
  };
}

interface ProductOfferingGroup {
  id: string;
  name: string;
  minCardinality: number;
  maxCardinality: number;
}

interface ProductCatalogData {
  id: string;
  name: string;
  lifecycleStatus: string;
  group: string;
  isBundle: boolean;
  isCustomerVisible: boolean;
  ratingType: string;
  characteristics: Characteristic[];
  channels: Array<{ id: string }>;
  categories: Array<{ id: string }>;
  productOfferingPrices: ProductOfferingPrice[];
  productSpecificationRef: { id: string };
  productOfferingGroups: ProductOfferingGroup[];
  customerSegments: string[];
  isSellable: boolean;
}

const ProductCatalogDrawer = ({ orderId }: ProductCatalogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState<ProductCatalogData | null>(null);

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production environment
      // For now we're using mock data
      setTimeout(() => {
        const mockData: ProductCatalogData = {
          id: "MF_17253",
          name: "MagentaMobil Basic m Premium-H 6Gen",
          lifecycleStatus: "active",
          group: "tariff",
          isBundle: false,
          isCustomerVisible: true,
          ratingType: "postpaid",
          characteristics: [
            {
              entityType: "configuration",
              name: "cardGroup",
              label: "cardGroup",
              isCustomerVisible: false,
              minCardinality: 1,
              maxCardinality: 1,
              valueType: "text",
              characteristicValues: [
                {
                  valueType: "text",
                  label: "cardGroup",
                  isDefault: true,
                  value: "NMMAIN"
                }
              ]
            },
            {
              entityType: "configuration",
              name: "cardType",
              label: "cardType",
              isCustomerVisible: false,
              minCardinality: 1,
              maxCardinality: 1,
              valueType: "text",
              characteristicValues: [
                {
                  valueType: "text",
                  label: "cardType",
                  isDefault: true,
                  value: "adult"
                }
              ]
            },
            {
              entityType: "configuration",
              name: "EUREG",
              label: "Nutzungskontrolle Dataroaming ein",
              isCustomerVisible: false,
              minCardinality: 1,
              maxCardinality: 1,
              valueType: "text",
              characteristicValues: [
                {
                  valueType: "text",
                  label: "EUREG",
                  isDefault: true,
                  value: "addon"
                }
              ]
            },
            {
              entityType: "configuration",
              name: "VVMMBX",
              label: "Mobilbox Pro",
              isCustomerVisible: false,
              minCardinality: 1,
              maxCardinality: 1,
              valueType: "text",
              characteristicValues: [
                {
                  valueType: "text",
                  label: "VVMMBX",
                  isDefault: true,
                  value: "addon"
                }
              ]
            },
            {
              entityType: "configuration",
              name: "IMSPDP",
              label: "VoLTE und WLAN Call",
              isCustomerVisible: false,
              minCardinality: 1,
              maxCardinality: 1,
              valueType: "text",
              characteristicValues: [
                {
                  valueType: "text",
                  label: "IMSPDP",
                  isDefault: true,
                  value: "addon"
                }
              ]
            }
          ],
          channels: [
            {
              id: "OneAPP"
            },
            {
              id: "MagentaView"
            }
          ],
          categories: [
            {
              id: "mobile"
            },
            {
              id: "voice"
            },
            {
              id: "postpaid"
            }
          ],
          productOfferingPrices: [
            {
              entityType: "ProductOfferingPrice",
              id: "MF_17253-OTC-Price",
              productOfferingRelationship: "MF_17253",
              name: "oneTimeTariffFee",
              version: "1.0.0",
              isBundle: false,
              priceType: "activationFee",
              price: {
                currencyCode: "EUR",
                taxIncludedAmount: 39.95
              }
            },
            {
              entityType: "ProductOfferingPrice",
              id: "MF_17253-MRC-Price",
              productOfferingRelationship: "MF_17253",
              name: "monthlyTariffFee",
              label: "Monatlich",
              version: "1.0.0",
              isBundle: false,
              priceType: "recurringFee",
              recurringChargePeriod: "month",
              recurringChargeDuration: 1.0,
              recurringChargeOccurrence: -1,
              price: {
                currencyCode: "EUR",
                taxIncludedAmount: 54.95
              }
            }
          ],
          productSpecificationRef: {
            id: "MF_17253"
          },
          productOfferingGroups: [
            {
              id: "MF_AppleTVOptionen_0",
              name: "AppleTVOptionen",
              minCardinality: 0,
              maxCardinality: 1
            },
            {
              id: "MF_DisneyOptionen_0",
              name: "DisneyOptionen",
              minCardinality: 0,
              maxCardinality: 1
            },
            {
              id: "MF_ParamountOptionen_0",
              name: "ParamountOptionen",
              minCardinality: 0,
              maxCardinality: 1
            },
            {
              id: "MF_NetflixOptionen_0",
              name: "NetflixOptionen",
              minCardinality: 0,
              maxCardinality: 1
            },
            {
              id: "MF_SpotifyOptionen_0",
              name: "SpotifyOptionen",
              minCardinality: 0,
              maxCardinality: 1
            }
          ],
          customerSegments: [
            "B2C"
          ],
          isSellable: true
        };
        
        setProductData(mockData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed to load product data.");
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          onClick={fetchProductData} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <Package size={18} />
          <span>Product Catalog</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Product Catalog</SheetTitle>
          <SheetDescription>
            Product information related to order {orderId}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading product data...</p>
            </div>
          ) : productData ? (
            <>
              {/* Product Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{productData.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">{productData.lifecycleStatus}</Badge>
                  </div>
                  <CardDescription>Product ID: {productData.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">{productData.group}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating Type</p>
                      <p className="font-medium capitalize">{productData.ratingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bundle</p>
                      <p className="font-medium">{productData.isBundle ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Visible</p>
                      <p className="font-medium">{productData.isCustomerVisible ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer Segments</p>
                      <p className="font-medium">{productData.customerSegments.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sellable</p>
                      <p className="font-medium">{productData.isSellable ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories and Channels */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Categories & Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {productData.categories.map((category, index) => (
                        <Badge key={index} variant="secondary">
                          {category.id}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Channels</h4>
                    <div className="flex flex-wrap gap-2">
                      {productData.channels.map((channel, index) => (
                        <Badge key={index} variant="outline">
                          {channel.id}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Card */}
              {productData.productOfferingPrices && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productData.productOfferingPrices.map((price, index) => (
                      <div key={index} className="py-2 border-b last:border-0 last:pb-0">
                        <h4 className="font-semibold capitalize">{price.label || price.name}</h4>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-sm text-gray-500">Price Type</p>
                            <p className="font-medium capitalize">{price.priceType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">{price.price.taxIncludedAmount} {price.price.currencyCode}</p>
                          </div>
                          {price.recurringChargePeriod && (
                            <div>
                              <p className="text-sm text-gray-500">Billing Period</p>
                              <p className="font-medium capitalize">{price.recurringChargePeriod}</p>
                            </div>
                          )}
                          {price.recurringChargeDuration && (
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">{price.recurringChargeDuration} {price.recurringChargePeriod}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Product Characteristics */}
              {productData.characteristics && productData.characteristics.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Features & Add-ons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productData.characteristics.map((char, index) => (
                        <div key={index} className="py-2">
                          <h4 className="font-medium">{char.label}</h4>
                          {char.characteristicValues.map((val, valIndex) => (
                            <div key={valIndex} className="grid grid-cols-2 gap-4 mt-1">
                              <div>
                                <p className="text-sm text-gray-500">Value</p>
                                <p className="font-medium">{val.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Product Offering Groups */}
              {productData.productOfferingGroups && productData.productOfferingGroups.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Available Add-on Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {productData.productOfferingGroups.map((group, index) => (
                        <div key={index} className="py-1 px-2 border rounded-md">
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-gray-500">
                            {group.minCardinality === 0 ? "Optional" : "Required"}, 
                            Max selections: {group.maxCardinality}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No product data found.</p>
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductCatalogDrawer;
