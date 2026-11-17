from pathlib import Path
import numpy as np
from PIL import Image
from app.core.config import settings
from app.services.nutrition import SEED_FOODS
LABELS=[x[0] for x in SEED_FOODS]
DEFAULT_PORTIONS={"Rice":150,"Dal":150,"Roti":40,"Paneer":100,"Chicken":120,"Biryani":250,"Salad":150,"Idli":100,"Dosa":120,"Fruits":150,"Vegetables":150,"Eggs":100}
_model=None
def _load():
    global _model
    if _model is None and Path(settings.model_path).exists():
        try:
            import tensorflow as tf
            _model=tf.keras.models.load_model(settings.model_path)
        except Exception:return None
    return _model
def predict_food(image:Image.Image,threshold=.55):
    model=_load()
    if model is None:return {"predictions":[],"requires_confirmation":True,"message":"No trained model is installed. Add a validated model at MODEL_PATH; manual meal entry remains available."}
    arr=np.asarray(image.resize((224,224)),dtype=np.float32)/255.0
    scores=model.predict(np.expand_dims(arr,0),verbose=0)[0]; top=np.argsort(scores)[::-1][:3]
    predictions=[{"food_name":LABELS[i],"confidence":round(float(scores[i]),4),"estimated_portion_grams":DEFAULT_PORTIONS[LABELS[i]],"portion_method":"category default estimate; user confirmation required"} for i in top if scores[i]>=threshold]
    return {"predictions":predictions,"requires_confirmation":not bool(predictions),"message":"Portions are estimates from a single image and must be confirmed before logging."}
