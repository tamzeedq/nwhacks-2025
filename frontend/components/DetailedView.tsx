"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { memoryTypes } from '../constants/constants';
import MemoryAnalysis from './MemoryAnalysis';

interface DetailedViewProps {
  type: keyof typeof memoryTypes;
  data: any[];
}

const DetailedView = ({ type, data }: DetailedViewProps) => {
  const memType = memoryTypes[type];
  const currentValue = data[data.length - 1][memType.dataKey];
  const usagePercentage = ((currentValue / memType.total) * 100).toFixed(1);

  return (
    <div className="space-y-6 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-start"
      >
        <div>
          <motion.h2 
            className="text-2xl font-bold"
            layoutId={`title-${type}`}
          >
            {memType.title}
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {memType.description}
          </motion.p>
        </div>
        {Number(usagePercentage) > 80 && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Alert variant="destructive" className="w-64">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>High Usage Warning</AlertTitle>
              <AlertDescription>
                {memType.title} usage is at {usagePercentage}%
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Stats grid items */}
              <StatsItem
                label="Current Usage"
                value={`${(currentValue / (memType.unit === 'KB' ? 1024 : 1)).toFixed(2)} ${memType.unit}`}
              />
              <StatsItem
                label="Total Available"
                value={`${(memType.total / (memType.unit === 'KB' ? 1024 : 1)).toFixed(2)} ${memType.unit}`}
              />
              <StatsItem
                label="Usage"
                value={`${usagePercentage}%`}
              />
            </motion.div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={memType.dataKey} 
                    stroke={memType.color} 
                    name={memType.title}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className='mt-6'>
          <MemoryAnalysis />
        </div>
      </motion.div>
    </div>
  );
};

const StatsItem = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
  >
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </motion.div>
);

export default DetailedView;