// #include "mem_monitor.h"
// #include "esp_system.h"
// #include "json_manager.h"
// #include <stdio.h>

// void mem_monitor_get_data(char *json_buffer, size_t buffer_size) {
//     // Get free heap memory size
//     size_t free_heap = esp_get_free_heap_size();
//     json_manager_format_free_heap(json_buffer, buffer_size, free_heap);
// }

#include "mem_monitor.h"
#include "esp_system.h"
#include "json_manager.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_heap_caps.h"
#include <stdio.h>

void mem_monitor_get_data(char *json_buffer, size_t buffer_size) {
    // Collect memory diagnostics
    memory_diagnostics_t mem_data;
    mem_data.free_heap = esp_get_free_heap_size();
    mem_data.min_free_heap = esp_get_minimum_free_heap_size();
    mem_data.largest_block = heap_caps_get_largest_free_block(MALLOC_CAP_DEFAULT);
    mem_data.total_heap = heap_caps_get_total_size(MALLOC_CAP_DEFAULT);
    mem_data.free_internal_ram = heap_caps_get_free_size(MALLOC_CAP_INTERNAL);
    mem_data.stack_watermark = uxTaskGetStackHighWaterMark(NULL);

    // Format memory diagnostics into JSON
    json_manager_format(json_buffer, buffer_size, &mem_data);
}
