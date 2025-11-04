// Exercise Library
const exerciseLibrary = {
    cardio: {
        treadmill: [
            { name: "Treadmill Walk/Jog", details: "5 min warmup walk, 10 min jog (moderate pace), 5 min cooldown", bodyweight: false },
            { name: "Treadmill Intervals", details: "2 min walk, 2 min jog, repeat 5 times", bodyweight: false },
            { name: "Treadmill Run", details: "5 min walk, 12 min steady run, 3 min cooldown", bodyweight: false },
            { name: "Treadmill Incline Walk", details: "20 minutes at 5-8% incline", bodyweight: false },
            { name: "Treadmill Sprint Intervals", details: "1 min walk, 1 min sprint, repeat 10 times", bodyweight: false },
            { name: "Treadmill Hills", details: "20 min alternating 2 min flat, 2 min incline", bodyweight: false },
            { name: "Treadmill Progressive", details: "20 min starting easy, ending hard", bodyweight: false },
            { name: "Treadmill Tempo", details: "20 min at challenging pace", bodyweight: false },
            { name: "Treadmill Easy", details: "20 minutes comfortable pace", bodyweight: false }
        ],
        stairStepper: [
            { name: "StairStepper", details: "20 minutes at moderate pace", bodyweight: false },
            { name: "StairStepper Intervals", details: "20 minutes with varying intensity", bodyweight: false },
            { name: "StairStepper", details: "20 minutes moderate to high intensity", bodyweight: false },
            { name: "StairStepper Low Intensity", details: "20 minutes easy pace", bodyweight: false },
            { name: "StairStepper High Intensity", details: "20 minutes challenging pace", bodyweight: false },
            { name: "StairStepper Power", details: "20 min with high intensity intervals", bodyweight: false }
        ],
        bodyweight: [
            // Outdoor Walking/Running exercises (converted from treadmill)
            { name: "Outside Walk/Jog", details: "5 min warmup walk, 10 min jog (moderate pace), 5 min cooldown", bodyweight: true },
            { name: "Outside Walking Intervals", details: "2 min walk, 2 min jog, repeat 5 times", bodyweight: true },
            { name: "Outside Run", details: "5 min walk, 12 min steady run, 3 min cooldown", bodyweight: true },
            { name: "Outside Hill Walk", details: "20 minutes walking hills or incline", bodyweight: true },
            { name: "Outside Sprint Intervals", details: "1 min walk, 1 min sprint, repeat 10 times", bodyweight: true },
            { name: "Outside Hills", details: "20 min alternating 2 min flat, 2 min uphill", bodyweight: true },
            { name: "Outside Progressive Run", details: "20 min starting easy, ending hard", bodyweight: true },
            { name: "Outside Tempo Run", details: "20 min at challenging pace", bodyweight: true },
            { name: "Outside Easy Walk", details: "20 minutes comfortable pace", bodyweight: true },

            // Traditional bodyweight cardio
            { name: "Jumping Jacks", details: "20 minutes with breaks as needed", bodyweight: true },
            { name: "High Knees", details: "20 min alternating with march in place", bodyweight: true },
            { name: "Burpee Cardio", details: "15-20 min of burpees with rest breaks", bodyweight: true },
            { name: "Jump Rope (imaginary)", details: "20 minutes jumping rope motion", bodyweight: true },
            { name: "Running in Place", details: "20 minutes varying intensity", bodyweight: true },
            { name: "Shadow Boxing", details: "20 minutes with combinations", bodyweight: true },

            // Additional bodyweight cardio options
            { name: "Mountain Climber Cardio", details: "20 min mountain climbers with rest breaks", bodyweight: true },
            { name: "Burpee-Jumping Jack Combo", details: "20 min alternating burpees and jumping jacks", bodyweight: true },
            { name: "Skater Hops", details: "20 min lateral skater hops", bodyweight: true },
            { name: "Jump Squat Intervals", details: "15-20 min jump squats with breaks", bodyweight: true },
            { name: "High Knee Sprints", details: "20 min high knees at sprint pace", bodyweight: true },
            { name: "Butt Kickers", details: "20 min butt kickers alternating with jog in place", bodyweight: true },
            { name: "Fast Feet Drill", details: "20 min fast feet in place with breaks", bodyweight: true },
            { name: "Boxing Cardio", details: "20 min shadowboxing with footwork drills", bodyweight: true },
            { name: "Stair Climbing", details: "20 min climbing stairs at home or park", bodyweight: true },
            { name: "Dancing", details: "20 minutes freestyle dancing for cardio", bodyweight: true },
            { name: "Lateral Shuffles", details: "20 min side-to-side shuffles", bodyweight: true },
            { name: "Bear Crawls", details: "15-20 min bear crawls with breaks", bodyweight: true },
            { name: "Crab Walks", details: "15-20 min crab walks forward/backward", bodyweight: true },
            { name: "Inchworms", details: "20 min inchworm walks", bodyweight: true }
        ]
    },
    strength: {
        chest: [
            { name: "Chest Press Machine", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Incline Chest Press Machine", details: "3 sets × 10 reps", bodyweight: false },
            { name: "Dumbbell Chest Press", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Incline Dumbbell Press", details: "3 sets × 10 reps", bodyweight: false },
            { name: "Dumbbell Chest Flyes", details: "3 sets × 10 reps", bodyweight: false },
            { name: "Cable Flyes", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Cable Chest Press", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Push-ups", details: "3 sets × 12-15 reps", bodyweight: true },
            { name: "Push-ups", details: "2 sets × as many as possible", bodyweight: true },
            { name: "Diamond Push-ups", details: "2 sets × 10 reps", bodyweight: true },
            { name: "Incline Push-ups (feet elevated)", details: "3 sets × 12 reps", bodyweight: true }
        ],
        back: [
            { name: "Seated Row Machine", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Lat Pulldown Machine", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Lat Pulldown (wide grip)", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Lat Pulldown (close grip)", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Cable Row", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Seated Cable Row", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Dumbbell Rows", details: "3 sets × 12 each arm", bodyweight: false },
            { name: "Cable Rows", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Straight Arm Pulldown", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Face Pulls", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Pull-up Machine (assisted)", details: "3 sets × 8 reps", bodyweight: false }
        ],
        shoulders: [
            { name: "Dumbbell Shoulder Press", details: "3 sets × 10 reps", bodyweight: false },
            { name: "Shoulder Press Machine", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Military Press Machine", details: "4 sets × 10 reps", bodyweight: false },
            { name: "Dumbbell Lateral Raises", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Lateral Raises", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Front Raises", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Dumbbell Shrugs", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Pike Push-ups", details: "3 sets × 10 reps", bodyweight: true },
            { name: "Handstand Hold (wall-assisted)", details: "3 sets × 20-30 seconds", bodyweight: true }
        ],
        arms: [
            { name: "Dumbbell Bicep Curls", details: "2 sets × 12 reps", bodyweight: false },
            { name: "Hammer Curls", details: "2 sets × 12 reps", bodyweight: false },
            { name: "Cable Bicep Curls", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Concentration Curls", details: "2 sets × 12 each arm", bodyweight: false },
            { name: "Preacher Curls (machine)", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Alternating Dumbbell Curls", details: "3 sets × 12 each arm", bodyweight: false },
            { name: "Tricep Dips (assisted or bench)", details: "2 sets × 10 reps", bodyweight: true },
            { name: "Tricep Dips", details: "3 sets × 10-12 reps", bodyweight: true },
            { name: "Overhead Tricep Extension (dumbbell)", details: "2 sets × 12 reps", bodyweight: false },
            { name: "Cable Tricep Pushdown", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Tricep Rope Pushdown", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Skull Crushers (dumbbells)", details: "3 sets × 12 reps", bodyweight: false }
        ],
        legs: [
            { name: "Leg Press Machine", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Leg Press", details: "4 sets × 12 reps", bodyweight: false },
            { name: "Leg Press (wide stance)", details: "4 sets × 12 reps", bodyweight: false },
            { name: "Leg Curl Machine", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Leg Extension Machine", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Leg Extension", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Hamstring Curl", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Romanian Deadlift (dumbbells)", details: "3 sets × 10 reps", bodyweight: false },
            { name: "Goblet Squats (dumbbell)", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Bodyweight Squats", details: "3 sets × 15 reps", bodyweight: true },
            { name: "Sumo Squats", details: "3 sets × 15 reps", bodyweight: true },
            { name: "Dumbbell Lunges", details: "3 sets × 10 reps each leg", bodyweight: false },
            { name: "Walking Lunges (bodyweight)", details: "3 sets × 12 each leg", bodyweight: true },
            { name: "Walking Lunges with dumbbells", details: "3 sets × 12 each leg", bodyweight: false },
            { name: "Bulgarian Split Squats", details: "3 sets × 10 each leg", bodyweight: true },
            { name: "Dumbbell Step-ups", details: "3 sets × 10 each leg", bodyweight: false },
            { name: "Box Step-ups", details: "3 sets × 12 each leg", bodyweight: true },
            { name: "Jump Squats", details: "3 sets × 10 reps", bodyweight: true },
            { name: "Calf Raises", details: "3 sets × 20 reps", bodyweight: true },
            { name: "Standing Calf Raises", details: "3 sets × 20 reps", bodyweight: true },
            { name: "Seated Calf Raises", details: "3 sets × 20 reps", bodyweight: false },
            { name: "Single Leg Calf Raise", details: "3 sets × 15 each leg", bodyweight: true },
            { name: "Hip Thrust (bodyweight or weighted)", details: "4 sets × 15 reps", bodyweight: true },
            { name: "Glute Bridge", details: "2 sets × 15 reps", bodyweight: true },
            { name: "Wall Sit", details: "2 sets × 45 seconds", bodyweight: true }
        ],
        core: [
            { name: "Plank", details: "3 sets × 30 seconds", bodyweight: true },
            { name: "Plank", details: "3 sets × 45-60 seconds", bodyweight: true },
            { name: "Plank", details: "3 sets × 60 seconds", bodyweight: true },
            { name: "Side Plank", details: "2 sets × 30 sec each side", bodyweight: true },
            { name: "Side Plank", details: "3 sets × 45 sec each side", bodyweight: true },
            { name: "Plank to Push-up", details: "3 sets × 10 reps", bodyweight: true },
            { name: "Plank Shoulder Taps", details: "3 sets × 20 taps", bodyweight: true },
            { name: "Sit-ups", details: "3 sets × 15 reps", bodyweight: true },
            { name: "Decline Sit-ups", details: "3 sets × 12 reps", bodyweight: true },
            { name: "Weighted Sit-ups (light dumbbell)", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Weighted Sit-ups", details: "3 sets × 20 reps", bodyweight: false },
            { name: "Russian Twists (bodyweight)", details: "3 sets × 20 reps (10 each side)", bodyweight: true },
            { name: "Russian Twists (with weight)", details: "3 sets × 30 reps", bodyweight: false },
            { name: "Weighted Russian Twists", details: "3 sets × 40 reps", bodyweight: false },
            { name: "Bicycle Crunches", details: "2 sets × 20 reps", bodyweight: true },
            { name: "Bicycle Crunches", details: "3 sets × 30 reps", bodyweight: true },
            { name: "Mountain Climbers", details: "3 sets × 20 reps", bodyweight: true },
            { name: "Mountain Climbers", details: "3 sets × 30 seconds", bodyweight: true },
            { name: "Mountain Climbers", details: "3 sets × 40 reps", bodyweight: true },
            { name: "Flutter Kicks", details: "3 sets × 30 seconds", bodyweight: true },
            { name: "Leg Raises", details: "3 sets × 12 reps", bodyweight: true },
            { name: "Hanging Leg Raises", details: "3 sets × 10 reps", bodyweight: true },
            { name: "Hanging Knee Raises", details: "3 sets × 10 reps", bodyweight: true },
            { name: "V-ups", details: "3 sets × 12 reps", bodyweight: true },
            { name: "V-ups", details: "3 sets × 15 reps", bodyweight: true },
            { name: "Dead Bug", details: "3 sets × 12 reps", bodyweight: true },
            { name: "Dead Bug", details: "3 sets × 20 reps", bodyweight: true },
            { name: "Bird Dog", details: "3 sets × 10 each side", bodyweight: true }
        ],
        fullBody: [
            { name: "Dumbbell Thrusters", details: "3 sets × 12 reps", bodyweight: false },
            { name: "Dumbbell Thrusters", details: "3 sets × 15 reps", bodyweight: false },
            { name: "Burpees", details: "3 sets × 8 reps", bodyweight: true },
            { name: "Burpees", details: "3 sets × 10 reps", bodyweight: true },
            { name: "Burpees", details: "3 sets × 12 reps", bodyweight: true },
            { name: "Burpees", details: "4 sets × 15 reps", bodyweight: true },
            { name: "Renegade Rows", details: "3 sets × 10 each arm", bodyweight: false },
            { name: "Plank Walkouts", details: "3 sets × 10 reps", bodyweight: true }
        ]
    }
};

// Helper function to get random exercises
function getRandomExercises(category, count, excludeRecent = [], bodyweightOnly = false) {
    const exercises = exerciseLibrary.strength[category];
    let available = exercises.filter(ex => !excludeRecent.includes(ex.name));

    // Filter for bodyweight if requested
    if (bodyweightOnly) {
        available = available.filter(ex => ex.bodyweight === true);
    }

    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function getRandomCardio(bodyweightOnly = false) {
    let type;
    if (bodyweightOnly) {
        type = 'bodyweight';
    } else {
        type = Math.random() > 0.5 ? 'treadmill' : 'stairStepper';
    }
    const exercises = exerciseLibrary.cardio[type];
    return [exercises[Math.floor(Math.random() * exercises.length)]];
}

// Track recent workouts in localStorage
function getRecentExercises() {
    try {
        return JSON.parse(localStorage.getItem('recentWorkouts') || '[]');
    } catch {
        return [];
    }
}

function saveRecentExercises(exercises) {
    try {
        const recent = getRecentExercises();
        const allExercises = exercises.flatMap(ex => ex.name);
        recent.unshift(...allExercises);
        // Keep only last 30 exercises
        localStorage.setItem('recentWorkouts', JSON.stringify(recent.slice(0, 30)));
    } catch (e) {
        console.log('Could not save to localStorage');
    }
}

// Generate random workout based on day type
function generateRandomWorkout(dayType) {
    const recent = getRecentExercises();
    const strengthCount = 3 + Math.floor(Math.random() * 4); // 3-6 exercises

    let dayTitle = '';
    let strengthExercises = [];

    if (dayType === 'upper') {
        dayTitle = "Day 1 - Upper Body Focus (Generated)";
        const chestCount = Math.floor(strengthCount * 0.3) || 1;
        const backCount = Math.floor(strengthCount * 0.25) || 1;
        const shoulderCount = Math.floor(strengthCount * 0.2) || 1;
        const armCount = Math.floor(strengthCount * 0.15) || 1;
        const coreCount = strengthCount - (chestCount + backCount + shoulderCount + armCount);

        strengthExercises = [
            ...getRandomExercises('chest', chestCount, recent),
            ...getRandomExercises('back', backCount, recent),
            ...getRandomExercises('shoulders', shoulderCount, recent),
            ...getRandomExercises('arms', armCount, recent),
            ...getRandomExercises('core', coreCount, recent)
        ];
    } else if (dayType === 'lower') {
        dayTitle = "Day 2 - Lower Body Focus (Generated)";
        const legCount = Math.ceil(strengthCount * 0.7);
        const coreCount = strengthCount - legCount;

        strengthExercises = [
            ...getRandomExercises('legs', legCount, recent),
            ...getRandomExercises('core', coreCount, recent)
        ];
    } else { // core/fullBody
        dayTitle = "Day 3 - Full Body & Core (Generated)";
        const coreCount = Math.ceil(strengthCount * 0.5);
        const upperCount = Math.floor(strengthCount * 0.25);
        const lowerCount = strengthCount - (coreCount + upperCount);

        strengthExercises = [
            ...getRandomExercises('core', coreCount, recent),
            ...getRandomExercises('fullBody', 1, recent),
            ...getRandomExercises('chest', Math.floor(upperCount / 2) || 1, recent),
            ...getRandomExercises('back', Math.ceil(upperCount / 2) || 1, recent),
            ...getRandomExercises('legs', lowerCount, recent)
        ];
    }

    const cardio = getRandomCardio();
    saveRecentExercises([...cardio, ...strengthExercises]);

    return {
        week: 'Generated',
        days: [{
            day: dayTitle,
            cardio: cardio,
            strength: strengthExercises
        }]
    };
}

// Generate bodyweight-only workout
function generateBodyweightWorkout() {
    const recent = getRecentExercises();
    const strengthCount = 4 + Math.floor(Math.random() * 3); // 4-6 exercises

    const dayTitle = "Bodyweight Training (Generated)";

    // Focus on chest, legs, core, and full body exercises
    const chestCount = Math.floor(strengthCount * 0.25) || 1;
    const legCount = Math.floor(strengthCount * 0.3) || 1;
    const coreCount = Math.floor(strengthCount * 0.3) || 1;
    const remaining = strengthCount - (chestCount + legCount + coreCount);

    const strengthExercises = [
        ...getRandomExercises('chest', chestCount, recent, true),
        ...getRandomExercises('legs', legCount, recent, true),
        ...getRandomExercises('core', coreCount, recent, true),
        ...getRandomExercises('fullBody', remaining || 1, recent, true),
        ...getRandomExercises('arms', 1, recent, true) // Add some tricep dips
    ].filter(ex => ex); // Remove any undefined

    // Bodyweight training always includes at least 15 minutes of walking
    // Mandatory: 15-minute walk
    const mandatoryWalk = {
        name: "Outside Walk (Warmup)",
        details: "15 minutes comfortable pace walking"
    };

    // Optional: Add 5 more minutes of other bodyweight cardio
    const otherCardio = exerciseLibrary.cardio.bodyweight.filter(ex =>
        !ex.name.toLowerCase().includes('walk') &&
        !ex.name.toLowerCase().includes('outside')
    );
    const additionalCardio = otherCardio[Math.floor(Math.random() * otherCardio.length)];
    const shortCardio = {
        name: additionalCardio.name,
        details: "5 minutes " + additionalCardio.details.replace(/\d+\s*min(utes)?/, '5 min')
    };

    const cardio = [mandatoryWalk, shortCardio];
    saveRecentExercises([...cardio, ...strengthExercises]);

    return {
        week: 'Generated',
        days: [{
            day: dayTitle,
            cardio: cardio,
            strength: strengthExercises
        }]
    };
}

// Build 52 weeks using exercise library
const workouts = [];

// Helper to build workout day
function buildDay(dayTitle, cardioEx, strengthGroups) {
    return {
        day: dayTitle,
        cardio: [cardioEx],
        strength: strengthGroups.flat()
    };
}

// Week pattern function
function createWeekPattern(weekNum, pattern) {
    const cardioTypes = exerciseLibrary.cardio;
    const treadmill = cardioTypes.treadmill;
    const stepper = cardioTypes.stairStepper;

    const week = { week: weekNum, days: [] };

    // Day 1 - Upper Body
    week.days.push(buildDay(
        "Day 1 - Upper Body Focus",
        treadmill[weekNum % treadmill.length],
        [
            [exerciseLibrary.strength.chest[(weekNum * 2) % exerciseLibrary.strength.chest.length]],
            [exerciseLibrary.strength.back[(weekNum * 2) % exerciseLibrary.strength.back.length]],
            [exerciseLibrary.strength.shoulders[weekNum % exerciseLibrary.strength.shoulders.length]],
            [exerciseLibrary.strength.arms[(weekNum * 2) % exerciseLibrary.strength.arms.length]],
            [exerciseLibrary.strength.arms[(weekNum * 2 + 1) % exerciseLibrary.strength.arms.length]],
            pattern === 'light' ? [] : [exerciseLibrary.strength.chest[(weekNum * 2 + 1) % exerciseLibrary.strength.chest.length]]
        ]
    ));

    // Day 2 - Lower Body
    week.days.push(buildDay(
        "Day 2 - Lower Body Focus",
        stepper[weekNum % stepper.length],
        [
            [exerciseLibrary.strength.legs[(weekNum * 3) % exerciseLibrary.strength.legs.length]],
            [exerciseLibrary.strength.legs[(weekNum * 3 + 1) % exerciseLibrary.strength.legs.length]],
            [exerciseLibrary.strength.legs[(weekNum * 3 + 2) % exerciseLibrary.strength.legs.length]],
            [exerciseLibrary.strength.legs[(weekNum * 3 + 3) % exerciseLibrary.strength.legs.length]],
            pattern === 'light' ? [exerciseLibrary.strength.core[(weekNum * 2) % exerciseLibrary.strength.core.length]] : [
                exerciseLibrary.strength.legs[(weekNum * 3 + 4) % exerciseLibrary.strength.legs.length],
                exerciseLibrary.strength.core[(weekNum * 2) % exerciseLibrary.strength.core.length]
            ]
        ]
    ));

    // Day 3 - Core & Full Body
    week.days.push(buildDay(
        "Day 3 - Core & Full Body",
        treadmill[(weekNum + 1) % treadmill.length],
        [
            [exerciseLibrary.strength.core[(weekNum * 3) % exerciseLibrary.strength.core.length]],
            [exerciseLibrary.strength.core[(weekNum * 3 + 1) % exerciseLibrary.strength.core.length]],
            [exerciseLibrary.strength.core[(weekNum * 3 + 2) % exerciseLibrary.strength.core.length]],
            pattern === 'light' ? [] : [exerciseLibrary.strength.fullBody[weekNum % exerciseLibrary.strength.fullBody.length]],
            [exerciseLibrary.strength.back[(weekNum + 1) % exerciseLibrary.strength.back.length]],
            [exerciseLibrary.strength.legs[(weekNum + 5) % exerciseLibrary.strength.legs.length]]
        ]
    ));

    return week;
}

// Generate 52 weeks
for (let i = 0; i < 52; i++) {
    const weekNum = i + 1;
    // Every 4th week is lighter
    const pattern = (weekNum % 4 === 0) ? 'light' : 'normal';
    workouts.push(createWeekPattern(weekNum, pattern));
}

// Current state
let currentWeek = 0;
let isRandomWorkout = false;

function renderWorkout() {
    const workout = workouts[currentWeek];
    const content = document.getElementById('workoutContent');

    if (workout.week === 'Generated') {
        document.getElementById('weekTitle').textContent = 'Generated Workout';
        isRandomWorkout = true;
    } else {
        document.getElementById('weekTitle').textContent = `Week ${workout.week}`;
        isRandomWorkout = false;
    }

    let html = '';
    workout.days.forEach(day => {
        html += `
            <div class="workout-day">
                <div class="day-title">${day.day}</div>

                <div class="section">
                    <div class="section-title">Cardio <span class="time-badge">20 min</span></div>
                    <ul class="exercise-list">
                        ${day.cardio.map(ex => `
                            <li>
                                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}" target="_blank" class="exercise-name" title="Click to see how to do this exercise">${ex.name}:</a>
                                <span class="exercise-details">${ex.details}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="section">
                    <div class="section-title">Strength Training <span class="time-badge">25 min</span></div>
                    <ul class="exercise-list">
                        ${day.strength.map(ex => `
                            <li>
                                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}" target="_blank" class="exercise-name" title="Click to see how to do this exercise">${ex.name}:</a>
                                <span class="exercise-details">${ex.details}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    content.innerHTML = html;

    // Update button states
    document.getElementById('prevBtn').disabled = currentWeek === 0;
    document.getElementById('nextBtn').disabled = currentWeek === workouts.length - 1;
}

function changeWeek(direction) {
    currentWeek += direction;
    if (currentWeek < 0) currentWeek = 0;
    if (currentWeek >= workouts.length) currentWeek = workouts.length - 1;
    renderWorkout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function randomWeek() {
    const randomIndex = Math.floor(Math.random() * workouts.length);
    currentWeek = randomIndex;
    renderWorkout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDayTypeSelector() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    overlay.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 16px; max-width: 500px; text-align: center;">
            <h2 style="margin-bottom: 20px; color: #667eea;">Choose Workout Type</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="generateAndShow('upper')" style="padding: 15px; font-size: 1.1rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    💪 Day 1 - Upper Body
                </button>
                <button onclick="generateAndShow('lower')" style="padding: 15px; font-size: 1.1rem; background: #764ba2; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🦵 Day 2 - Lower Body
                </button>
                <button onclick="generateAndShow('core')" style="padding: 15px; font-size: 1.1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🔥 Day 3 - Core & Full Body
                </button>
                <button onclick="generateAndShow('bodyweight')" style="padding: 15px; font-size: 1.1rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🏃 Bodyweight Training
                </button>
                <button onclick="closeDaySelector()" style="padding: 10px; font-size: 0.95rem; background: #ccc; color: #333; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px;">
                    Cancel
                </button>
            </div>
        </div>
    `;

    overlay.id = 'dayTypeSelector';
    document.body.appendChild(overlay);
}

function closeDaySelector() {
    const overlay = document.getElementById('dayTypeSelector');
    if (overlay) overlay.remove();
}

function generateAndShow(dayType) {
    closeDaySelector();
    let randomWorkout;
    if (dayType === 'bodyweight') {
        randomWorkout = generateBodyweightWorkout();
    } else {
        randomWorkout = generateRandomWorkout(dayType);
    }
    workouts.push(randomWorkout);
    currentWeek = workouts.length - 1;
    renderWorkout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize
renderWorkout();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentWeek > 0) {
        changeWeek(-1);
    } else if (e.key === 'ArrowRight' && currentWeek < workouts.length - 1) {
        changeWeek(1);
    }
});
