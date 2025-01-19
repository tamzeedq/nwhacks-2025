#include <stdio.h>
#include "json_manager.h"

// Formats only the free heap into a JSON string
void json_manager_format_free_heap(char *json_buffer, size_t buffer_size, size_t free_heap) {
    snprintf(json_buffer, buffer_size, "{\"free_heap\": %u}", free_heap);
}

// Formats multiple parameters into a JSON string
void json_manager_format_all(char *json_buffer, size_t buffer_size, size_t free_heap, size_t largest_free_block) {
    snprintf(json_buffer, buffer_size,
             "{\"free_heap\": %u, \"largest_free_block\": %u}",
             free_heap, largest_free_block);
}
