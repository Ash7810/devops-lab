const store = {
    state: {
        user: null,
        workouts: [],
        agents: {
            trainer: null,
            coach: null,
            analytics: null,
        },
    },
    setUser(user) {
        this.state.user = user;
    },
    addWorkout(workout) {
        this.state.workouts.push(workout);
    },
    setTrainerAgent(agent) {
        this.state.agents.trainer = agent;
    },
    setCoachAgent(agent) {
        this.state.agents.coach = agent;
    },
    setAnalyticsAgent(agent) {
        this.state.agents.analytics = agent;
    },
    getState() {
        return this.state;
    },
};

export default store;