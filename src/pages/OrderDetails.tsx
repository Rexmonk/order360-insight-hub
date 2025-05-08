
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '@/services/orderService';
import Layout from '@/components/layout/Layout';
import OrderDetailsView from '@/components/orders/OrderDetailsView';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch order details
    if (id) {
      try {
        const orderData = getOrderById(id);
        
        if (orderData) {
          setOrder(orderData);
        } else {
          setError(`Order with ID ${id} not found`);
        }
      } catch (err) {
        setError('Error retrieving order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-2"></div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Unable to retrieve order details'}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <OrderDetailsView order={order} />
    </Layout>
  );
};

export default OrderDetails;
