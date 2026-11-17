"""Train a transfer-learning food classifier from dataset/<class_name>/*.jpg.
No accuracy is claimed until this script is run with an appropriately licensed dataset."""
from pathlib import Path
def main():
    try: import tensorflow as tf
    except ImportError: raise SystemExit("Install tensorflow to train the model.")
    root=Path(__file__).parent; data=root/"dataset"
    if not data.exists() or not any(data.iterdir()): raise SystemExit("Create ai_model/dataset/<food label>/ with labeled images first.")
    train=tf.keras.utils.image_dataset_from_directory(data,validation_split=.2,subset="training",seed=42,image_size=(224,224),batch_size=32)
    val=tf.keras.utils.image_dataset_from_directory(data,validation_split=.2,subset="validation",seed=42,image_size=(224,224),batch_size=32)
    augment=tf.keras.Sequential([tf.keras.layers.RandomFlip("horizontal"),tf.keras.layers.RandomRotation(.08),tf.keras.layers.RandomZoom(.1)])
    base=tf.keras.applications.MobileNetV2(input_shape=(224,224,3),include_top=False,weights="imagenet");base.trainable=False
    model=tf.keras.Sequential([augment,base,tf.keras.layers.GlobalAveragePooling2D(),tf.keras.layers.Dropout(.25),tf.keras.layers.Dense(len(train.class_names),activation="softmax")])
    model.compile(optimizer="adam",loss="sparse_categorical_crossentropy",metrics=["accuracy"]);model.fit(train.prefetch(tf.data.AUTOTUNE),validation_data=val.prefetch(tf.data.AUTOTUNE),epochs=12)
    (root/"saved_models").mkdir(exist_ok=True);model.save(root/"saved_models"/"food_classifier.keras")
if __name__=="__main__":main()
