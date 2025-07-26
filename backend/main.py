from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import crud, schemas
from llm import get_ai_response  # Placeholder

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@app.post("/api/chat", response_model=schemas.ChatResponse)
def chat(msg: schemas.MessageCreate, db: Session = Depends(get_db)):
    if not msg.session_id:
        user = db.query(crud.User).first() or crud.create_user(db, "Default User")
        session = crud.create_session(db, user.id)
    else:
        session = db.query(crud.ChatSession).get(msg.session_id)

    user_msg = crud.add_message(db, session.id, "user", msg.text)
    ai_response_text = get_ai_response(msg.text)
    ai_msg = crud.add_message(db, session.id, "ai", ai_response_text)

    return {
        "session_id": session.id,
        "messages": [user_msg, ai_msg]
    }
