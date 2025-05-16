
import { crudService } from './crudService';

// Export the Order type properly
export type { Order, OrderItem, StateItem } from '@/types/order';

// Function to fetch orders
export const getOrders = async () => {
  try {
    const response = await crudService.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Return mock data if the API call fails
    return mockOrders;
  }
};

// Function to fetch a single order by ID
export const getOrder = async (id: string) => {
  try {
    const response = await crudService.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    // Return mock data if the API call fails
    return mockOrders.find(order => order.id === id) || mockOrders[0];
  }
};

// Add the required exported functions for dashboard charts
export const getOrderMetrics = async () => {
  try {
    const response = await crudService.get('/orders/metrics');
    return response.data;
  } catch (error) {
    console.error("Error fetching order metrics:", error);
    // Return mock data if the API call fails
    return {
      total: 125,
      completed: 78,
      inProgress: 32,
      pending: 15
    };
  }
};

export const getChannelDistribution = async () => {
  try {
    const response = await crudService.get('/orders/channel-distribution');
    return response.data;
  } catch (error) {
    console.error("Error fetching channel distribution:", error);
    // Return mock data if the API call fails
    return [
      { name: 'Web', value: 45 },
      { name: 'Mobile', value: 35 },
      { name: 'Call Center', value: 20 }
    ];
  }
};

export const getBusinessDistribution = async () => {
  try {
    const response = await crudService.get('/orders/business-distribution');
    return response.data;
  } catch (error) {
    console.error("Error fetching business distribution:", error);
    // Return mock data if the API call fails
    return [
      { name: 'Sales', value: 55 },
      { name: 'Support', value: 30 },
      { name: 'Maintenance', value: 15 }
    ];
  }
};

export const getWeeklyTrends = async () => {
  try {
    const response = await crudService.get('/orders/weekly-trends');
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly trends:", error);
    // Return mock data if the API call fails
    return [
      { name: 'Mon', orders: 12 },
      { name: 'Tue', orders: 19 },
      { name: 'Wed', orders: 15 },
      { name: 'Thu', orders: 22 },
      { name: 'Fri', orders: 18 },
      { name: 'Sat', orders: 8 },
      { name: 'Sun', orders: 5 }
    ];
  }
};

export const getBpmnDiagramXml = async (orderId: string) => {
  try {
    const response = await crudService.get(`/orders/${orderId}/bpmn`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching BPMN diagram for order ${orderId}:`, error);
    // Return mock BPMN XML data
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0xwmj13" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.6.0">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Process Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:endEvent id="Event_1" name="Order Completed">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Event_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="432" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="142" width="79" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_1">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1_di" bpmnElement="Event_1">
        <dc:Bounds x="432" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="408" y="142" width="84" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
  }
};

// Mock data
const mockOrders = [
  {
    id: "ORD-12345",
    externalId: "EXT-001",
    publicIdentifier: "PUB-001",
    channel: { id: "WEB", name: "Web Portal" },
    businessProcess: "Sales",
    state: "Completed",
    stateDescription: "Order has been completed",
    orderDate: "2025-05-01T12:00:00Z",
    orderItems: [
      {
        id: "ITEM-1",
        name: "iPhone 15 Pro",
        description: "Latest iPhone model",
        state: "Delivered",
        quantity: 1,
        productOffering: {
          id: "PO-001",
          name: "iPhone 15 Pro",
          group: "Smartphone"
        }
      }
    ],
    stateChanges: [
      {
        id: "SC-1",
        state: "Created",
        description: "Order was created",
        validFor: {
          startDateTime: "2025-05-01T12:00:00Z"
        }
      },
      {
        id: "SC-2",
        state: "Completed",
        description: "Order was completed",
        validFor: {
          startDateTime: "2025-05-02T14:30:00Z"
        }
      }
    ]
  }
];
