import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

const MemoryAnalysis = ({ socket }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('memory_analysis', (data) => {
      setAnalysis(data);
      setLoading(false);
    });

    return () => {
      socket.off('memory_analysis');
    };
  }, [socket]);

  const requestAnalysis = () => {
    setLoading(true);
    socket.emit('request_analysis');
  };

  return (
    <Card className="bg-white dark:bg-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          AI Memory Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="whitespace-pre-line">
                {analysis.analysis}
              </AlertDescription>
            </Alert>
            <div className="text-sm text-neutral-500">
              Analysis from: {new Date(analysis.timestamp).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-500">
            No analysis available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryAnalysis;