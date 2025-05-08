
import { useEffect, useState } from 'react';
import { AlertCircle, BarChart3, CheckCircle, Clock, Package, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import MetricsCard from '@/components/dashboard/MetricsCard';
import DistributionChart from '@/components/dashboard/DistributionChart';
import { SingleTrendChart, DualTrendChart } from '@/components/dashboard/TrendChart';
import { 
  getOrderMetrics, 
  getChannelDistribution, 
  getBusinessDistribution, 
  getWeeklyTrends 
} from '@/services/orderService';

const Index = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    acceptedOrders: 0,
    inProgressOrders: 0,
    canceledOrders: 0,
    completedOrders: 0,
  });
  
  const [channelData, setChannelData] = useState<Array<{ name: string; count: number; percentage: number }>>([]);
  const [businessData, setBusinessData] = useState<Array<{ name: string; count: number; percentage: number }>>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any>({
    weeklyOrders: { weeks: [], data: [] },
    weeklyPomErrors: { weeks: [], data: [] },
    volumeVsServiceLevels: { weeks: [], volume: [], serviceLevel: [] },
  });
  
  useEffect(() => {
    // Fetch metrics data
    const metricsData = getOrderMetrics();
    setMetrics(metricsData);
    
    // Fetch distribution data
    const channelDistribution = getChannelDistribution();
    setChannelData(channelDistribution);
    
    const businessDistribution = getBusinessDistribution();
    setBusinessData(businessDistribution);
    
    // Fetch weekly trends
    const trends = getWeeklyTrends();
    setWeeklyTrends(trends);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order360 Dashboard</h1>
          <p className="text-gray-500">
            Overview of order metrics, distributions, and performance trends
          </p>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricsCard
            title="Total Orders"
            value={metrics.totalOrders}
            icon={<Package className="h-5 w-5" />}
            change={{ value: 12, isPositive: true }}
          />
          
          <MetricsCard
            title="Accepted Orders"
            value={metrics.acceptedOrders}
            icon={<CheckCircle className="h-5 w-5" />}
            change={{ value: 8, isPositive: true }}
          />
          
          <MetricsCard
            title="In Progress Orders"
            value={metrics.inProgressOrders}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: 5, isPositive: true }}
          />
          
          <MetricsCard
            title="Canceled Orders"
            value={metrics.canceledOrders}
            icon={<AlertCircle className="h-5 w-5" />}
            change={{ value: 3, isPositive: false }}
          />
          
          <MetricsCard
            title="Completed Orders"
            value={metrics.completedOrders}
            icon={<CheckCircle className="h-5 w-5" />}
            change={{ value: 15, isPositive: true }}
          />
        </div>
        
        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DistributionChart
            title="Channel Distribution"
            data={channelData}
            colors={['#e20074', '#2238df', '#33c5dd', '#8067dc', '#b63d00']}
          />
          
          <DistributionChart
            title="Business Process Distribution"
            data={businessData}
            colors={['#8067dc', '#33c5dd', '#2238df', '#b63d00', '#e20074']}
          />
        </div>
        
        {/* Trend Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SingleTrendChart
            title="Weekly Orders"
            data={weeklyTrends.weeklyOrders}
            color="#e20074"
          />
          
          <SingleTrendChart
            title="Weekly POM Errors"
            data={weeklyTrends.weeklyPomErrors}
            color="#d91308"
          />
          
          <DualTrendChart
            title="Volume vs Service Levels"
            data={weeklyTrends.volumeVsServiceLevels}
            primaryColor="#e20074"
            secondaryColor="#2238df"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
