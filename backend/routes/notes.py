from httpx import HTTPError
from pydantic import BaseModel
from sqlalchemy import delete, select
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from backend.auth.dependencies import get_current_user
from backend.database import get_content_db, Note
from backend.routes  import loader

router = APIRouter()
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB per file


@router.post("/upload")
def upload_notes(
    file: list[UploadFile] = File(...),
    user_id=Depends(get_current_user),
    db=Depends(get_content_db),
):
    saved = []
    skipped = []

    for upload in file:
        size = getattr(upload, "size", None)
        if size is not None and size > MAX_UPLOAD_BYTES:
            skipped.append(upload.filename)
            continue

        content = upload.file.read()
        text = loader.extract_text(upload.filename, content)

        if not text:
            skipped.append(upload.filename)
            continue

        existing_note = db.execute(
            select(Note).where(
                Note.user_id == user_id,
                Note.filename == upload.filename,
            )
        ).scalar_one_or_none()

        if existing_note:
            existing_note.content = text
        else:
            db.add(Note(user_id=user_id, filename=upload.filename, content=text))

        saved.append(upload.filename)

    db.commit()
    return {"saved": saved, "skipped": skipped}


@router.get("/notes")
def get_notes(user_id=Depends(get_current_user), db=Depends(get_content_db)):
    result = db.execute(select(Note).where(Note.user_id == user_id))
    return result.scalars().all()
        

@router.delete("/notes/{note_id}")
def delete_notes( note_id: int, current_user = Depends(get_current_user), db = Depends(get_content_db)):
    
    result = db.execute(delete(Note).where(current_user == Note.user_id, Note.id == note_id))
    if result.rowcount == 0:
        raise HTTPException(
            status_code= 404,
            detail = 'NOTE NOT FOUND'
        )
    
    db.commit()
    return "NOTE DELETED SUCCESSFULLY."