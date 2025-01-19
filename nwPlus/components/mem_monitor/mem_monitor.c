#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"

#include "json_manager.h"
#include "mem_monitor.h"

static void mem_monitor_task(void *pvParam)
{
    while (1) {

        char json_buffer[128];

        // Add free heap info
        size_t free_heap = esp_get_free_heap_size();
        json_manager_format_free_heap(json_buffer, 128, free_heap);
        printf("%s\n", json_buffer);
        vTaskDelay(pdMS_TO_TICKS(5000)); // Wait 5 seconds
    }
}

void mem_monitor_start(void)
{
    xTaskCreate(
        mem_monitor_task,
        "mem_monitor_task",
        2048,
        NULL,
        5,
        NULL
    );
}
