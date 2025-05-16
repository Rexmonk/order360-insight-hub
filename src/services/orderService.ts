
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
