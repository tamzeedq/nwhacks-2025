#ifndef TMP36_SENSOR_H
#define TMP36_SENSOR_H

#include "esp_err.h"

// Define the ADC channel and attenuation for the TMP36
#define TMP36_ADC_CHANNEL ADC_CHANNEL_4  // GPIO5 (ADC1 channel 4)
#define TMP36_ADC_ATTEN ADC_ATTEN_DB_11  // Suitable for reading 0-3.3V

/**
 * @brief Initialize the TMP36 sensor
 * 
 * @return esp_err_t ESP_OK if successful, ESP_FAIL otherwise.
 */
esp_err_t tmp36_sensor_init(void);

/**
 * @brief Read temperature from TMP36 sensor
 * 
 * @param[out] temperature Pointer to store the temperature value in Celsius
 * @return esp_err_t ESP_OK if successful, ESP_FAIL otherwise.
 */
esp_err_t tmp36_sensor_read(float *temperature);

#endif // TMP36_SENSOR_H