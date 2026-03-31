class CoachAgent {
    constructor() {
        this.nutritionAdvice = [];
    }

    addNutritionAdvice(advice) {
        this.nutritionAdvice.push(advice);
    }

    getNutritionAdvice() {
        return this.nutritionAdvice;
    }

    provideAdvice(userGoals) {
        // Logic to provide nutrition advice based on user goals
        if (userGoals.includes('weight loss')) {
            return 'Consider a balanced diet with a calorie deficit.';
        } else if (userGoals.includes('muscle gain')) {
            return 'Focus on protein-rich foods and strength training.';
        } else {
            return 'Maintain a balanced diet with a variety of nutrients.';
        }
    }
}

export default CoachAgent;