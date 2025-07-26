from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    session_id: Optional[int]
    text: str

class MessageResponse(BaseModel):
    sender: str
    text: str
    timestamp: datetime

    class Config:
        orm_mode = True

class ChatResponse(BaseModel):
    session_id: int
    messages: List[MessageResponse]
