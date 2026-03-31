class Orchestrator {
    constructor() {
        this.agents = [];
    }

    registerAgent(agent) {
        this.agents.push(agent);
    }

    async coordinate(action, data) {
        const results = await Promise.all(this.agents.map(agent => agent.performAction(action, data)));
        return results;
    }
}

export default Orchestrator;