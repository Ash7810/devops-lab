import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        # Use gemini-pro if gemini-2.0-flash-exp is not available
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        except:
            self.model = genai.GenerativeModel('gemini-pro')
        
    async def generate_response(
        self, 
        prompt: str, 
        context: str = "",
        system_instruction: str = ""
    ) -> str:
        """Generate response using Gemini 2.0 Flash"""
        try:
            full_prompt = f"{system_instruction}\n\nContext:\n{context}\n\nUser: {prompt}\n\nAssistant:"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.8,
                    top_k=40,
                    max_output_tokens=2048,
                )
            )
            
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate_with_history(
        self,
        messages: List[Dict[str, str]],
        context: str = ""
    ) -> str:
        """Generate response with conversation history"""
        try:
            chat = self.model.start_chat(history=[])
            
            # Add context if provided
            if context:
                system_msg = f"Context about the user: {context}"
                chat.send_message(system_msg)
            
            # Send conversation history
            for msg in messages:
                if msg["role"] == "user":
                    response = chat.send_message(msg["content"])
                elif msg["role"] == "assistant":
                    # Gemini doesn't support assistant messages in history the same way
                    # So we'll just send the user message
                    pass
            
            return chat.last.text
        except Exception as e:
            raise Exception(f"Gemini chat error: {str(e)}")

gemini_service = GeminiService()
