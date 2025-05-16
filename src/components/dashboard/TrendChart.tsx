
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, ComposedChart } from 'recharts';

interface SingleTrendProps {
  title: string;
  data: {
    weeks: string[];
    data: number[];
  };
  color?: string;
}

interface DualTrendProps {
  title: string;
  data: {
    weeks: string[];
    volume: number[];
    serviceLevel: number[];
  };
  primaryColor?: string;
  secondaryColor?: string;
}

export const SingleTrendChart = ({ title, data, color = "#e20074" }: SingleTrendProps) => {
  const chartData = data.weeks.map((week, index) => ({
    name: week,
    value: data.data[index]
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, r: 5 }}
                activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const DualTrendChart = ({ 
  title, 
  data, 
  primaryColor = "#e20074",
  secondaryColor = "#2238df"
}: DualTrendProps) => {
  const chartData = data.weeks.map((week, index) => ({
    name: week,
    volume: data.volume[index],
    serviceLevel: data.serviceLevel[index]
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
                label={{ 
                  value: 'Volume', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12 }
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#f0f0f0' }}
                axisLine={{ stroke: '#f0f0f0' }}
                label={{ 
                  value: 'Service Level (%)', 
                  angle: 90, 
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fontSize: 12 }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
              <Legend 
                iconSize={10}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: value === 'volume' ? primaryColor : secondaryColor }}>
                    {value === 'volume' ? 'Volume' : 'Service Level'}
                  </span>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="volume"
                fill={primaryColor}
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="serviceLevel"
                stroke={secondaryColor}
                strokeWidth={3}
                dot={{ fill: secondaryColor, r: 5 }}
                activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Set default export to SingleTrendChart
export default SingleTrendChart;
