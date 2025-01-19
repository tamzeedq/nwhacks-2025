"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined } from "lucide-react";
import { memoryTypes } from '../constants/constants';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DetailedViewProps {
  type: keyof typeof memoryTypes;
  data: any[];
  chartConfig: any;
}

const ForecasterButton = ({ type, data, chartConfig }: DetailedViewProps) => {
  const memType = memoryTypes[type];
  const [isMaximized, setIsMaximized] = useState(false);

  data.forEach(obj => {
    obj.real = true;
  });
  console.log(data)

  const gradientChart = (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
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
          // dot={true}
        />
      </AreaChart>
    </ChartContainer>
  )

  return (
    <>
      {/* Button Trigger */}
      <Button
        onClick={() => setIsMaximized(true)}
      >
        <ChartNoAxesCombined /> Start Forecaster
      </Button>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-3xl bg-white/95 dark:bg-[#17171C] backdrop-blur-sm">
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <ChartNoAxesCombined className="w-5 h-5" />
              Forecaster
            </DialogTitle>
            {/* Close button */}
            <DialogClose 
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-0"
            >
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col overflow-y-auto text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              The Forecaster predicts future memory usage using a recurrent neural network, helping to identify potential memory leaks before they occur.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%" className="pl-6">
                {gradientChart}
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForecasterButton;
