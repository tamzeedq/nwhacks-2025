"use client"
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, CartesianGrid } from 'recharts';
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
  const currentValue = data[data.length - 1][memType.dataKey];

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
            {`${memType.title} (${(currentValue / (memType.unit === 'KB' ? 1024 : 1)).toFixed(2)} ${memType.unit})`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.slice(-5)}>
                <Line 
                  type="monotone" 
                  dataKey={memType.dataKey} 
                  stroke={memType.color} 
                  dot={false}
                />
                <CartesianGrid stroke="#ccc" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MiniGraph;