// #ifndef JSON_MANAGER_H
// #define JSON_MANAGER_H

// #include "stddef.h"

// void json_manager_format_free_heap(char *buffer, size_t buffer_size, size_t free_heap);

// #endif // JSON_MANAGER_H

#ifndef JSON_MANAGER_H
#define JSON_MANAGER_H

#include <stddef.h>

/* Structure to store memory diagnostics data */
typedef struct {
    size_t free_heap;
    size_t min_free_heap;
    size_t largest_block;
    size_t total_heap;
    size_t free_internal_ram;
    size_t stack_watermark;
} memory_diagnostics_t;

/* Function to format memory diagnostics into JSON */
void json_manager_format(char *buffer, size_t buffer_size, const memory_diagnostics_t *mem_data);

#endif // JSON_MANAGER_H
