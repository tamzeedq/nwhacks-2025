#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "mem_monitor.h"
#include "wifi_manager.h"

void app_main(void)
{
    // Establish internet connection
    establish_connection();

    // Start the memory monitor task
    // mem_monitor_start();
}
