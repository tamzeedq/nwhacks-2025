"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined } from "lucide-react";

const ForecasterButton: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {/* Button Trigger */}
      <Button
        onClick={() => setIsMaximized(true)}
      >
        <ChartNoAxesCombined /> Start Forecaster
      </Button>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-3xl h-[80vh] bg-white/95 dark:bg-[#17171C] backdrop-blur-sm">
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
          <div className="flex flex-col h-[72vh] overflow-y-auto text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              The Forecaster predicts future memory usage using a recurrent neural network, helping to identify potential memory leaks before they occur.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForecasterButton;
