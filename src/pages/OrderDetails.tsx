
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OrderDetailsView from "@/components/orders/OrderDetailsView";
import ShipmentTrackingDrawer from "@/components/orders/ShipmentTrackingDrawer";

const OrderDetails = () => {
  const location = useLocation();
  const orderData = location.state;
  const [order] = useState<any>(orderData);

  return (
    <Layout>
      <OrderDetailsView order={order} />
    </Layout>
  );
};

export default OrderDetails;
