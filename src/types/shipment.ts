
export interface ShipmentTracking {
  id: string;
  href: string;
  carrier: string;
  trackingCode: string;
  carrierTrackingUrl: string;
  trackingDate: string;
  status: string;
  statusChangeDate: string;
  statusChangeReason: string;
  weight: number;
  estimatedDeliveryDate: string;
  addressFrom: Address;
  addressTo: Address;
  checkpoint: Checkpoint[];
  order: OrderReference[];
  relatedCustomer: Customer;
  createDate: string;
  characteristics: Characteristic[];
  shippingOrderItems: ShippingOrderItem[];
}

export interface Address {
  id: string;
  href: string;
  addressRole?: AddressRole;
  validFor?: ValidFor;
  fullAddressName?: string;
  streetNr?: string;
  streetNrSuffix?: string;
  streetNrLast?: string;
  streetNrLastSuffix?: string;
  streetName?: string;
  streetType?: string;
  streetSuffix?: string;
  postcode?: string;
  locality?: string;
  city?: string;
  stateOrProvince?: string;
  country?: string;
  addressSpecRef?: Reference;
  location?: Location;
  geoCode?: GeoCode;
  characteristics?: Characteristic[];
  subAddresses?: SubAddress[];
  note?: string;
  audit?: Audit;
}

export interface AddressRole {
  id: string;
  href: string;
  role: string;
  validFor: ValidFor;
}

export interface ValidFor {
  startDateTime: string;
  endDateTime: string;
}

export interface Reference {
  entityReferredType: string;
  entityReferredBaseType?: string;
  entityReferredSchemaLocation?: string;
  id: string;
  href: string;
  name?: string;
  version?: string;
}

export interface Location {
  id: string;
  href: string;
  name: string;
  geometryType: string;
  accuracy: string;
  spatialRef: string;
  geometry: Geometry[];
}

export interface Geometry {
  x: string;
  y: string;
  z: string;
}

export interface GeoCode {
  latitude: string;
  longitude: string;
  geographicDatum: string;
}

export interface Characteristic {
  entityType?: string;
  entityBaseType?: string;
  entitySchemaLocation?: string;
  entityId?: string;
  name: string;
  valueType?: string;
  format?: string;
  value?: string;
  numberValue?: number;
  booleanValue?: boolean;
  objectValue?: any;
  arrayValue?: string[];
  label?: string;
  description?: string;
  configurable?: boolean;
  isCustomerVisible?: boolean;
}

export interface SubAddress {
  id: string;
  href: string;
  type: string;
  name: string;
  subUnitType: string;
  subUnitNumber: string;
  levelType: string;
  levelNumber: string;
  buildingName: string;
  privateStreetNumber: string;
  privateStreetName: string;
  characteristics: Characteristic[];
}

export interface Audit {
  id: string;
  createdBy: string;
  createdDate: string;
  changedBy: string;
  changedDate: string;
  entityVersion: string;
  tagId: string;
  spanId: string;
  changeReason: string;
  sourceSystem: string;
  sourceSystemUser: string;
  characteristics: Characteristic[];
}

export interface Checkpoint {
  status: string;
  message: string;
  date: string;
  checkPost: string;
  city: string;
  stateOrProvince: string;
  country: string;
  characteristics: Characteristic[];
}

export interface OrderReference {
  id: string;
  href: string;
  name: string;
  referredType: string;
}

export interface Customer {
  id: string;
  href: string;
  name: string;
  description: string;
}

export interface ShippingOrderItem {
  id: number;
  name: string;
  characteristics: Characteristic[];
  relatedEntities: Reference[];
}
