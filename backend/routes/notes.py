from sqlalchemy import select
from fastapi import APIRouter, UploadFile, File, Depends
from auth.dependencies import get_current_user
from database import get_content_db, Note
from routes  import loader

router = APIRouter()
@router.post('/upload')
async def upload_notes(file: list[UploadFile] = File(...), user_id=Depends(get_current_user), db = Depends(get_content_db)):
    for files in file:
        content = await files.read()
        loader.store_notes(files.filename, content)

        if files.filename not in loader.Notes:
            continue

        existing_note = db.execute(
            select(Note).where(
                Note.user_id == user_id,
                Note.filename == files.filename
            )
        ).scalar_one_or_none()

        if existing_note:
            existing_note.content = loader.Notes[files.filename]
        else:
            note = Note(
                user_id=user_id,
                filename=files.filename,
                content=loader.Notes[files.filename]
            )
            db.add(note)

    db.commit()
    
@router.get("/notes")
async def get_notes(user_id = Depends(get_current_user), db = Depends(get_content_db)):
    result = db.execute(select(Note).where(Note.user_id==user_id))
    notes = result.scalars().all()
    return notes
        