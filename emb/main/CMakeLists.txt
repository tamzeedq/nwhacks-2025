idf_component_register(SRCS "main.c"
                    PRIV_REQUIRES spi_flash
                    INCLUDE_DIRS ""
                    REQUIRES mem_monitor
                    REQUIRES json_manager
                    REQUIRES wifi_manager
                    REQUIRES http_manager
                    REQUIRES temp_sensor
                    REQUIRES esp_adc)

                    