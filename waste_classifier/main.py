import asyncio
import json
import io
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from typing import Annotated

import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError

# ── Fallback import: pakai tflite_runtime di server (ringan, tanpa AVX),
# fallback ke tensorflow di lokal Windows untuk keperluan testing/development ──
try:
    import tflite_runtime.interpreter as tflite
    logging.info("Menggunakan tflite_runtime")
except ImportError:
    import tensorflow as tf
    tflite = tf.lite
    logging.info("tflite_runtime tidak ditemukan, fallback ke tensorflow.lite")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("waste_classifier_api")

MODELS_DIR = Path(__file__).parent / "models"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ERR_INVALID_IMAGE = "File harus berupa gambar"

interpreter = None
input_details = None
output_details = None
class_names = None
image_size = None
rescale = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global interpreter, input_details, output_details, class_names, image_size, rescale

    interpreter = tflite.Interpreter(model_path=str(MODELS_DIR / "waste_classifier.tflite"))
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    logger.info("Model TFLite loaded.")

    class_names = json.loads(
        await asyncio.to_thread((MODELS_DIR / "class_names.json").read_text)
    )
    logger.info("Class names: %s", class_names)

    config = json.loads(
        await asyncio.to_thread((MODELS_DIR / "model_config.json").read_text)
    )
    image_size = tuple(config["image_size"])
    rescale = config["rescale"]
    logger.info("Image size: %s, rescale: %s", image_size, rescale)

    yield

    logger.info("Shutting down.")


app = FastAPI(title="Waste Classifier API", lifespan=lifespan)


def preprocess_image(raw_bytes: bytes) -> np.ndarray:
    """Decode bytes -> resize -> normalize -> tambah batch dimension."""
    img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    img = img.resize(image_size)
    arr = np.array(img, dtype=np.float32) * rescale
    arr = np.expand_dims(arr, axis=0)  # shape: (1, H, W, 3)
    return arr


@app.post("/predict")
async def predict(file: Annotated[UploadFile, File()]):
    # ── Validasi content-type ──
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        return JSONResponse(
            status_code=400,
            content={"detail": ERR_INVALID_IMAGE},
        )

    # ── Baca file & validasi ukuran ──
    raw_bytes = await file.read()
    if len(raw_bytes) > MAX_FILE_SIZE:
        return JSONResponse(
            status_code=400,
            content={"detail": ERR_INVALID_IMAGE},
        )

    if len(raw_bytes) == 0:
        return JSONResponse(
            status_code=400,
            content={"detail": ERR_INVALID_IMAGE},
        )

    # ── Preprocessing & prediksi ──
    try:
        input_array = preprocess_image(raw_bytes)
    except UnidentifiedImageError:
        return JSONResponse(
            status_code=400,
            content={"detail": ERR_INVALID_IMAGE},
        )
    except Exception:
        logger.exception("Gagal preprocessing gambar")
        return JSONResponse(
            status_code=500,
            content={"detail": "Gagal memproses gambar"},
        )

    try:
        interpreter.set_tensor(input_details[0]["index"], input_array)
        interpreter.invoke()
        probabilities = interpreter.get_tensor(output_details[0]["index"])[0]
        predicted_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_idx])
        kategori = class_names[predicted_idx]

        sorted_indices = np.argsort(probabilities)[::-1]
        second_idx = sorted_indices[1]
        second_kategori = class_names[second_idx]
        second_confidence = float(probabilities[second_idx])
        margin = confidence - second_confidence

        if margin > 0.7:
            kepastian = "tinggi"
        elif margin > 0.3:
            kepastian = "sedang"
        else:
            kepastian = "rendah"

        all_probabilities = {
            class_names[i]: round(float(probabilities[i]), 4)
            for i in range(len(class_names))
        }
    except Exception:
        logger.exception("Gagal saat inference model")
        return JSONResponse(
            status_code=500,
            content={"detail": "Gagal memproses gambar"},
        )

    return {
        "kategori": kategori,
        "confidence": round(confidence, 4),
        "all_probabilities": all_probabilities,
        "alternatif": {
            "kategori": second_kategori,
            "confidence": round(second_confidence, 4),
        },
        "margin": round(margin, 4),
        "kepastian": kepastian,
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": interpreter is not None}