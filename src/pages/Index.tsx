
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import MetricsCard from '@/components/dashboard/MetricsCard';
import DistributionChart from '@/components/dashboard/DistributionChart';
import TrendChart from '@/components/dashboard/TrendChart';
import { getOrderMetrics, getChannelDistribution, getBusinessDistribution, getWeeklyTrends } from '@/services/orderService';

const Index = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    acceptedOrders: 0,
    inProgressOrders: 0,
    canceledOrders: 0,
    completedOrders: 0
  });
  
  const [channelData, setChannelData] = useState<Array<{name: string, count: number, percentage: number}>>([]);
  const [businessData, setBusinessData] = useState<Array<{name: string, count: number, percentage: number}>>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<Array<{name: string, orders: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [metricsData, channelsData, businessProcData, trendsData] = await Promise.all([
          getOrderMetrics(),
          getChannelDistribution(),
          getBusinessDistribution(),
          getWeeklyTrends()
        ]);
        
        setMetrics(metricsData);
        setChannelData(channelsData);
        setBusinessData(businessProcData);
        setWeeklyTrends(trendsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <MetricsCard 
                title="Total Orders" 
                value={metrics.totalOrders} 
                className="md:col-span-1"
              />
              <MetricsCard 
                title="Accepted" 
                value={metrics.acceptedOrders} 
                className="md:col-span-1" 
                status="accepted"
              />
              <MetricsCard 
                title="In Progress" 
                value={metrics.inProgressOrders} 
                className="md:col-span-1"
                status="in-progress" 
              />
              <MetricsCard 
                title="Completed" 
                value={metrics.completedOrders} 
                className="md:col-span-1"
                status="completed" 
              />
              <MetricsCard 
                title="Canceled" 
                value={metrics.canceledOrders} 
                className="md:col-span-1"
                status="canceled" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DistributionChart 
                title="Channel Distribution" 
                data={channelData}
              />
              <DistributionChart 
                title="Business Process Distribution" 
                data={businessData}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <TrendChart 
                title="Weekly Order Trends" 
                data={weeklyTrends}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
