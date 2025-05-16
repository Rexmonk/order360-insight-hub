import { crudService } from "./crudService";

export interface ValidFor {
  startDateTime: string;
  endDateTime: string;
}

export interface StateItem {
  id: string;
  state: string;
  description: string;
  subStateDescription?: string;
  validFor: ValidFor;
}

export interface OrderItem {
  businessProcess: string;
  productOffering: { id: string; name: string };
}
export interface Order {
  stateChanges: StateItem[];
  orderItems: OrderItem[];
  id: string;
  publicIdentifier: string;
  channel: { id: string };
  businessProcess: string;
  state: string;
  offeringId: string;
  offeringName: string;
  orderDate: string;
  lastUpdatedDate: string;
  partyId: string;
  profileId: string;
  salesOrganization: string;
  group: string;
  details: {
    [key: string]: any;
  };
}

// States for orders
const states = ["Created", "Accepted", "In Progress", "Completed", "Canceled"];

// Channels
const channels = ["Online", "Mobile", "Retail", "Call Center", "Partner"];

// Business Processes
const businessProcesses = [
  "New Order",
  "Change Order",
  "Cancel Order",
  "Upgrade",
  "Downgrade",
];

// Sample offerings
const offerings = [
  { id: "OFF-001", name: "Basic Internet" },
  { id: "OFF-002", name: "Premium Internet" },
  { id: "OFF-003", name: "Mobile Plan" },
  { id: "OFF-004", name: "TV Package" },
  { id: "OFF-005", name: "Business Internet" },
];

// Generate mock order data
function generateMockOrders(count: number): Order[] {
  const orders: Order[] = [];

  for (let i = 1; i <= count; i++) {
    const orderDate = new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
    );
    const lastUpdatedDate = new Date(
      orderDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    );
    const offering = offerings[Math.floor(Math.random() * offerings.length)];

    orders.push({
      id: `ORD-${String(i).padStart(6, "0")}`,
      publicIdentifier: `PI-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
      channel: channels[Math.floor(Math.random() * channels.length)],
      businessProcess:
        businessProcesses[Math.floor(Math.random() * businessProcesses.length)],
      state: states[Math.floor(Math.random() * states.length)],
      offeringId: offering.id,
      offeringName: offering.name,
      orderDate: orderDate.toISOString(),
      lastUpdatedDate: lastUpdatedDate.toISOString(),
      partyId: `PARTY-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      profileId: `PROFILE-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`,
      salesOrganization: `SALES-${Math.floor(Math.random() * 5) + 1}`,
      group: `GROUP-${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      details: generateOrderDetails(offering.id),
    });
  }

  return orders;
}

function generateOrderDetails(offeringId: string) {
  // Generate different details based on offering type
  switch (offeringId) {
    case "OFF-001":
    case "OFF-002":
    case "OFF-005":
      return {
        internetSpeed: `${Math.floor(Math.random() * 900) + 100} Mbps`,
        installationDate: new Date(
          Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000
        ).toISOString(),
        contractLength: `${Math.floor(Math.random() * 2) + 1} year`,
        location: {
          address: `${Math.floor(Math.random() * 999) + 1} Main St`,
          city: "Cityville",
          state: "CA",
          zip: "90210",
        },
        price: Math.floor(Math.random() * 50) + 50,
        currency: "USD",
      };
    case "OFF-003":
      return {
        planType: ["Basic", "Standard", "Premium"][
          Math.floor(Math.random() * 3)
        ],
        dataAllowance: `${Math.floor(Math.random() * 100) + 1}GB`,
        phoneNumber: `(${Math.floor(Math.random() * 900) + 100}) ${
          Math.floor(Math.random() * 900) + 100
        }-${Math.floor(Math.random() * 9000) + 1000}`,
        activationDate: new Date(
          Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
        ).toISOString(),
        price: Math.floor(Math.random() * 40) + 30,
        currency: "USD",
      };
    case "OFF-004":
      return {
        packageName: [
          "Basic",
          "Entertainment",
          "Sports",
          "Premium",
          "All-Inclusive",
        ][Math.floor(Math.random() * 5)],
        channels: Math.floor(Math.random() * 200) + 50,
        installationDate: new Date(
          Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
        ).toISOString(),
        contractLength: `${Math.floor(Math.random() * 2) + 1} year`,
        price: Math.floor(Math.random() * 60) + 40,
        currency: "USD",
      };
    default:
      return {};
  }
}

// Mock data for metrics
export const getOrderMetrics = () => {
  return {
    totalOrders: 756,
    acceptedOrders: 495,
    inProgressOrders: 187,
    canceledOrders: 42,
    completedOrders: 266,
  };
};

// Mock distribution data
export const getChannelDistribution = () => {
  return [
    { name: "Online", count: 345, percentage: 45.6 },
    { name: "Mobile", count: 198, percentage: 26.2 },
    { name: "Retail", count: 87, percentage: 11.5 },
    { name: "Call Center", count: 95, percentage: 12.6 },
    { name: "Partner", count: 31, percentage: 4.1 },
  ];
};

export const getBusinessDistribution = () => {
  return [
    { name: "New Order", count: 413, percentage: 54.6 },
    { name: "Change Order", count: 158, percentage: 20.9 },
    { name: "Upgrade", count: 98, percentage: 13.0 },
    { name: "Downgrade", count: 56, percentage: 7.4 },
    { name: "Cancel Order", count: 31, percentage: 4.1 },
  ];
};

// Mock weekly trends
export const getWeeklyTrends = () => {
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

  return {
    weeklyOrders: {
      weeks,
      data: [125, 147, 132, 156],
    },
    weeklyPomErrors: {
      weeks,
      data: [12, 8, 15, 7],
    },
    volumeVsServiceLevels: {
      weeks,
      volume: [125, 147, 132, 156],
      serviceLevel: [92, 94, 89, 95],
    },
  };
};

// Mock orders data for table
const mockOrders = generateMockOrders(100);

export const getOrders = async (
  page: number = 1,
  pageSize: number = 10,
  filters: {
    search?: string;
    searchType?: string;
    channel?: string;
    businessProcess?: string;
    state?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}
): Promise<{ orders: Order[]; totalCount: number }> => {
  try {
    // Prepare query parameters
    const params: Record<string, any> = {
      page,
      pageSize,
      ...filters,
    };

    // Make API request using crudService
    const response = await crudService.get<{
      orders: Order[];
      totalCount: number;
    }>({
      endpoint: "orders",
      params,
    });

    return response;
  } catch (error) {
    console.log("Error fetching orders:", error);
  }
};

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((order) => order.id === id);
};

export const getBpmnDiagramXml = (): string => {
  // This is a simplified BPMN XML for demonstration
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0jsa7di" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.8.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Validate Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:exclusiveGateway id="Gateway_1" name="Order Valid?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Gateway_1" />
    <bpmn:task id="Activity_2" name="Process Order">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_3" name="Yes" sourceRef="Gateway_1" targetRef="Activity_2" />
    <bpmn:task id="Activity_3" name="Reject Order">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_4" name="No" sourceRef="Gateway_1" targetRef="Activity_3" />
    <bpmn:endEvent id="EndEvent_1" name="Order Completed">
      <bpmn:incoming>Flow_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Activity_2" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_2" name="Order Rejected">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Activity_3" targetRef="EndEvent_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="270" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="177" />
        <di:waypoint x="425" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="475" y="177" />
        <di:waypoint x="530" y="177" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="494" y="159" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="450" y="202" />
        <di:waypoint x="450" y="290" />
        <di:waypoint x="530" y="290" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="458" y="243" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="630" y="177" />
        <di:waypoint x="692" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="630" y="290" />
        <di:waypoint x="692" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="159" y="202" width="77" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="270" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="425" y="152" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="421" y="122" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_2_di" bpmnElement="Activity_2">
        <dc:Bounds x="530" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_3_di" bpmnElement="Activity_3">
        <dc:Bounds x="530" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="692" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="666" y="202" width="88" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_2_di" bpmnElement="EndEvent_2">
        <dc:Bounds x="692" y="272" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="669" y="315" width="82" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
};
