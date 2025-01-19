import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras._tf_keras.keras.models import Sequential
from keras._tf_keras.keras.layers import Dense, LSTM

# Generate a simple sine wave dataset
data = {
    "index": np.arange(200),  # Replace dates with numeric indices
    "value": np.sin(np.linspace(0, 20, 200)) + np.random.normal(0, 0.1, 200)
}
df = pd.DataFrame(data)

# Plot the data
plt.figure(figsize=(10, 5))
plt.plot(df["index"], df["value"], label="Time Series")
plt.xlabel("Index")
plt.ylabel("Value")
plt.title("Time Series Data")
plt.legend()
plt.show()

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

# Define sequence length
sequence_length = 10

# Create sequences
X, y = create_sequences(df["scaled_value"].values, sequence_length)

# Split into training and testing sets
split_idx = int(len(X) * 0.8)
X_train, X_test = X[:split_idx], X[split_idx:]
y_train, y_test = y[:split_idx], y[split_idx:]

# Add an extra dimension for the neural network
X_train = X_train[..., np.newaxis]
X_test = X_test[..., np.newaxis]

# Define the model
model = Sequential([
    LSTM(50, activation='relu', input_shape=(sequence_length, 1)),
    Dense(1)
])

# Compile the model
model.compile(optimizer='adam', loss='mse')

# Train the model
history = model.fit(X_train, y_train, epochs=20, batch_size=16, validation_data=(X_test, y_test))

# Plot the training and validation loss
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('Model Loss')
plt.show()

# Make predictions
y_pred = model.predict(X_test)

# Invert scaling for predictions and actual values
y_pred = scaler.inverse_transform(y_pred)
y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))

# Plot actual vs predicted values
plt.figure(figsize=(10, 5))
plt.plot(df["index"][-len(y_test):], y_test_actual, label="Actual", color="blue")
plt.plot(df["index"][-len(y_test):], y_pred, label="Predicted", color="orange")
plt.xlabel("Index")
plt.ylabel("Value")
plt.title("Time Series Forecasting with Neural Network")
plt.legend()
plt.show()

# Forecast the next steps
future_steps = 200
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
plt.figure(figsize=(10, 5))
plt.plot(df["index"], df["value"], label="Historical Data", color="blue")
plt.plot(future_indices, forecast, label="Forecast", color="red")
plt.xlabel("Index")
plt.ylabel("Value")
plt.title("Time Series Forecast with Neural Network")
plt.legend()
plt.show()
