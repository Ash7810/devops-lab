class Workout {
    constructor(name, duration, exercises) {
        this.name = name; // Name of the workout
        this.duration = duration; // Duration in minutes
        this.exercises = exercises; // Array of exercises
    }

    addExercise(exercise) {
        this.exercises.push(exercise); // Add an exercise to the workout
    }

    removeExercise(exerciseName) {
        this.exercises = this.exercises.filter(ex => ex.name !== exerciseName); // Remove an exercise by name
    }

    getWorkoutDetails() {
        return {
            name: this.name,
            duration: this.duration,
            exercises: this.exercises
        }; // Return workout details
    }
}

class Exercise {
    constructor(name, sets, reps) {
        this.name = name; // Name of the exercise
        this.sets = sets; // Number of sets
        this.reps = reps; // Number of repetitions
    }
}

export { Workout, Exercise };