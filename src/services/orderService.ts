
import { crudService } from "./crudService";
import type { Order } from "@/types/order";

// Get a specific order by ID
export const getOrder = async (id: string): Promise<Order> => {
  try {
    return await crudService.get('/order-management/v1/order/' + id, {
      mockData: {
        id: id,
        state: "InProgress",
        channel: { id: "Web" },
        orderItems: []
      },
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Get the order metrics (counts by status)
export const getOrderMetrics = async () => {
  try {
    return await crudService.get('/order-metrics', {
      mockData: {
        totalOrders: 125,
        acceptedOrders: 32,
        inProgressOrders: 48,
        canceledOrders: 10,
        completedOrders: 35
      },
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching order metrics:", error);
    throw error;
  }
};

// Get channel distribution data
export const getChannelDistribution = async () => {
  try {
    return await crudService.get('/channel-distribution', {
      mockData: [
        { name: "Web", count: 65, percentage: 52 },
        { name: "Mobile App", count: 42, percentage: 33.6 },
        { name: "Call Center", count: 18, percentage: 14.4 }
      ],
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching channel distribution:", error);
    throw error;
  }
};

// Get business process distribution data
export const getBusinessDistribution = async () => {
  try {
    return await crudService.get('/business-distribution', {
      mockData: [
        { name: "New Sales", count: 70, percentage: 56 },
        { name: "Upgrades", count: 25, percentage: 20 },
        { name: "Renewals", count: 18, percentage: 14.4 },
        { name: "Returns", count: 12, percentage: 9.6 }
      ],
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching business distribution:", error);
    throw error;
  }
};

// Get weekly trends data
export const getWeeklyTrends = async () => {
  try {
    return await crudService.get('/weekly-trends', {
      mockData: [
        { name: "Mon", orders: 12 },
        { name: "Tue", orders: 19 },
        { name: "Wed", orders: 15 },
        { name: "Thu", orders: 22 },
        { name: "Fri", orders: 28 },
        { name: "Sat", orders: 15 },
        { name: "Sun", orders: 8 }
      ],
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching weekly trends:", error);
    throw error;
  }
};

// Get BPMN diagram XML for a specific order
export const getBpmnDiagramXml = async (orderId: string) => {
  try {
    return await crudService.get('/bpmn-diagram/' + orderId, {
      mockData: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Created">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_Validate" name="Validate Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_Validate" />
    <bpmn:task id="Activity_Process" name="Process Order">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_Validate" targetRef="Activity_Process" />
    <bpmn:endEvent id="Event_End" name="Order Completed">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Process" targetRef="Event_End" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="134" y="145" width="73" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1_di" bpmnElement="Activity_Validate">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_2_di" bpmnElement="Activity_Process">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_End_di" bpmnElement="Event_End">
        <dc:Bounds x="562" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="537" y="145" width="86" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="562" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`,
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching BPMN diagram:", error);
    throw error;
  }
};

// Get shipment tracking data for an order
export const getShipmentTracking = async (orderId: string) => {
  try {
    return await crudService.get('/shipment-tracking/' + orderId, {
      mockData: [{
        id: "ST-" + orderId + "-001",
        href: "https://api.example.com/shipment/" + orderId,
        carrier: "FastShip Express",
        trackingCode: "FS" + Math.floor(10000000 + Math.random() * 90000000),
        carrierTrackingUrl: "https://track.fastship.example/track",
        trackingDate: new Date().toISOString(),
        status: "in transit",
        statusChangeDate: new Date().toISOString(),
        statusChangeReason: "Package is on the way to destination",
        weight: 2.5,
        estimatedDeliveryDate: new Date(Date.now() + 2*24*60*60*1000).toISOString(),
        addressFrom: {
          id: "ADDR-001",
          href: "https://api.example.com/address/001",
          city: "San Francisco",
          stateOrProvince: "CA",
          country: "USA",
          postcode: "94105"
        },
        addressTo: {
          id: "ADDR-002",
          href: "https://api.example.com/address/002",
          city: "New York",
          stateOrProvince: "NY",
          country: "USA",
          postcode: "10001"
        },
        checkpoint: [
          {
            status: "picked up",
            message: "Package picked up by courier",
            date: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
            checkPost: "Origin Facility",
            city: "San Francisco",
            stateOrProvince: "CA",
            country: "USA"
          },
          {
            status: "in transit",
            message: "Package has left origin facility",
            date: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
            checkPost: "Distribution Center",
            city: "Denver",
            stateOrProvince: "CO",
            country: "USA"
          },
          {
            status: "in transit",
            message: "Package arrived at destination facility",
            date: new Date().toISOString(),
            checkPost: "Destination Facility",
            city: "New York",
            stateOrProvince: "NY",
            country: "USA"
          }
        ],
        order: [
          {
            id: orderId,
            href: "https://api.example.com/order/" + orderId,
            name: "Customer Order",
            referredType: "Order"
          }
        ],
        relatedCustomer: {
          id: "CUST-001",
          href: "https://api.example.com/customer/001",
          name: "John Doe",
          description: "Premium Customer"
        },
        createDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        shippingOrderItems: [
          {
            id: 1,
            name: "iPhone 15 Pro 128GB",
            characteristics: []
          }
        ]
      }],
      useMock: true
    });
  } catch (error) {
    console.error("Error fetching shipment tracking:", error);
    throw error;
  }
};
