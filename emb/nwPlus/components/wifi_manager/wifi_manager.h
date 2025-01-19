#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include "esp_wifi.h"
#include "esp_mac.h"
#include "nvs_flash.h"
#include "esp_netif.h"
#include "esp_event.h"
#include "lwip/ip_addr.h"
#include <stdio.h>

esp_err_t establish_connection(void);

#ifdef __cplusplus
}
#endif
