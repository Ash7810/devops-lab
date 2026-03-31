from services.gemini_service import gemini_service
from services.rag_service import rag_service
from typing import Dict

class FeedbackAgent:
    def __init__(self):
        self.agent_type = "feedback_interpreter"
    
    async def interpret_feedback(
        self,
        feedback: str,
        user_profile: Dict
    ) -> Dict:
        """Interpret user feedback and extract insights"""
        
        system_instruction = """You are an expert at interpreting user feedback about fitness, nutrition, and health.
        Analyze the feedback and extract:
        1. Key insights about user experience
        2. Pain points or issues
        3. Preferences or changes needed
        4. Positive aspects
        
        Return your analysis in a structured format."""
        
        prompt = f"""
        User Feedback: {feedback}
        
        User Profile: {user_profile.get('goals', [])}
        
        Analyze this feedback and provide insights that can be used to improve future recommendations.
        """
        
        try:
            response = await gemini_service.generate_response(
                prompt=prompt,
                context="",
                system_instruction=system_instruction
            )
            
            return {
                "interpretation": response,
                "key_points": self._extract_key_points(response)
            }
        except Exception as e:
            return {
                "interpretation": f"Error interpreting feedback: {str(e)}",
                "key_points": []
            }
    
    def _extract_key_points(self, text: str) -> list:
        """Extract key points from interpretation"""
        # Simple extraction - can be enhanced with NLP
        keywords = ['tired', 'pain', 'difficult', 'easy', 'love', 'hate', 'improve', 'change']
        found_points = [kw for kw in keywords if kw.lower() in text.lower()]
        return found_points

feedback_agent = FeedbackAgent()
