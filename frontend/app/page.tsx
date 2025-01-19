"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MiniGraph from '../components/MiniGraph';
import DetailedView from '../components/DetailedView';
import { ThemeToggle } from '../components/ThemeToggle';
import io from 'socket.io-client';
import { memoryTypes } from '../constants/constants';

// Define the data structure for ESP32 memory data
interface ESPMemoryData {
  free_heap: number;
  min_free_heap: number;
  largest_block: number;
  total_heap: number;
  free_internal_ram: number;
  stack_watermark: number;
  time?: string; 
}


const MemoryDashboard = () => {
  const [selectedType, setSelectedType] = useState<keyof typeof memoryTypes>('heap');
  const [timeSeriesData, setTimeSeriesData] = useState<ESPMemoryData[]>([]);
  
  useEffect(() => {
    const socket = io('http://127.0.0.1:5000');

    socket.on('connect', () => {
      console.log('Connected to the web socket');
    });

    socket.on('data', (newData: ESPMemoryData) => {
      try {
        // Add timestamp to the data
        const dataWithTime = {
          ...newData,
          time: new Date().toLocaleTimeString()
        };

        setTimeSeriesData(prev => {
          // Keep last 50 data points for the time series
          const newData = [...prev, dataWithTime];
          if (newData.length > 50) {
            return newData.slice(-50);
          }
          return newData;
        });
      } catch (err) {
        console.log("Error processing data", err);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-background">
      <ThemeToggle />
      
      {/* Sidebar with mini graphs */}
      <div className="w-64 h-[calc(100vh-3rem)] flex flex-col justify-around">
        <h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="text-5xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
          >
            MemVis
          </motion.div>
        </h1>
        {Object.keys(memoryTypes).map((type, index) => (
          <motion.div
            key={type}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <MiniGraph
              data={timeSeriesData}
              type={type as keyof typeof memoryTypes}
              isActive={selectedType === type}
              onClick={() => setSelectedType(type as keyof typeof memoryTypes)}
            />
          </motion.div>
        ))}
      </div>

      {/* Main detailed view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DetailedView type={selectedType} data={timeSeriesData} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MemoryDashboard;