
import React, { useState } from "react";
import { User } from "lucide-react";
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

interface CustomerDataProps {
  orderId?: string;
}

interface CustomerData {
  id: string;
  type: string;
  status: string;
  individual: {
    salutation: string;
    givenName: string;
    lastName: string;
    dateOfBirth: string;
    individualIdentifications: Array<{
      id: string;
      identificationId: string;
      type: string;
      issuingAuthority: string;
      identificationMethod: string;
      issuingDate: string;
      creationDate: string;
      expirationDate: string;
      nationality: string;
    }>;
  };
  contacts: Array<{
    id: string;
    type: string;
    number?: string;
    address?: string;
    streetName?: string;
    streetNumber?: string;
    postCode?: string;
    city?: string;
    country?: string;
    usageContext: string[];
    verificationStatus?: string;
    verificationDate?: string;
    characteristics?: Array<{
      name: string;
      value: string;
    }>;
  }>;
  lastModified: string;
}

const CustomerDataDrawer = ({ orderId }: CustomerDataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  const fetchCustomerData = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production environment
      // For now we're using mock data
      setTimeout(() => {
        const mockData: CustomerData = {
          id: "TEMP_d320b774-b2d7-4377-829f-dc9d58c20d49",
          type: "Individual",
          status: "initialized",
          individual: {
            salutation: "Herr",
            givenName: "Test",
            lastName: "Tester",
            dateOfBirth: "2000-01-01",
            individualIdentifications: [
              {
                id: "TEMP_b6ecebe3-a533-4d9e-9898-1d2bc1fae0f8",
                identificationId: "1234565432",
                type: "PASSPORT",
                issuingAuthority: "Berlin",
                identificationMethod: "string",
                issuingDate: "2024-06-06T08:45:30.183Z",
                creationDate: "2024-06-06T08:45:30.183Z",
                expirationDate: "2024-12-31T08:45:30.183Z",
                nationality: "DE"
              }
            ]
          },
          contacts: [
            {
              type: "mobile",
              number: "+49228123456",
              id: "TEMP_3a41399b-2285-4720-84ac-cd6c57d3dfae",
              usageContext: [
                "CONTRACT"
              ],
              verificationStatus: "not verified",
              verificationDate: "2024-06-06T08:45:30.183Z"
            },
            {
              type: "eMail",
              address: "phoenix1745498018484_36@ver.sul.t-online.de",
              id: "TEMP_be302630-b9b6-4466-ab96-e98ad0956873",
              usageContext: [
                "CONTRACT"
              ],
              verificationStatus: "not verified",
              verificationDate: "2024-06-06T08:45:30.183Z"
            },
            {
              type: "postal",
              streetName: "Heinstr.",
              streetNumber: "32",
              postCode: "28213",
              city: "Bremen",
              country: "Deutschland",
              id: "TEMP_2f4c1787-aaa4-4ddd-a350-6fbe7a980017",
              usageContext: [
                "CONTRACT"
              ],
              characteristics: [
                {
                  name: "company",
                  value: ""
                }
              ]
            }
          ],
          lastModified: "2025-05-06T07:37:47.931Z"
        };
        
        setCustomerData(mockData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to load customer data.");
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          onClick={fetchCustomerData} 
          className="flex items-center gap-2"
          variant="outline"
        >
          <User size={18} />
          <span>Customer Data</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customer Data Platform (CDP)</SheetTitle>
          <SheetDescription>
            Customer information related to order {orderId}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading customer data...</p>
            </div>
          ) : customerData ? (
            <>
              {/* Personal Information Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Customer's personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer Type</p>
                      <p className="font-medium">{customerData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{customerData.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {customerData.individual.salutation} {customerData.individual.givenName} {customerData.individual.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{customerData.individual.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Modified</p>
                      <p className="font-medium">{formatDate(customerData.lastModified)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Identification Card */}
              {customerData.individual.individualIdentifications?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Identification</CardTitle>
                    <CardDescription>Customer ID documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {customerData.individual.individualIdentifications.map((id) => (
                      <div key={id.id} className="space-y-2 py-2 border-b last:border-0 last:pb-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">ID Type</p>
                            <p className="font-medium">{id.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ID Number</p>
                            <p className="font-medium">{id.identificationId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Issuing Authority</p>
                            <p className="font-medium">{id.issuingAuthority}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Nationality</p>
                            <p className="font-medium">{id.nationality}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Issued Date</p>
                            <p className="font-medium">{formatDate(id.issuingDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Expiry Date</p>
                            <p className="font-medium">{formatDate(id.expirationDate)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Contact Information Card */}
              {customerData.contacts?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Ways to contact the customer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {customerData.contacts.map((contact) => (
                      <div key={contact.id} className="space-y-2 py-2 border-b last:border-0 last:pb-0">
                        <h4 className="font-semibold capitalize">{contact.type} Contact</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {contact.number && (
                            <div>
                              <p className="text-sm text-gray-500">Number</p>
                              <p className="font-medium">{contact.number}</p>
                            </div>
                          )}
                          {contact.address && (
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{contact.address}</p>
                            </div>
                          )}
                          {contact.streetName && (
                            <>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-500">Street</p>
                                <p className="font-medium">{contact.streetName} {contact.streetNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">City</p>
                                <p className="font-medium">{contact.postCode} {contact.city}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="font-medium">{contact.country}</p>
                              </div>
                            </>
                          )}
                          {contact.verificationStatus && (
                            <>
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium capitalize">{contact.verificationStatus}</p>
                              </div>
                              {contact.verificationDate && (
                                <div>
                                  <p className="text-sm text-gray-500">Verified On</p>
                                  <p className="font-medium">{formatDate(contact.verificationDate)}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No customer data found.</p>
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

export default CustomerDataDrawer;
