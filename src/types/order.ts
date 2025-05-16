
export interface Order {
  id: string;
  externalId?: string;
  publicIdentifier?: string;
  channel: { id: string; name?: string };
  businessProcess?: string;
  state: string;
  stateDescription?: string;
  offeringId?: string;
  offeringName?: string;
  orderDate?: string;
  orderCaptureDate?: string;
  lastUpdatedDate?: string;
  partyId?: string;
  profileId?: string;
  salesOrganization?: string;
  group?: string;
  details?: {
    [key: string]: any;
  };
  relatedParties?: Array<{
    entityReferredType?: string;
    id: string;
    role?: string;
  }>;
  orderItems?: Array<OrderItem>;
  stateChanges?: Array<StateItem>;
  appointments?: Array<any>;
  contacts?: Array<{
    id: string;
    type: string;
    role: {
      name: string;
    };
    medium?: any;
  }>;
  characteristics?: Array<{
    name: string;
    valueType?: string;
    value: string;
  }>;
  recurringPrices?: Array<any>;
  upfrontPrice?: any;
  partyPrivacyProfiles?: Array<any>;
  documents?: Array<{
    id: string;
    name: string;
  }>;
}

export interface OrderItem {
  id: string;
  name?: string;
  description?: string;
  state?: string;
  action?: string;
  businessProcess?: string;
  quantity?: number;
  productOffering?: {
    id?: string;
    name?: string;
    group?: string;
    description?: string;
    characteristics?: Array<{
      name: string;
      value: string;
      productSpecCharRelationship?: any[];
    }>;
    categories?: Array<{
      id: string;
    }>;
  };
  stateChanges?: Array<StateItem>;
  recurringPrices?: Array<any>;
  upfrontPrice?: any;
  externalId?: string;
  subStateDescription?: string;
  product?: {
    id: string;
  };
}

export interface StateItem {
  id: string;
  state: string;
  description?: string;
  subState?: string;
  subStateDescription?: string;
  validFor?: {
    startDateTime?: string;
    endDateTime?: string;
  };
}

export interface MobileOrder extends Order {
  recurringPrices: Array<{
    priceType: string;
    recurringChargePeriod?: string;
    recurringChargeDuration?: number;
    recurringChargeOccurrence?: number;
    price: {
      taxIncludedAmount: number;
      dutyFreeAmount: number;
      currencyCode?: string;
    };
    paymentMethodRef?: {
      id: string;
      type: string;
    };
  }>;
}

// Re-export types properly
export type { Order, OrderItem, StateItem, MobileOrder };
