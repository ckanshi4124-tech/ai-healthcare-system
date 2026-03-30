import tensorflow as tf
import os

# ======================================================
# CONFIGURATIONS
# ======================================================
IMG_SIZE = 180
BATCH_SIZE = 8

train_dir = "dataset/train"
test_dir = "dataset/test"
val_dir = "dataset/val"

# ======================================================
# LOAD DATASET
# ======================================================

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="binary"
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    val_dir,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="binary"
)

test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    test_dir,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    label_mode="binary"
)

# ======================================================
# NORMALIZATION LAYER
# ======================================================

normalization_layer = tf.keras.layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))
test_ds = test_ds.map(lambda x, y: (normalization_layer(x), y))

# ======================================================
# PERFORMANCE OPTIMIZATION
# ======================================================

train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
test_ds = test_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

# ======================================================
# STEP 1 — BUILD THE CNN ARCHITECTURE
# ======================================================

model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(16, (3,3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),

    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ======================================================
# STEP 2 — MODEL CHECKPOINTS + EARLY STOPPING
# ======================================================

checkpoint_path = "models/cnn_pneumonia_model.h5"

checkpoint_cb = tf.keras.callbacks.ModelCheckpoint(
    filepath=checkpoint_path,
    monitor="val_accuracy",
    save_best_only=True,
    save_weights_only=False,
    mode="max",
    verbose=1
)


earlystop_cb = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True,
    verbose=1
)

# Learning Rate Scheduler (optional but improves accuracy)
def scheduler(epoch, lr):
    if epoch > 10:
        return lr * 0.8
    return lr

lr_scheduler_cb = tf.keras.callbacks.LearningRateScheduler(scheduler, verbose=1)

# Create logs folder
os.makedirs("logs", exist_ok=True)
log_file = "logs/training_log.txt"

# ======================================================
# STEP 3 — TRAIN THE MODEL
# ======================================================

history = model.fit(
    train_ds,
    epochs=20,
    validation_data=val_ds,
    callbacks=[checkpoint_cb, earlystop_cb, lr_scheduler_cb]
)

# ======================================================
# STEP 4 — SAVE TRAINING LOGS
# ======================================================

with open(log_file, "w") as f:
    f.write("Training History\n")
    f.write("======================\n\n")
    for key, values in history.history.items():
        f.write(f"{key}: {values}\n")

print("\n🎉 TRAINING COMPLETE!")
print(f"📌 Best Model saved at: {checkpoint_path}")
print(f"📌 Logs saved at: {log_file}")

# ============================================
# SAVE FINAL MODEL (NEW FORMAT)
# ============================================

os.makedirs("models", exist_ok=True)

final_model_path = "models/cnn_pneumonia_model"
model.save(final_model_path)

print(f"\n🎉 Final model exported to: {final_model_path}/")

