from fastapi import APIRouter, UploadFile, File
router = APIRouter()
from routes  import loader
@router.post('/upload')
async def upload_notes(file: list[UploadFile] = File(...)):
    for files in file:
        content = await files.read()
        loader.store_notes(files.filename, content)
        print("Embedding cache:", loader.Embedding_cache.keys())
