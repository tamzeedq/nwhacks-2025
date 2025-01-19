import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras._tf_keras.keras.models import Sequential
from keras._tf_keras.keras.layers import Dense, LSTM

MAX_SIZE = 50

def generatePredictions(existing_data, memType):
    print(existing_data)
    print(memType)
    # Use the last 50 data points or fewer if that's all that's available
    if len(existing_data) > MAX_SIZE:
        existing_data = existing_data[-MAX_SIZE:]

    # Prepare the data
    data = {
        "index": np.arange(len(existing_data)),  # Replace dates with numeric indices
        "value": np.array([obj[memType] for obj in existing_data])
    }
    df = pd.DataFrame(data)

    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    df["scaled_value"] = scaler.fit_transform(df[["value"]])

    # Function to create sequences
    def create_sequences(data, sequence_length):
        X, y = [], []
        for i in range(len(data) - sequence_length):
            X.append(data[i:i + sequence_length])
            y.append(data[i + sequence_length])
        return np.array(X), np.array(y)

    # Define sequence length (smaller for less data)
    sequence_length = min(5, len(df) - 1)

    # Create sequences
    X, y = create_sequences(df["scaled_value"].values, sequence_length)

    # Split into training and testing sets (80/20 split)
    split_idx = max(1, int(len(X) * 0.8))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    # Add an extra dimension for the neural network
    X_train = X_train[..., np.newaxis]
    X_test = X_test[..., np.newaxis]

    # Define a simpler model
    model = Sequential([
        LSTM(20, activation='relu', input_shape=(sequence_length, 1)),  # Reduced complexity
        Dense(1)
    ])

    # Compile the model
    model.compile(optimizer='adam', loss='mse')

    # Train the model with fewer epochs
    history = model.fit(
        X_train, y_train, 
        epochs=20,  # Fewer epochs to avoid overfitting
        batch_size=4,  # Smaller batch size for small data
        validation_data=(X_test, y_test),
        verbose=0  # Suppress verbose output
    )

    # Plot training and validation loss
    # plt.figure(figsize=(10, 5))
    # plt.plot(history.history['loss'], label='Training Loss')
    # plt.plot(history.history['val_loss'], label='Validation Loss')
    # plt.xlabel('Epoch')
    # plt.ylabel('Loss')
    # plt.legend()
    # plt.title('Model Loss')
    # plt.show()

    # Make predictions
    y_pred = model.predict(X_test)

    # Invert scaling for predictions and actual values
    y_pred = scaler.inverse_transform(y_pred)
    y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))

    # Plot actual vs predicted values
    # plt.figure(figsize=(10, 5))
    # plt.plot(df["index"][-len(y_test):], y_test_actual, label="Actual", color="blue")
    # plt.plot(df["index"][-len(y_test):], y_pred, label="Predicted", color="orange")
    # plt.xlabel("Index")
    # plt.ylabel("Value")
    # plt.title("Time Series Forecasting with Neural Network")
    # plt.legend()
    # plt.show()

    # Forecast the next steps
    future_steps = 25
    last_sequence = X_test[-1]

    forecast = []
    for _ in range(future_steps):
        next_pred = model.predict(last_sequence[np.newaxis, ...])[0]
        forecast.append(next_pred)
        
        # Update the sequence
        last_sequence = np.roll(last_sequence, -1, axis=0)
        last_sequence[-1, 0] = next_pred

    # Invert scaling for the forecast
    forecast = scaler.inverse_transform(np.array(forecast).reshape(-1, 1))

    # Generate future indices
    future_indices = np.arange(df["index"].iloc[-1] + 1, df["index"].iloc[-1] + 1 + future_steps)

    # Plot the forecast
    # plt.figure(figsize=(10, 5))
    # plt.plot(df["index"], df["value"], label="Historical Data", color="blue")
    # plt.plot(future_indices, forecast, label="Forecast", color="red")
    # plt.xlabel("Index")
    # plt.ylabel("Value")
    # plt.title("Time Series Forecast with Neural Network")
    # plt.legend()
    # plt.show()
    return forecast

mockData = [
    {
        "free_heap": 275700,
        "min_free_heap": 247712,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 275700,
        "stack_watermark": 1112,
        "time": "10:13:31 a.m."
    },
    {
        "free_heap": 255168,
        "min_free_heap": 247712,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255168,
        "stack_watermark": 1112,
        "time": "10:13:32 a.m."
    },
    {
        "free_heap": 275700,
        "min_free_heap": 247680,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 275700,
        "stack_watermark": 1112,
        "time": "10:13:34 a.m."
    },
    {
        "free_heap": 275700,
        "min_free_heap": 247680,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 275700,
        "stack_watermark": 1112,
        "time": "10:13:35 a.m."
    },
    {
        "free_heap": 255180,
        "min_free_heap": 247680,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255180,
        "stack_watermark": 1112,
        "time": "10:13:36 a.m."
    },
    {
        "free_heap": 255216,
        "min_free_heap": 247680,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255216,
        "stack_watermark": 1112,
        "time": "10:13:38 a.m."
    },
    {
        "free_heap": 255216,
        "min_free_heap": 247680,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255216,
        "stack_watermark": 1112,
        "time": "10:13:39 a.m."
    },
    {
        "free_heap": 255216,
        "min_free_heap": 247288,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255216,
        "stack_watermark": 1112,
        "time": "10:13:41 a.m."
    },
    {
        "free_heap": 255216,
        "min_free_heap": 229832,
        "largest_block": 188416,
        "total_heap": 353952,
        "free_internal_ram": 255216,
        "stack_watermark": 1112,
        "time": "10:13:42 a.m."
    },
    {
        "free_heap": 234692,
        "min_free_heap": 229832,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234692,
        "stack_watermark": 1112,
        "time": "10:13:44 a.m."
    },
    {
        "free_heap": 234732,
        "min_free_heap": 227208,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234732,
        "stack_watermark": 1112,
        "time": "10:13:45 a.m."
    },
    {
        "free_heap": 214208,
        "min_free_heap": 214044,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214208,
        "stack_watermark": 1112,
        "time": "10:13:46 a.m."
    },
    {
        "free_heap": 234692,
        "min_free_heap": 210996,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234692,
        "stack_watermark": 1112,
        "time": "10:13:48 a.m."
    },
    {
        "free_heap": 214208,
        "min_free_heap": 210996,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214208,
        "stack_watermark": 1112,
        "time": "10:13:49 a.m."
    },
    {
        "free_heap": 214208,
        "min_free_heap": 207980,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214208,
        "stack_watermark": 1112,
        "time": "10:13:51 a.m."
    },
    {
        "free_heap": 234728,
        "min_free_heap": 206732,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234728,
        "stack_watermark": 1112,
        "time": "10:13:52 a.m."
    },
    {
        "free_heap": 214244,
        "min_free_heap": 206732,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214244,
        "stack_watermark": 1112,
        "time": "10:13:54 a.m."
    },
    {
        "free_heap": 214244,
        "min_free_heap": 206732,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214244,
        "stack_watermark": 1112,
        "time": "10:13:56 a.m."
    },
    {
        "free_heap": 234692,
        "min_free_heap": 206724,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234692,
        "stack_watermark": 1112,
        "time": "10:13:57 a.m."
    },
    {
        "free_heap": 234464,
        "min_free_heap": 206720,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234464,
        "stack_watermark": 1112,
        "time": "10:13:59 a.m."
    },
    {
        "free_heap": 214016,
        "min_free_heap": 206720,
        "largest_block": 147456,
        "total_heap": 353952,
        "free_internal_ram": 214016,
        "stack_watermark": 1112,
        "time": "10:14:01 a.m."
    },
    {
        "free_heap": 234464,
        "min_free_heap": 206512,
        "largest_block": 167936,
        "total_heap": 353952,
        "free_internal_ram": 234464,
        "stack_watermark": 1112,
        "time": "10:14:02 a.m."
    },
    {
        "free_heap": 193496,
        "min_free_heap": 193496,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193496,
        "stack_watermark": 1112,
        "time": "10:14:03 a.m."
    },
    {
        "free_heap": 214016,
        "min_free_heap": 186028,
        "largest_block": 143360,
        "total_heap": 353952,
        "free_internal_ram": 214016,
        "stack_watermark": 1112,
        "time": "10:14:05 a.m."
    },
    {
        "free_heap": 193532,
        "min_free_heap": 186028,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193532,
        "stack_watermark": 1112,
        "time": "10:14:06 a.m."
    },
    {
        "free_heap": 214016,
        "min_free_heap": 186028,
        "largest_block": 143360,
        "total_heap": 353952,
        "free_internal_ram": 214016,
        "stack_watermark": 1112,
        "time": "10:14:08 a.m."
    },
    {
        "free_heap": 193532,
        "min_free_heap": 186028,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193532,
        "stack_watermark": 1112,
        "time": "10:14:09 a.m."
    },
    {
        "free_heap": 193532,
        "min_free_heap": 165544,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193532,
        "stack_watermark": 1112,
        "time": "10:14:10 a.m."
    },
    {
        "free_heap": 193496,
        "min_free_heap": 165544,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193496,
        "stack_watermark": 1112,
        "time": "10:14:12 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 165544,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:14 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:16 a.m."
    },
    {
        "free_heap": 193496,
        "min_free_heap": 165128,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193496,
        "stack_watermark": 1112,
        "time": "10:14:18 a.m."
    },
    {
        "free_heap": 193532,
        "min_free_heap": 165128,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193532,
        "stack_watermark": 1112,
        "time": "10:14:19 a.m."
    },
    {
        "free_heap": 193532,
        "min_free_heap": 165128,
        "largest_block": 124928,
        "total_heap": 353952,
        "free_internal_ram": 193532,
        "stack_watermark": 1112,
        "time": "10:14:21 a.m."
    },
    {
        "free_heap": 173048,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173048,
        "stack_watermark": 1112,
        "time": "10:14:22 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:23 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:25 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:26 a.m."
    },
    {
        "free_heap": 173048,
        "min_free_heap": 165128,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173048,
        "stack_watermark": 1112,
        "time": "10:14:27 a.m."
    },
    {
        "free_heap": 152564,
        "min_free_heap": 152528,
        "largest_block": 83968,
        "total_heap": 353952,
        "free_internal_ram": 152564,
        "stack_watermark": 1112,
        "time": "10:14:29 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 145060,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:30 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 145060,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:31 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 145060,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:32 a.m."
    },
    {
        "free_heap": 173012,
        "min_free_heap": 145060,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173012,
        "stack_watermark": 1112,
        "time": "10:14:33 a.m."
    },
    {
        "free_heap": 152528,
        "min_free_heap": 145060,
        "largest_block": 83968,
        "total_heap": 353952,
        "free_internal_ram": 152528,
        "stack_watermark": 1112,
        "time": "10:14:35 a.m."
    },
    {
        "free_heap": 173048,
        "min_free_heap": 145060,
        "largest_block": 104448,
        "total_heap": 353952,
        "free_internal_ram": 173048,
        "stack_watermark": 1112,
        "time": "10:14:36 a.m."
    }
]

generatePredictions(mockData, "free_heap")
