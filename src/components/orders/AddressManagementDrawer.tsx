
import React, { useState } from "react";
import { MapPin } from "lucide-react";
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

interface AddressManagementProps {
  orderId?: string;
}

interface AddressInfo {
  id: string;
  href: string;
  fullAddressName: string;
  streetNr: string;
  streetName: string;
  postcode: string;
  locality: string;
  city: string;
  stateOrProvince: string;
  country: string;
  location: {
    id: string;
    geometryType: string;
    spatialRef: string;
    geometry: Array<{
      x: string;
      y: string;
    }>;
  };
  characteristics: Array<{
    name: string;
    valueType: string;
    value: string;
  }>;
}

const AddressManagementDrawer = ({ orderId }: AddressManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<AddressInfo[] | null>(null);

  const fetchAddressData = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production environment
      // For now we're using mock data
      setTimeout(() => {
        const mockData: AddressInfo[] = [
          {
            id: "401033aebc8bcd2cd6a2320c42ffe3f00f16162a4b5df410b2ee4be11919efdb",
            href: "/geographicAddressManagement/v1/addresses/401033aebc8bcd2cd6a2320c42ffe3f00f16162a4b5df410b2ee4be11919efdb",
            fullAddressName: "Adlergasse 1, 01067 Dresden",
            streetNr: "1",
            streetName: "Adlergasse",
            postcode: "01067",
            locality: "",
            city: "Dresden",
            stateOrProvince: "SN",
            country: "DEU",
            location: {
              id: "KLS_4648057_51p0564_13p72215",
              geometryType: "point",
              spatialRef: "WGS84",
              geometry: [
                {
                  x: "51.0564",
                  y: "13.72215"
                }
              ]
            },
            characteristics: [
              {
                name: "origin.id",
                valueType: "string",
                value: "4648057"
              },
              {
                name: "origin.source",
                valueType: "string",
                value: "KIO_LOKALITAET"
              },
              {
                name: "onkz",
                valueType: "string",
                value: "0351"
              },
              {
                name: "asb",
                valueType: "string",
                value: "49"
              }
            ]
          }
        ];
        
        setAddresses(mockData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching address data:", error);
      toast.error("Failed to load address data.");
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          onClick={fetchAddressData} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <MapPin size={18} />
          <span>Address Data</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Geographic Address Management (GAM)</SheetTitle>
          <SheetDescription>
            Address information related to order {orderId}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading address data...</p>
            </div>
          ) : addresses && addresses.length > 0 ? (
            <>
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardHeader className="pb-3">
                    <CardTitle>Address Details</CardTitle>
                    <CardDescription>{address.fullAddressName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Basic Address Information */}
                    <div>
                      <h4 className="font-semibold mb-2">Address Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Street</p>
                          <p className="font-medium">{address.streetName} {address.streetNr}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium">{address.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Postal Code</p>
                          <p className="font-medium">{address.postcode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">State</p>
                          <p className="font-medium">{address.stateOrProvince}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium">{address.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Geolocation */}
                    {address.location && (
                      <div>
                        <h4 className="font-semibold mb-2">Geolocation</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Location ID</p>
                            <p className="font-medium">{address.location.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">{address.location.geometryType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Spatial Reference</p>
                            <p className="font-medium">{address.location.spatialRef}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Coordinates</p>
                            <p className="font-medium">
                              {address.location.geometry.map((geo, index) => (
                                <span key={index}>{geo.x}, {geo.y}</span>
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Characteristics */}
                    {address.characteristics && address.characteristics.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Additional Properties</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {address.characteristics.map((char, index) => (
                            <div key={index}>
                              <p className="text-sm text-gray-500">{char.name}</p>
                              <p className="font-medium">{char.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No address data found.</p>
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

export default AddressManagementDrawer;
