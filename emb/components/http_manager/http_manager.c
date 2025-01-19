#include "http_manager.h"
#include "esp_http_client.h"
#include <stdio.h>

void http_manager_post(const char *url, const char *post_data) {
    esp_http_client_config_t config = {
        .url = url,
        .method = HTTP_METHOD_POST,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);

    esp_http_client_set_header(client, "Content-Type", "application/json");
    esp_http_client_set_post_field(client, post_data, strlen(post_data));

    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        //printf("HTTP POST request successful, status = %d\n", esp_http_client_get_status_code(client));
    } else {
        //printf("HTTP POST request failed: %s\n", esp_err_to_name(err));
    }

    esp_http_client_cleanup(client);
}
