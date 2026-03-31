from services.gemini_service import gemini_service
from services.rag_service import rag_service
from typing import Dict

class NutritionAgent:
    def __init__(self):
        self.agent_type = "nutrition_planner"
    
    async def generate_diet_plan(
        self, 
        user_profile: Dict,
        user_notes: str = ""
    ) -> str:
        """Generate personalized diet plan"""
        
        # Retrieve relevant nutrition context
        query = f"diet plan for {user_profile.get('goals', [])}, {user_profile.get('preferences', '')}"
        context = rag_service.retrieve_relevant_context(query, user_profile.get('user_id'), "nutrition")
        
        # Build system instruction
        system_instruction = """You are an expert nutritionist and diet plan specialist.
        Create detailed, personalized diet plans with specific meals, portion sizes, macronutrient breakdown, and calorie targets.
        Consider dietary preferences, goals, and any health conditions.
        Format your response with meal plans, recipes, and nutritional information using markdown."""
        
        # Calculate BMR and daily calorie needs
        age = user_profile.get('age', 30)
        weight = user_profile.get('weight', 70)
        height = user_profile.get('height', 170)
        goals = user_profile.get('goals', [])
        
        # Simple BMR calculation (Mifflin-St Jeor)
        bmr = 10 * weight + 6.25 * height - 5 * age + 5  # Male, adjust for female if needed
        activity_multiplier = 1.5  # Moderately active
        tdee = bmr * activity_multiplier
        
        # Adjust based on goals
        if any('loss' in goal.lower() for goal in goals):
            tdee -= 500  # Deficit for fat loss
        elif any('gain' in goal.lower() or 'muscle' in goal.lower() for goal in goals):
            tdee += 300  # Surplus for muscle gain
        
        # Build prompt
        profile_info = f"""
        User Profile:
        - Age: {age}
        - Weight: {weight} kg
        - Height: {height} cm
        - Goals: {', '.join(goals)}
        - Dietary Preferences: {user_profile.get('preferences', 'None')}
        - Health Conditions: {user_profile.get('health_conditions', 'None')}
        - Estimated Daily Calorie Needs: {int(tdee)} kcal
        - Protein Target: {int(weight * 2)}g per day
        """
        
        if user_notes:
            profile_info += f"\nUser Notes/Feedback: {user_notes}"
        
        prompt = f"{profile_info}\n\nGenerate a comprehensive daily diet plan with meal suggestions:"
        
        try:
            response = await gemini_service.generate_response(
                prompt=prompt,
                context=context,
                system_instruction=system_instruction
            )
            return response
        except Exception as e:
            return f"Error generating diet plan: {str(e)}"

nutrition_agent = NutritionAgent()
