from fastapi import APIRouter, UploadFile, File
router = APIRouter()

@router.post('/upload')
async def upload_notes(file: list[UploadFile] = File(...)):
    for files in file:
        content = await files.read()
        content = content.decode('utf-8')