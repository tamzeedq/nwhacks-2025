#include "wifi_manager.h"
#include "esp_event.h"
#include "esp_wifi.h"
#include "esp_netif.h"
#include "nvs_flash.h"
#include <stdio.h>

/* Wi-Fi Event Handler */
static void wifi_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data) {
    //printf("Event received: Base = %s, ID = %ld\n", event_base, event_id);

    if (event_base == WIFI_EVENT) {
        switch (event_id) {
            case WIFI_EVENT_STA_START:
                //printf("Wi-Fi started, attempting to connect...\n");
                esp_wifi_connect();  
                break;

            case WIFI_EVENT_STA_CONNECTED:
                //printf("Wi-Fi connected to the access point.\n");
                break;

            case WIFI_EVENT_STA_DISCONNECTED:
                //printf("Wi-Fi disconnected. Retrying...\n");
                esp_wifi_connect();  
                break;

            default:
                //printf("Unhandled Wi-Fi event: %ld\n", event_id);
                break;
        }
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t *event = (ip_event_got_ip_t *)event_data;
        //printf("Got IP address: %d.%d.%d.%d\n", IP2STR(&event->ip_info.ip));
    }
}

/* Wi-Fi Connection Setup */
esp_err_t establish_connection() {
    esp_err_t ret;

    /* Initialize NVS */
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }

    if (ret != ESP_OK) {
        //printf("NVS Flash init failed: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Initialize Network Interface */
    esp_netif_init();
    esp_event_loop_create_default();
    esp_netif_create_default_wifi_sta();

    /* Register event handlers */
    esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, NULL);
    esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, NULL, NULL);

    /* Wi-Fi Config */
    wifi_init_config_t wifi_init_config = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&wifi_init_config);
    esp_wifi_set_mode(WIFI_MODE_STA);

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = "nwHacks2025",
            .password = "nw_Hacks_2025",
        },
    };

    esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
    esp_wifi_start();

    //printf("Wi-Fi initialization complete. Waiting for connection...\n");

    return ESP_OK;
}

