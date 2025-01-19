// #include "json_manager.h"
// #include <stdio.h>
// #include <string.h>

// void json_manager_format_free_heap(char *buffer, size_t buffer_size, size_t free_heap) {
//     snprintf(buffer, buffer_size, "{\"free_heap\": %zu}", free_heap);
// }


#include "json_manager.h"
#include <stdio.h>

void json_manager_format(char *buffer, size_t buffer_size, const memory_diagnostics_t *mem_data) {
    snprintf(buffer, buffer_size, 
        "{"
        "\"free_heap\": %zu,\n"
        "\"min_free_heap\": %zu,\n"
        "\"largest_block\": %zu,\n"
        "\"total_heap\": %zu,\n"
        "\"free_internal_ram\": %zu,\n"
        "\"stack_watermark\": %zu\n"
        "}", 
        mem_data->free_heap, 
        mem_data->min_free_heap, 
        mem_data->largest_block, 
        mem_data->total_heap, 
        mem_data->free_internal_ram, 
        mem_data->stack_watermark
    );
}
