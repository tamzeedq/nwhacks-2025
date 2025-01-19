"use client"

import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { memoryTypes } from '../constants/constants';

interface MiniGraphProps {
  data: any[];
  type: keyof typeof memoryTypes;
  isActive: boolean;
  onClick: () => void;
}

const MiniGraph = ({ data, type, isActive, onClick }: MiniGraphProps) => {
  const memType = memoryTypes[type];
  const currentValue = data.length > 0 ? data[data.length - 1][memType.dataKey] : 0;
  const currentPercentage = ((currentValue / memType.total) * 100).toFixed(1);

  // Transform data to percentages - now matching DetailedView calculation
  const percentageData = data.map(item => ({
    ...item,
    [memType.dataKey]: (1 - (item[memType.dataKey] / memType.total)) * 100,
    time: item.time
  }));

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm">
            {`${memType.title} (${currentPercentage}%)`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={percentageData.slice(-10)}>
                <Line 
                  type="monotone" 
                  dataKey={memType.dataKey} 
                  stroke={memType.color} 
                  dot={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={false} // Hides the axis labels
                  width={0}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MiniGraph;