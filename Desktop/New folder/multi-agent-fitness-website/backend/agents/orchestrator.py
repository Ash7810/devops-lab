from agents.fitness_agent import fitness_agent
from agents.nutrition_agent import nutrition_agent
from agents.feedback_agent import feedback_agent
from services.rag_service import rag_service
from services.gemini_service import gemini_service
from typing import Dict, List

class AgentOrchestrator:
    def __init__(self):
        self.fitness_agent = fitness_agent
        self.nutrition_agent = nutrition_agent
        self.feedback_agent = feedback_agent
    
    async def generate_daily_plan(
        self,
        user_profile: Dict,
        user_notes: str = ""
    ) -> Dict:
        """Generate complete daily plan (workout + diet)"""
        workout_plan = await self.fitness_agent.generate_workout_plan(user_profile, user_notes)
        diet_plan = await self.nutrition_agent.generate_diet_plan(user_profile, user_notes)
        
        return {
            "workout": workout_plan,
            "diet": diet_plan
        }
    
    async def handle_chat_message(
        self,
        message: str,
        user_profile: Dict,
        conversation_history: List[Dict] = None,
        user_notes: str = ""
    ) -> str:
        """Handle chat message and route to appropriate agent"""
        
        # Determine intent
        message_lower = message.lower()
        
        # Retrieve relevant context
        context = rag_service.retrieve_relevant_context(
            message, 
            user_profile.get('user_id'),
            "both"
        )
        
        # Add user notes to context
        if user_notes:
            context += f"\n\nUser Feedback/Notes: {user_notes}"
        
        # Route to appropriate agent or general chat
        system_instruction = """You are FitAI, an expert AI fitness assistant powered by Gemini 2.0 Flash.
        You provide personalized fitness, nutrition, and health advice based on the user's profile and feedback.
        Be conversational, helpful, and provide actionable advice.
        Use the context provided to give accurate, relevant information."""
        
        profile_context = f"""
        User Profile:
        - Goals: {', '.join(user_profile.get('goals', []))}
        - Age: {user_profile.get('age', 'N/A')}
        - Weight: {user_profile.get('weight', 'N/A')} kg
        """
        
        full_prompt = f"{profile_context}\n\nUser Question: {message}"
        
        try:
            if conversation_history:
                # Use chat history if available
                messages = [
                    {"role": "user", "content": msg.get("content", "")}
                    if msg.get("role") == "user"
                    else {"role": "assistant", "content": msg.get("content", "")}
                    for msg in conversation_history[-5:]  # Last 5 messages
                ]
                messages.append({"role": "user", "content": full_prompt})
                response = await gemini_service.generate_with_history(messages, context + system_instruction)
            else:
                response = await gemini_service.generate_response(
                    prompt=full_prompt,
                    context=context,
                    system_instruction=system_instruction
                )
            return response
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}. Please try again."
    
    async def process_user_feedback(
        self,
        feedback: str,
        user_profile: Dict
    ) -> Dict:
        """Process user feedback and update knowledge"""
        interpretation = await self.feedback_agent.interpret_feedback(feedback, user_profile)
        
        # Add to RAG knowledge base
        user_id = user_profile.get('user_id')
        if user_id:
            rag_service.add_user_note(user_id, feedback)
        
        return interpretation

orchestrator = AgentOrchestrator()
