"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memoryData, memoryTypes } from '../constants/constants';
import MiniGraph from './components/MiniGraph';
import DetailedView from './components/DetailedView';

const MemoryDashboard = () => {
  const [selectedType, setSelectedType] = useState<keyof typeof memoryTypes>('heap');

  return (
    <div className="flex gap-6 p-6 min-h-screen">
      {/* Sidebar with mini graphs */}
      <div className="w-64 h-[calc(100vh-3rem)] flex flex-col justify-around">
        {Object.keys(memoryTypes).map((type, index) => (
          <motion.div
            key={type}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MiniGraph
              data={memoryData}
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
          <DetailedView type={selectedType} data={memoryData} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MemoryDashboard;