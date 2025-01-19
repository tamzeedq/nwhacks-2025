#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stddef.h>

// Format free heap as JSON
void json_manager_format_free_heap(char *json_buffer, size_t buffer_size, size_t free_heap);

// Format multiple parameters (scalable function for later use)
void json_manager_format_all(char *json_buffer, size_t buffer_size, size_t free_heap, size_t largest_free_block);

#ifdef __cplusplus
}
#endif
