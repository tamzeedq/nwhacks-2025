#include "temp_sensor.h"
#include "esp_adc/adc_oneshot.h"
#include "esp_log.h"

static const char *TAG = "TMP36_SENSOR";
static adc_oneshot_unit_handle_t adc_handle;

/**
 * @brief Initialize the ADC for TMP36 sensor readings.
 */
esp_err_t tmp36_sensor_init(void) {
    adc_oneshot_unit_init_cfg_t init_config = {
        .unit_id = ADC_UNIT_1,
        .clk_src = ADC_RTC_CLK_SRC_DEFAULT,
    };
    if (adc_oneshot_new_unit(&init_config, &adc_handle) != ESP_OK) {
        printf("Failed to initialize ADC unit");
        return ESP_FAIL;
    }

    adc_oneshot_chan_cfg_t config = {
        .atten = ADC_ATTEN_DB_12,
        .bitwidth = ADC_BITWIDTH_DEFAULT
    };
    if (adc_oneshot_config_channel(adc_handle, TMP36_ADC_CHANNEL, &config) != ESP_OK) {
        printf("Failed to configure ADC channel");
        return ESP_FAIL;
    }

    printf("TMP36 sensor initialized successfully");
    return ESP_OK;
}

/**
 * @brief Read the temperature value from the TMP36 sensor.
 */
esp_err_t tmp36_sensor_read(float *temperature) {
    if (!temperature) {
        return ESP_ERR_INVALID_ARG;
    }

    int raw_value = 0;
    if (adc_oneshot_read(adc_handle, TMP36_ADC_CHANNEL, &raw_value) != ESP_OK) {
        printf("Failed to read ADC value");
        return ESP_FAIL;
    }

    // Convert ADC value to voltage (assuming 12-bit ADC resolution)
    float voltage = (raw_value * 3.3) / 4095.0;

    // Convert voltage to temperature (TMP36 formula: Temp (°C) = (V - 0.5) * 100)
    *temperature = (voltage - 0.5) * 100.0;

    printf("ADC Raw: %d, Voltage: %.2f V, Temperature: %.2f °C", raw_value, voltage, *temperature);

    return ESP_OK;
}
