class User {
    constructor(name, age, weight, goals) {
        this.name = name;
        this.age = age;
        this.weight = weight;
        this.goals = goals; // Goals can be an array of strings
    }

    updateWeight(newWeight) {
        this.weight = newWeight;
    }

    addGoal(newGoal) {
        this.goals.push(newGoal);
    }

    removeGoal(goalToRemove) {
        this.goals = this.goals.filter(goal => goal !== goalToRemove);
    }

    getProfile() {
        return {
            name: this.name,
            age: this.age,
            weight: this.weight,
            goals: this.goals
        };
    }
}

export default User;