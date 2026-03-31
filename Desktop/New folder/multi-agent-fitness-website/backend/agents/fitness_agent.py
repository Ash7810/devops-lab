from services.gemini_service import gemini_service
from services.rag_service import rag_service
from typing import Dict

class FitnessAgent:
    def __init__(self):
        self.agent_type = "fitness_planner"
    
    async def generate_workout_plan(
        self, 
        user_profile: Dict,
        user_notes: str = ""
    ) -> str:
        """Generate personalized workout plan"""
        
        # Retrieve relevant fitness context
        query = f"workout plan for {user_profile.get('goals', [])}, age {user_profile.get('age')}, weight {user_profile.get('weight')}kg"
        context = rag_service.retrieve_relevant_context(query, user_profile.get('user_id'), "fitness")
        
        # Build system instruction
        system_instruction = """You are an expert fitness trainer and workout plan specialist. 
        Create detailed, personalized workout plans based on user goals, age, weight, and fitness level.
        Provide specific exercises, sets, reps, rest periods, and progression recommendations.
        Format your response in clear, actionable steps using markdown."""
        
        # Build prompt
        profile_info = f"""
        User Profile:
        - Age: {user_profile.get('age')}
        - Weight: {user_profile.get('weight')} kg
        - Height: {user_profile.get('height')} cm
        - Goals: {', '.join(user_profile.get('goals', []))}
        - Health Conditions: {user_profile.get('health_conditions', 'None')}
        """
        
        if user_notes:
            profile_info += f"\nUser Notes/Feedback: {user_notes}"
        
        prompt = f"{profile_info}\n\nGenerate a comprehensive daily workout plan:"
        
        try:
            response = await gemini_service.generate_response(
                prompt=prompt,
                context=context,
                system_instruction=system_instruction
            )
            return response
        except Exception as e:
            return f"Error generating workout plan: {str(e)}"

fitness_agent = FitnessAgent()
