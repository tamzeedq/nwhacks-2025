#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mem_monitor.h"
#include "wifi_manager.h"
#include "http_manager.h"
#include "temp_sensor.h"

// Track previous temperature value
static float previous_temperature = 0.0;
static void *allocated_memory = NULL;
static size_t allocated_size = 0;

void temp_monitor_task(void *pvParameter) {
    while (1) {
        float temperature;
        if (tmp36_sensor_read(&temperature) == ESP_OK) {
            printf("Temperature: %.2f°C\n", temperature);

            // Check temperature difference for memory allocation/freeing
            if (temperature - previous_temperature >= 0.05) {
                // Allocate 1KB (1024 bytes)
                void *new_alloc = malloc(20480);
                if (new_alloc) {
                    allocated_size += 10240;
                    allocated_memory = new_alloc;
                    printf("Allocated 10KB. Total allocated: %zu bytes\n", allocated_size);
                } else {
                    printf("Memory allocation failed.\n");
                }
            } else if (previous_temperature - temperature >= 0.05 && allocated_memory != NULL) {
                // Free 1KB
                free(allocated_memory);
                allocated_size -= 10240;
                allocated_memory = NULL;
                printf("Freed 10KB. Total allocated: %zu bytes\n", allocated_size);
            }

            previous_temperature = temperature;  // Update the previous temperature
        } else {
            printf("Failed to read temperature\n");
        }

        vTaskDelay(pdMS_TO_TICKS(1000));  // Delay 5 seconds
    }
}

void app_main(void) {
    // Initialize the TMP36 sensor
    if (tmp36_sensor_init() == ESP_OK) {
        printf("Temperature sensor initialized.\n");
    } else {
        printf("Failed to initialize temperature sensor.\n");
        return;
    }

    // Establish Wi-Fi connection
    if (establish_connection() == ESP_OK) {
        printf("Wi-Fi connected successfully.\n");

        // Start temperature monitoring in a FreeRTOS task
        xTaskCreate(temp_monitor_task, "temp_monitor_task", 4096, NULL, 5, NULL);

        while (1) {
            // Get memory data and format JSON
            char json_buffer[256];
            mem_monitor_get_data(json_buffer, sizeof(json_buffer));

            // Send JSON data via HTTP
            http_manager_post("http://10.19.133.58:5000/esp32", json_buffer);

            vTaskDelay(pdMS_TO_TICKS(1000));  // Wait 5 seconds before sending again
        }
    } else {
        printf("Failed to connect to Wi-Fi.\n");
    }
}
