
import Layout from '@/components/layout/Layout';
import OrderTable from '@/components/orders/OrderTable';

const OrderOverview = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order Overview</h1>
          <p className="text-gray-500">
            Search, filter, and manage all orders in the system
          </p>
        </div>
        
        <OrderTable />
      </div>
    </Layout>
  );
};

export default OrderOverview;
