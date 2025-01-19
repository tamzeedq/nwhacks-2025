"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { memoryTypes } from '../constants/constants';
import MemoryAnalysis from './MemoryAnalysis';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { ChartNoAxesCombined } from "lucide-react"
import { Button } from "../components/ui/button"

interface DetailedViewProps {
  type: keyof typeof memoryTypes;
  data: any[];
}

const DetailedView = ({ type, data }: DetailedViewProps) => {
  const memType = memoryTypes[type];
  const currentValue = data.length > 0 ? data[data.length - 1][memType.dataKey] : 0;
  const usagePercentage = ((1 - (currentValue / memType.total)) * 100).toFixed(1);
  
  // Transform data to percentages
  const percentageData = data.map(item => ({
    ...item,
    [memType.dataKey]: (1 - (item[memType.dataKey] / memType.total)) * 100,
    time: item.time
  }));

  const chartConfig = {
    mobile: {
      label: "Mobile",
      color: memType.color,
    },
  } satisfies ChartConfig

  const gradientChart = (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={percentageData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis 
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip 
          cursor={false} 
          content={<ChartTooltipContent />}
          formatter={(value: any) => [`${Number(value).toFixed(1)}%`]} 
        />
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey={memType.dataKey}
          type="natural"
          fill="url(#fillMobile)"
          fillOpacity={0.4}
          stroke={memType.color}
          name={memType.title}
          stackId="a"
          dot={true}
        />
      </AreaChart>
    </ChartContainer>
  )

  const standardChart = <LineChart data={data}>
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
        className='grid gap-12'
      >
        <Card>
          <CardContent className="pt-6">
            <motion.div
              className="grid grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StatsItem
                label="Current Free"
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
              <Button>
                <ChartNoAxesCombined /> Start Forecaster
              </Button>
            </motion.div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%" className="pl-6">
                {gradientChart}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div>
          <MemoryAnalysis type={type}/>
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