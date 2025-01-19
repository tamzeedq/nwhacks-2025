// Sample data - replace with real ESP32 data
export const memoryData = [
    { time: '00:00', freeHeap: 200000, flashUsed: 700000, stackUsed: 3000, psramUsed: 150000 },
    { time: '00:05', freeHeap: 195000, flashUsed: 705000, stackUsed: 3200, psramUsed: 155000 },
    { time: '00:10', freeHeap: 190000, flashUsed: 710000, stackUsed: 3400, psramUsed: 160000 },
    { time: '00:15', freeHeap: 188000, flashUsed: 712000, stackUsed: 3300, psramUsed: 158000 },
    { time: '00:20', freeHeap: 185000, flashUsed: 715000, stackUsed: 3500, psramUsed: 162000 },
];
  
export const memoryTypes = {
    heap: {
      title: 'Heap Memory',
      dataKey: 'freeHeap',
      color: '#0ea5e9',
      unit: 'KB',
      description: 'Dynamic memory allocation for runtime variables and objects',
      total: 320000,
    },
    flash: {
      title: 'Flash Memory',
      dataKey: 'flashUsed',
      color: '#84cc16',
      unit: 'KB',
      description: 'Non-volatile storage for program code and constant data',
      total: 4000000,
    },
    stack: {
      title: 'Stack Memory',
      dataKey: 'stackUsed',
      color: '#f59e0b',
      unit: 'B',
      description: 'Memory for function calls and local variables',
      total: 8000,
    },
    psram: {
      title: 'PSRAM',
      dataKey: 'psramUsed',
      color: '#8b5cf6',
      unit: 'KB',
      description: 'External RAM for additional memory requirements',
      total: 200000,
    },
  };
  