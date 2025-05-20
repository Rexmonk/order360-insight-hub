
// Mock data for our dashboard

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  orderDate: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'canceled';
  total: number;
  channel: string;
  items: number;
  businessProcess: string;
}

// Mock getOrderMetrics
export const getOrderMetrics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalOrders: 1254,
    acceptedOrders: 845,
    inProgressOrders: 238,
    canceledOrders: 42,
    completedOrders: 968
  };
};

// Mock getChannelDistribution
export const getChannelDistribution = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    { name: 'Online', count: 756, percentage: 60.3 },
    { name: 'In-Store', count: 312, percentage: 24.9 },
    { name: 'Phone', count: 186, percentage: 14.8 }
  ];
};

// Mock getBusinessDistribution
export const getBusinessDistribution = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    { name: 'Standard', count: 825, percentage: 65.8 },
    { name: 'Express', count: 286, percentage: 22.8 },
    { name: 'Custom', count: 143, percentage: 11.4 }
  ];
};

// Mock getWeeklyTrends
export const getWeeklyTrends = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { name: 'Week 1', orders: 245 },
    { name: 'Week 2', orders: 268 },
    { name: 'Week 3', orders: 293 },
    { name: 'Week 4', orders: 312 },
    { name: 'Week 5', orders: 286 },
    { name: 'Week 6', orders: 324 }
  ];
};

// Mock getOrders
export const getOrders = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock orders
  const orders: Order[] = Array.from({ length: 50 }).map((_, index) => {
    const id = `order-${index + 1000}`;
    const statuses = ['pending', 'accepted', 'in-progress', 'completed', 'canceled'] as const;
    const channels = ['Online', 'In-Store', 'Phone'];
    const businesses = ['Standard', 'Express', 'Custom'];
    
    return {
      id,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: `Customer ${index + 1}`,
      orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: Math.floor(100 + Math.random() * 900),
      channel: channels[Math.floor(Math.random() * channels.length)],
      items: Math.floor(1 + Math.random() * 10),
      businessProcess: businesses[Math.floor(Math.random() * businesses.length)]
    };
  });
  
  return orders;
};

// Mock getOrder
export const getOrder = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a mock order with the given ID
  const statuses = ['pending', 'accepted', 'in-progress', 'completed', 'canceled'] as const;
  const channels = ['Online', 'In-Store', 'Phone'];
  const businesses = ['Standard', 'Express', 'Custom'];
  
  return {
    id,
    orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customer: `Customer Name`,
    customerEmail: 'customer@example.com',
    customerPhone: '+1 (555) 123-4567',
    orderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    total: Math.floor(100 + Math.random() * 900),
    channel: channels[Math.floor(Math.random() * channels.length)],
    items: [
      { id: '1', name: 'Product A', quantity: 2, price: 49.99 },
      { id: '2', name: 'Product B', quantity: 1, price: 129.99 }
    ],
    businessProcess: businesses[Math.floor(Math.random() * businesses.length)],
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    timeline: [
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'created', note: 'Order created' },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'accepted', note: 'Order accepted' },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'in-progress', note: 'Processing order' }
    ]
  };
};

// Mock getBpmnDiagramXml
export const getBpmnDiagramXml = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a simple BPMN XML diagram for demonstration
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0mgi27r" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Zeebe Modeler" exporterVersion="0.11.0">
  <bpmn:process id="Process_Order_${id}" name="Order Process ${id}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Order Received">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Validate Order">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:exclusiveGateway id="Gateway_1" name="Order Valid?">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1" />
    <bpmn:task id="Task_2" name="Process Payment">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_3" name="Yes" sourceRef="Gateway_1" targetRef="Task_2" />
    <bpmn:task id="Task_3" name="Reject Order">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_4" name="No" sourceRef="Gateway_1" targetRef="Task_3" />
    <bpmn:task id="Task_4" name="Ship Order">
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_7</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_2" targetRef="Task_4" />
    <bpmn:endEvent id="EndEvent_1" name="Order Rejected">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_2" name="Order Completed">
      <bpmn:incoming>Flow_7</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_7" sourceRef="Task_4" targetRef="EndEvent_2" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_Order_${id}">
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
        <di:waypoint x="690" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="630" y="290" />
        <di:waypoint x="692" y="290" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_7_di" bpmnElement="Flow_7">
        <di:waypoint x="790" y="177" />
        <di:waypoint x="852" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="159" y="202" width="77" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0a92fo7_di" bpmnElement="Task_1">
        <dc:Bounds x="270" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1bdhing_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="425" y="152" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="421" y="122" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0c2x19m_di" bpmnElement="Task_2">
        <dc:Bounds x="530" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0zfbv1i_di" bpmnElement="Task_3">
        <dc:Bounds x="530" y="250" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1b54ojt_di" bpmnElement="Task_4">
        <dc:Bounds x="690" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0r0ffwb_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="692" y="272" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="674" y="315" width="72" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_14sfldr_di" bpmnElement="EndEvent_2">
        <dc:Bounds x="852" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="829" y="202" width="83" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
};

// Mock getProcessVariables
export const getProcessVariables = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock process variables
  return {
    items: [
      {
        key: 4503602172877124,
        processInstanceKey: 4503602172877123,
        scopeKey: 4503602172877123,
        name: "channel",
        value: "\"OneShop\"",
        truncated: false
      },
      {
        key: 4503602172877125,
        processInstanceKey: 4503602172877123,
        scopeKey: 4503602172877123,
        name: "orderId",
        value: `"${id}"`,
        truncated: false
      },
      {
        key: 4503602172877127,
        processInstanceKey: 4503602172877123,
        scopeKey: 4503602172877123,
        name: "publicIdentifier",
        value: "\"2246788283\"",
        truncated: false
      },
      {
        key: 4503602172877128,
        processInstanceKey: 4503602172877123,
        scopeKey: 4503602172877123,
        name: "correlationId",
        value: "\"2d20d377-ea79-4487-9c22-e28520228cae\"",
        truncated: false
      }
    ],
    sortValues: [4503602172877129],
    total: 4
  };
};
