
import { useState } from "react";
import { FileSearch } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

// Define types for the sales commission data
interface SalesCommissionParty {
  "@referredType": string;
  "@referredBaseType": string;
  id: string;
  role: string;
}

interface SalesCommissionOffering {
  id: string;
  group: string;
  targetScopeRef: {
    "@referredType": string;
    id: string;
  };
  characteristics: Array<{
    name: string;
    value: string;
    valueType: string;
  }>;
}

interface SalesCommissionValue {
  amount: number;
  maximum: number;
  units: string;
}

interface SalesCommission {
  id: string;
  channel: {
    id: string;
  };
  businessProcesses: string;
  relatedParties: SalesCommissionParty[];
  productOffering: SalesCommissionOffering;
  value: SalesCommissionValue[];
}

// Mock data for the sales commission
const mockSalesCommission: SalesCommission = {
  id: "739b7a08-9619-4fdc-a8b9-51eb477be5fa",
  channel: {
    id: "MagentaView"
  },
  businessProcesses: "acquisition",
  relatedParties: [
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "bb2d1811-0bc0-4765-81b4-599944d016b3",
      role: "owner"
    },
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "9P700",
      role: "salesOrganisation"
    },
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "VM2349",
      role: "salesRepresentative"
    },
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "CCIn",
      role: "subChannel"
    },
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "21",
      role: "salesChannel"
    },
    {
      "@referredType": "Party",
      "@referredBaseType": "Party",
      id: "1002194",
      role: "salesPartnerNumber"
    }
  ],
  productOffering: {
    id: "MF_16712",
    group: "tariff",
    targetScopeRef: {
      "@referredType": "Product",
      id: "MF_2212003817"
    },
    characteristics: [
      {
        name: "commissionRelevant",
        value: "Yes",
        valueType: "text"
      },
      {
        name: "sumCommPointsFE",
        value: "0",
        valueType: "numeric"
      },
      {
        name: "conformanceCluster",
        value: "10",
        valueType: "numeric"
      },
      {
        name: "isTargetHit",
        value: "N",
        valueType: "text"
      },
      {
        name: "colour",
        value: "1",
        valueType: "numeric"
      },
      {
        name: "guidedSellingVersion",
        value: "2",
        valueType: "numeric"
      },
      {
        name: "guidedSellingFlag",
        value: "1",
        valueType: "numeric"
      }
    ]
  },
  value: [
    {
      amount: 5,
      maximum: 5,
      units: "stars"
    }
  ]
};

// Simulate API call to fetch sales commission data
const fetchSalesCommission = async (orderId: string): Promise<SalesCommission> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate API success (90% of the time) or error
  const shouldSucceed = Math.random() < 0.9;
  
  if (!shouldSucceed) {
    throw new Error("Failed to fetch sales commission data. Please try again.");
  }
  
  return mockSalesCommission;
};

interface SalesCommissionDrawerProps {
  orderId?: string;
}

const SalesCommissionDrawer = ({ orderId }: SalesCommissionDrawerProps) => {
  const [commission, setCommission] = useState<SalesCommission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && orderId) {
      loadCommissionData();
    }
  };
  
  const loadCommissionData = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    
    try {
      const data = await fetchSalesCommission(orderId);
      setCommission(data);
      toast({
        title: "Success",
        description: "Sales commission data loaded successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching sales commission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load sales commission data",
        variant: "destructive",
      });
      // Close the drawer on error
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStarRating = (value: SalesCommissionValue) => {
    const stars = [];
    for (let i = 0; i < value.maximum; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i < value.amount ? "text-yellow-500" : "text-gray-300"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: "Owner",
      salesOrganisation: "Sales Organization",
      salesRepresentative: "Sales Representative",
      subChannel: "Sub-Channel",
      salesChannel: "Sales Channel",
      salesPartnerNumber: "Sales Partner"
    };

    return roleMap[role] || role;
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Sales Commission
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Sales Commission Details</SheetTitle>
          <SheetDescription>
            Commission information for order {orderId || ""}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-2 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-gray-500">Loading commission information...</p>
              </div>
            </div>
          ) : commission ? (
            <div className="space-y-6">
              {/* Commission Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Commission Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Commission ID</p>
                      <p className="font-medium">{commission.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Channel</p>
                      <p>{commission.channel.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Business Process</p>
                      <p className="capitalize">{commission.businessProcesses}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rating</p>
                      <div className="flex">
                        {commission.value.map((val, idx) => (
                          <div key={idx} className="flex items-center">
                            {getStarRating(val)}
                            <span className="ml-2 text-sm">
                              ({val.amount}/{val.maximum} {val.units})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Offering */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Product Offering Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Product ID</p>
                        <p>{commission.productOffering.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Group</p>
                        <p className="capitalize">{commission.productOffering.group}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Target Reference</p>
                        <p>{commission.productOffering.targetScopeRef.id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Characteristics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {commission.productOffering.characteristics.map((char, idx) => (
                          <div key={idx} className="border rounded-md p-3">
                            <p className="font-medium capitalize">{char.name}</p>
                            <div className="flex justify-between">
                              <p className="text-sm">{char.value}</p>
                              <Badge variant="outline" className="text-xs">
                                {char.valueType}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Parties */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">Related Parties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {commission.relatedParties.map((party, idx) => (
                      <div key={idx} className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{getRoleLabel(party.role)}</h3>
                          <Badge>{party["@referredType"]}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">ID: {party.id}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No commission information available.</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SalesCommissionDrawer;
