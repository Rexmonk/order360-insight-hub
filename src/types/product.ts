
export interface ProductCharacteristic {
  name: string;
  value: string;
}

export interface ProductCategory {
  id: string;
}

export interface ProductOffering {
  id: string;
  name: string;
}

export interface ProductPrice {
  id: string;
  name: string;
  label: string;
  priceType: string;
  recurringChargePeriod: string;
  recurringChargeDuration: number;
  unitOfMeasure: {
    unit: string;
    amount: number;
  };
  validFor: {
    startDateTime: string;
    endDateTime: string;
  };
  price: {
    currencyCode: string;
    taxIncludedAmount: number;
    dutyFreeAmount: number;
    taxRate: number;
    amount: number;
  };
}

export interface ProductAgreement {
  id: string;
  agreementPeriod: {
    startDateTime: string;
    endDateTime: string;
  };
  businessId: string;
  cancelUntilDate: string;
  duration: {
    timePeriod: number;
    type: string;
  };
  initialDate: string;
  noticePeriod: {
    timePeriod: number;
    type: string;
  };
  prolongationPeriod: {
    timePeriod: number;
    type: string;
  };
  status: string;
}

export interface RealizingService {
  id: string;
  name: string;
  version: string;
}

export interface ProductAccount {
  id: string;
  accountType: string;
  role: string;
  name: string;
}

export interface ProductInventory {
  id: string;
  name: string;
  description: string;
  label: string;
  status: string;
  categories: ProductCategory[];
  group: string;
  isCustomerVisible: boolean;
  startDate: string;
  orderDate: string;
  terminationDate: string;
  productOffering: ProductOffering;
  productCharacteristics: ProductCharacteristic[];
  productRelationships: any[];
  customer: {
    id: string;
  };
  accounts: ProductAccount[];
  productPrices: ProductPrice[];
  agreements: ProductAgreement[];
  realizingServices: RealizingService[];
}
