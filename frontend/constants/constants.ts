// Sample data - replace with real ESP32 data
export const memoryData = [
    { time: '00:00', freeHeap: 200000, flashUsed: 700000, stackUsed: 3000, psramUsed: 150000 },
    { time: '00:05', freeHeap: 195000, flashUsed: 705000, stackUsed: 3200, psramUsed: 155000 },
    { time: '00:10', freeHeap: 190000, flashUsed: 710000, stackUsed: 3400, psramUsed: 160000 },
    { time: '00:15', freeHeap: 188000, flashUsed: 712000, stackUsed: 3300, psramUsed: 158000 },
    { time: '00:20', freeHeap: 185000, flashUsed: 715000, stackUsed: 3500, psramUsed: 162000 },
];
  
// Define memory types with updated data keys
export const memoryTypes = {
  heap: {
    title: 'Heap Memory',
    description: 'Current free heap memory available',
    dataKey: 'free_heap',
    total: 354176, 
    color: '#2563eb',
    unit: 'KB'
  },
  minHeap: {
    title: 'Minimum Free Heap',
    description: 'Lowest free heap memory recorded',
    dataKey: 'min_free_heap',
    total: 354176,
    color: '#16a34a',
    unit: 'KB'
  },
  largestBlock: {
    title: 'Largest Block',
    description: 'Size of the largest free memory block',
    dataKey: 'largest_block',
    total: 354176,
    color: '#9333ea',
    unit: 'KB'
  },
  internalRam: {
    title: 'Internal RAM',
    description: 'Free internal RAM memory',
    dataKey: 'free_internal_ram',
    total: 354176,
    color: '#dc2626',
    unit: 'KB'
  }
};