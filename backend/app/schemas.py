from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class EmailSend(BaseModel):
    to_address: str
    subject: str
    body_text: str

class AIPrompt(BaseModel):
    prompt: str

class EmailStar(BaseModel):
    is_starred: bool
