#include "wifi_manager.h"
#include "esp_event.h"
#include "esp_wifi.h"
#include "nvs_flash.h"
#include <stdio.h>

/* Wi-Fi Event Handler */
static void wifi_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data) {
    if (event_base == WIFI_EVENT) {
        switch (event_id) {
            case WIFI_EVENT_STA_START:
                printf("Wi-Fi started, attempting to connect...\n");
                esp_wifi_connect();  // Automatically try to connect
                break;

            case WIFI_EVENT_STA_CONNECTED:
                printf("Wi-Fi connected to the access point.\n");
                break;

            case WIFI_EVENT_STA_DISCONNECTED:
                printf("Wi-Fi disconnected. Retrying...\n");
                esp_wifi_connect();  // Automatically retry connection
                break;

            default:
                printf("Unhandled Wi-Fi event: %ld\n", event_id);
                break;
        }
    } else if (event_base == IP_EVENT && event_id == IP_EVENT_STA_GOT_IP) {
        ip_event_got_ip_t *event = (ip_event_got_ip_t *)event_data;
        printf("Got IP address: %d.%d.%d.%d\n", IP2STR(&event->ip_info.ip));
    }
}

/* Enable and Restart DHCP Client */
void restart_dhcp_client() {
    esp_netif_t *sta_netif = esp_netif_get_handle_from_ifkey("WIFI_STA_DEF");
    if (!sta_netif) {
        printf("Failed to get ESP-NETIF handle for station\n");
        return;
    }

    // Stop the DHCP client if it’s already running
    esp_err_t ret = esp_netif_dhcpc_stop(sta_netif);
    if (ret != ESP_OK && ret != ESP_ERR_ESP_NETIF_DHCP_ALREADY_STOPPED) {
        printf("Failed to stop DHCP client: %s\n", esp_err_to_name(ret));
        return;
    }

    // Start the DHCP client
    ret = esp_netif_dhcpc_start(sta_netif);
    if (ret == ESP_OK) {
        printf("DHCP client restarted successfully\n");
    } else {
        printf("Failed to start DHCP client: %s\n", esp_err_to_name(ret));
    }
}

/* Establish Wi-Fi Connection */
esp_err_t establish_connection() {
    esp_err_t ret;

    /* Initialize NVS */
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    if (ret != ESP_OK) {
        printf("NVS Flash could not be initialized: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Initialize the default event loop */
    ret = esp_event_loop_create_default();
    if (ret != ESP_OK) {
        printf("Failed to create default event loop: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Register event handlers */
    ret = esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL, NULL);
    if (ret != ESP_OK) {
        printf("Failed to register Wi-Fi event handler: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }
    ret = esp_event_handler_instance_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &wifi_event_handler, NULL, NULL);
    if (ret != ESP_OK) {
        printf("Failed to register IP event handler: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Create default Wi-Fi STA interface */
    esp_netif_t *sta_netif = esp_netif_create_default_wifi_sta();
    if (!sta_netif) {
        printf("Failed to create default Wi-Fi STA interface\n");
        return ESP_FAIL;
    }

    /* Restart DHCP Client */
    restart_dhcp_client();

    /* Initialize Wi-Fi */
    wifi_init_config_t defaultInitConfig = WIFI_INIT_CONFIG_DEFAULT();
    ret = esp_wifi_init(&defaultInitConfig);
    if (ret != ESP_OK) {
        printf("Wi-Fi initialization failed with error code: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Set Wi-Fi to Station Mode */
    ret = esp_wifi_set_mode(WIFI_MODE_STA);
    if (ret != ESP_OK) {
        printf("Wi-Fi mode set to station failed with error code: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Configure Wi-Fi credentials */
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = "nwHacks2025",
            .password = "nw_Hacks_2025",
        },
    };
    ret = esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
    if (ret != ESP_OK) {
        printf("Wi-Fi configuration failed with error code: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    /* Start Wi-Fi */
    ret = esp_wifi_start();
    if (ret != ESP_OK) {
        printf("Wi-Fi start failed with error code: %s\n", esp_err_to_name(ret));
        return ESP_FAIL;
    }

    printf("Wi-Fi initialization complete. Waiting for events...\n");
    return ESP_OK;
}

