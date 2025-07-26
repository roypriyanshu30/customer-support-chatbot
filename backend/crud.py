from sqlalchemy.orm import Session
from models import ChatSession, Message, User
from schemas import MessageCreate

def create_session(db: Session, user_id: int):
    session = ChatSession(user_id=user_id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def add_message(db: Session, session_id: int, sender: str, text: str):
    msg = Message(session_id=session_id, sender=sender, text=text)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

def get_messages(db: Session, session_id: int):
    return db.query(Message).filter(Message.session_id == session_id).all()
