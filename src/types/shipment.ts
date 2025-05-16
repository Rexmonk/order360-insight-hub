
export interface ShipmentAddress {
  id: string;
  href?: string;
  fullAddressName?: string;
  streetNr?: string;
  streetName?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  postcode?: string;
}

export interface Checkpoint {
  status: string;
  message: string;
  date: string;
  checkPost: string;
  city: string;
  stateOrProvince: string;
  country: string;
  characteristics?: any[];
}

export interface ShippingOrderItem {
  id: number;
  name: string;
  characteristics?: any[];
  relatedEntities?: any[];
}

export interface ShipmentTracking {
  id: string;
  href?: string;
  carrier: string;
  trackingCode: string;
  carrierTrackingUrl?: string;
  trackingDate: string;
  status: string;
  statusChangeDate: string;
  statusChangeReason?: string;
  weight: number;
  estimatedDeliveryDate: string;
  addressFrom: ShipmentAddress;
  addressTo: ShipmentAddress;
  checkpoint: Checkpoint[];
  order?: {
    id: string;
    href?: string;
    name?: string;
    referredType?: string;
  }[];
  relatedCustomer?: {
    id: string;
    href?: string;
    name: string;
    description?: string;
  };
  createDate: string;
  characteristics?: any[];
  shippingOrderItems: ShippingOrderItem[];
}
