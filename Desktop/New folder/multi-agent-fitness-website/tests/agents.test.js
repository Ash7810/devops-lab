const { Orchestrator } = require('../src/agents/orchestrator');
const { TrainerAgent } = require('../src/agents/trainer-agent');
const { CoachAgent } = require('../src/agents/coach-agent');
const { AnalyticsAgent } = require('../src/agents/analytics-agent');

describe('Agent Functionality Tests', () => {
    let orchestrator;
    let trainerAgent;
    let coachAgent;
    let analyticsAgent;

    beforeEach(() => {
        orchestrator = new Orchestrator();
        trainerAgent = new TrainerAgent();
        coachAgent = new CoachAgent();
        analyticsAgent = new AnalyticsAgent();
    });

    test('Orchestrator should initialize with no agents', () => {
        expect(orchestrator.agents).toHaveLength(0);
    });

    test('TrainerAgent should provide workout recommendations', () => {
        const recommendations = trainerAgent.getRecommendations();
        expect(recommendations).toBeDefined();
        expect(Array.isArray(recommendations)).toBe(true);
    });

    test('CoachAgent should offer nutrition advice', () => {
        const advice = coachAgent.getNutritionAdvice();
        expect(advice).toBeDefined();
        expect(typeof advice).toBe('string');
    });

    test('AnalyticsAgent should analyze user feedback', () => {
        const feedback = { rating: 5, comments: 'Great experience!' };
        const analysis = analyticsAgent.analyzeFeedback(feedback);
        expect(analysis).toBeDefined();
        expect(analysis).toHaveProperty('improvementSuggestions');
    });

    test('Orchestrator should add agents correctly', () => {
        orchestrator.addAgent(trainerAgent);
        orchestrator.addAgent(coachAgent);
        expect(orchestrator.agents).toHaveLength(2);
    });
});