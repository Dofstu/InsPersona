// ========== STATE ==========
const state = {
  gamePin: Math.floor(100000 + Math.random() * 900000).toString(),
  uploadedFile: null,
  selectedFormat: 'quiz',
  difficulty: 'medium',
  timePerQuestion: 20,
  numQuestions: 10,
  questionTypes: ['multiple'],
  questionSource: 'default',
    selectedCategories: ['all'],
  players: [],
  currentPlayer: null,
  quiz: [],
  customQuestions: [],
  currentQuestionIndex: 0,
  timer: null,
  timerInterval: null,
  score: 0,
  correctAnswers: 0,
  streak: 0,
  bestStreak: 0,
  powerUps: { fifty: 2, freeze: 2, skip: 1, double: 1 },
  doublePointsActive: false,
  globalLeaderboard: [],
  fiftyFiftyUsedThisQuestion: false,
  skillPoints: 0,
  unlockedSkills: [],
  powerUpsUsedThisQuiz: 0,
  initialTimePerQuestion: 20,
  achievements: [],
  unlockedAchievements: [],
  newlyUnlockedAchievements: [],
   timeoutsInQuiz: 0,
  selectedCorrectAnswer: null
};

let isHost = false;
let hostPlayer = null;


// Loading Screen Configurations
const LOADING_CONFIGS = {
  quiz: {
    title: "AI is preparing your quiz...",
    subtitle: "This may take a few moments",
    steps: [
      { icon: "📄", text: "Analyzing document" },
      { icon: "🤖", text: "Generating questions" },
      { icon: "🎯", text: "Optimizing content" }
    ]
  },

  video: {
  title: "AI is generating videos...",
  subtitle: "Creating visual demonstrations",
  steps: [
    { icon: "🎬", text: "Analyzing content" },
    { icon: "🎥", text: "Recording demonstrations" },
    { icon: "✨", text: "Processing video" }
  ]
},
  image: {
    title: "AI is generating images...",
    subtitle: "Creating visual representations",
    steps: [
      { icon: "🎨", text: "Analyzing content" },
      { icon: "🖼️", text: "Creating visuals" },
      { icon: "✨", text: "Finalizing artwork" }
    ]
  },
  summary: {
    title: "AI is creating summary...",
    subtitle: "Extracting key insights",
    steps: [
      { icon: "📖", text: "Reading document" },
      { icon: "🔍", text: "Identifying key points" },
      { icon: "📝", text: "Generating summary" }
    ]
  },
  chat: {
    title: "AI tutor is preparing...",
    subtitle: "Analyzing your material",
    steps: [
      { icon: "📚", text: "Processing document" },
      { icon: "🧠", text: "Building knowledge base" },
      { icon: "💬", text: "Ready to chat" }
    ]
  },
  upload: {
    title: "Processing your file...",
    subtitle: "Analyzing content",
    steps: [
      { icon: "📤", text: "Uploading file" },
      { icon: "🔍", text: "Scanning content" },
      { icon: "✅", text: "Ready for learning" }
    ]
  }
};

// ========== ACHIEVEMENTS (WITH DIFFICULTY TIERS) ==========
const ACHIEVEMENTS = [
  // EASY ACHIEVEMENTS
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🏓',
    reward: 10,
    difficulty: 'easy',
    check: (stats) => stats.quizzesCompleted >= 1
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 5 quizzes',
    icon: '📊',
    reward: 20,
    difficulty: 'easy',
    check: (stats) => stats.quizzesCompleted >= 5
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% accuracy in one quiz',
    icon: '✨',
    reward: 15,
    difficulty: 'easy',
    check: (stats) => stats.perfectScores >= 1
  },
  {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: 'Achieve a 5+ answer streak',
    icon: '🔥',
    reward: 15,
    difficulty: 'easy',
    check: (stats) => stats.bestStreak >= 5
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Complete 10 quizzes',
    icon: '⚡',
    reward: 30,
    difficulty: 'easy',
    check: (stats) => stats.quizzesCompleted >= 10
  },
  {
    id: 'accuracy_rookie',
    name: 'Accuracy Rookie',
    description: 'Get 90%+ accuracy in 3 quizzes',
    icon: '🏓',
    reward: 25,
    difficulty: 'easy',
    check: (stats) => stats.highAccuracyCount >= 3
  },
  
  // HARD ACHIEVEMENTS
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 quizzes',
    icon: '📖',
    reward: 80,
    difficulty: 'hard',
    check: (stats) => stats.quizzesCompleted >= 50
  },
  {
    id: 'perfect_master',
    name: 'Perfect Master',
    description: 'Get 100% accuracy in 10 quizzes',
    icon: '⭐',
    reward: 100,
    difficulty: 'hard',
    check: (stats) => stats.perfectScores >= 10
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 10 quizzes without timing out once',
    icon: '💨',
    reward: 80,
    difficulty: 'hard',
    check: (stats) => stats.noTimeoutsStreak >= 10
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 20+ answer streak',
    icon: '🔥',
    reward: 90,
    difficulty: 'hard',
    check: (stats) => stats.bestStreak >= 20
  },
  {
    id: 'power_saver',
    name: 'Power Saver',
    description: 'Complete 8 quizzes without using power-ups',
    icon: '💪',
    reward: 85,
    difficulty: 'hard',
    check: (stats) => stats.noPowerUpsUsed >= 8
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 20,000+ points in one quiz',
    icon: '💰',
    reward: 90,
    difficulty: 'hard',
    check: (stats) => stats.highestScore >= 20000
  },
  {
    id: 'consistent',
    name: 'Consistency King',
    description: 'Get 90%+ accuracy in 20 quizzes',
    icon: '🏓',
    reward: 100,
    difficulty: 'hard',
    check: (stats) => stats.highAccuracyCount >= 20
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 quizzes',
    icon: '💯',
    reward: 120,
    difficulty: 'hard',
    check: (stats) => stats.quizzesCompleted >= 100
  },
  
  // IMPOSSIBLE ACHIEVEMENTS
  {
    id: 'quiz_legend',
    name: 'Quiz Legend',
    description: 'Complete 200 quizzes',
    icon: '🦸',
    reward: 250,
    difficulty: 'impossible',
    check: (stats) => stats.quizzesCompleted >= 200
  },
  {
    id: 'quiz_immortal',
    name: 'Quiz Immortal',
    description: 'Complete 500 quizzes',
    icon: '🔱',
    reward: 500,
    difficulty: 'impossible',
    check: (stats) => stats.quizzesCompleted >= 500
  },
  {
    id: 'perfection_god',
    name: 'Perfection God',
    description: 'Get 100% accuracy in 50 quizzes',
    icon: '💫',
    reward: 300,
    difficulty: 'impossible',
    check: (stats) => stats.perfectScores >= 50
  },
  {
    id: 'streak_god',
    name: 'Streak God',
    description: 'Achieve a 50+ answer streak',
    icon: '🌟',
    reward: 250,
    difficulty: 'impossible',
    check: (stats) => stats.bestStreak >= 50
  },
  {
    id: 'mega_scorer',
    name: 'Mega Scorer',
    description: 'Score 40,000+ points in one quiz',
    icon: '💎',
    reward: 200,
    difficulty: 'impossible',
    check: (stats) => stats.highestScore >= 40000
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Get 95%+ accuracy in 50 quizzes',
    icon: '🚀',
    reward: 280,
    difficulty: 'impossible',
    check: (stats) => stats.ultraHighAccuracyCount >= 50
  },
  {
    id: 'ultimate_master',
    name: 'Ultimate Master',
    description: 'Get 100% accuracy in 100 quizzes',
    icon: '👾',
    reward: 500,
    difficulty: 'impossible',
    check: (stats) => stats.perfectScores >= 100
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Complete 30 quizzes without using power-ups',
    icon: '🛡️',
    reward: 300,
    difficulty: 'impossible',
    check: (stats) => stats.noPowerUpsUsed >= 30
  },
  {
    id: 'time_master',
    name: 'Time Master',
    description: 'Complete 50 quizzes without timing out once',
    icon: '⏰',
    reward: 280,
    difficulty: 'impossible',
    check: (stats) => stats.noTimeoutsStreak >= 50
  }
];

// ========== QUESTIONS ==========
const QUESTIONS = [
  // Multiple Choice Questions
  { type: 'multiple', question: 'What is the capital of France?', answers: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2, category: 'Geography' },
  { type: 'multiple', question: 'Which planet is known as the Red Planet?', answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1, category: 'Science' },
  { type: 'multiple', question: 'What does CPU stand for?', answers: ['Central Processing Unit', 'Computer Personal Unit', 'Central Processor Union', 'Core Processing Unit'], correct: 0, category: 'Technology' },
  { type: 'multiple', question: 'Who painted the Mona Lisa?', answers: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'], correct: 2, category: 'Art' },
  { type: 'multiple', question: 'What is the largest ocean on Earth?', answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'], correct: 3, category: 'Geography' },
  { type: 'multiple', question: 'In what year did World War II end?', answers: ['1943', '1944', '1945', '1946'], correct: 2, category: 'History' },
  { type: 'multiple', question: 'What is the chemical symbol for gold?', answers: ['Go', 'Gd', 'Au', 'Ag'], correct: 2, category: 'Science' },
  { type: 'multiple', question: 'Which programming language is known as the "language of the web"?', answers: ['Python', 'Java', 'JavaScript', 'C++'], correct: 2, category: 'Technology' },
  { type: 'multiple', question: 'How many continents are there?', answers: ['5', '6', '7', '8'], correct: 2, category: 'Geography' },
  { type: 'multiple', question: 'What is the speed of light?', answers: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], correct: 0, category: 'Science' },
  { type: 'multiple', question: 'Who wrote Romeo and Juliet?', answers: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1, category: 'Literature' },
  { type: 'multiple', question: 'What is the largest mammal?', answers: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'], correct: 1, category: 'Biology' },
  { type: 'multiple', question: 'What year did the first iPhone release?', answers: ['2005', '2006', '2007', '2008'], correct: 2, category: 'Technology' },
  { type: 'multiple', question: 'What is the tallest mountain in the world?', answers: ['K2', 'Mount Kilimanjaro', 'Mount Everest', 'Denali'], correct: 2, category: 'Geography' },
  { type: 'multiple', question: 'What is the main gas in Earth\'s atmosphere?', answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 1, category: 'Science' },
  { type: 'multiple', question: 'Who developed the theory of relativity?', answers: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Stephen Hawking'], correct: 1, category: 'Science' },
  { type: 'multiple', question: 'What is the capital of Japan?', answers: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correct: 2, category: 'Geography' },
  { type: 'multiple', question: 'How many bones are in the human body?', answers: ['186', '206', '226', '256'], correct: 1, category: 'Biology' },
  { type: 'multiple', question: 'What does HTML stand for?', answers: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0, category: 'Technology' },
  { type: 'multiple', question: 'Which country invented paper?', answers: ['Egypt', 'China', 'Greece', 'India'], correct: 1, category: 'History' },
  { type: 'multiple', question: 'What is the hardest natural substance on Earth?', answers: ['Gold', 'Iron', 'Diamond', 'Obsidian'], correct: 2, category: 'Science' },
  { type: 'multiple', question: 'Who was the first person to walk on the moon?', answers: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'], correct: 0, category: 'History' },
  { type: 'multiple', question: 'Which element has the chemical symbol "O"?', answers: ['Oxygen', 'Osmium', 'Oganesson', 'Oxide'], correct: 0, category: 'Science' },
  { type: 'multiple', question: 'What is the largest desert in the world?', answers: ['Sahara', 'Arabian', 'Antarctic', 'Gobi'], correct: 2, category: 'Geography' },
  { type: 'multiple', question: 'Which artist sang "Thriller"?', answers: ['Prince', 'Michael Jackson', 'Elvis Presley', 'Freddie Mercury'], correct: 1, category: 'Music' },
  { type: 'multiple', question: 'How many players are there on a soccer team?', answers: ['9', '10', '11', '12'], correct: 2, category: 'Sports' },
  { type: 'multiple', question: 'Which is the smallest planet in our solar system?', answers: ['Mercury', 'Mars', 'Venus', 'Earth'], correct: 0, category: 'Science' },
  { type: 'multiple', question: 'Which continent is the Sahara Desert located in?', answers: ['Asia', 'Africa', 'Australia', 'South America'], correct: 1, category: 'Geography' },

  // True/False Questions
  { type: 'truefalse', question: 'The Earth is flat.', answers: ['True', 'False'], correct: 1, category: 'Science' },
  { type: 'truefalse', question: 'Python is a programming language.', answers: ['True', 'False'], correct: 0, category: 'Technology' },
  { type: 'truefalse', question: 'The Great Wall of China is visible from space.', answers: ['True', 'False'], correct: 1, category: 'Geography' },
  { type: 'truefalse', question: 'Water boils at 100 degrees Celsius at sea level.', answers: ['True', 'False'], correct: 0, category: 'Science' },
  { type: 'truefalse', question: 'There are 50 states in the United States.', answers: ['True', 'False'], correct: 0, category: 'Geography' },
  { type: 'truefalse', question: 'The sun revolves around the Earth.', answers: ['True', 'False'], correct: 1, category: 'Science' },
  { type: 'truefalse', question: 'HTML is a programming language.', answers: ['True', 'False'], correct: 1, category: 'Technology' },
  { type: 'truefalse', question: 'Dolphins are mammals.', answers: ['True', 'False'], correct: 0, category: 'Biology' },
  { type: 'truefalse', question: 'The capital of Australia is Sydney.', answers: ['True', 'False'], correct: 1, category: 'Geography' },
  { type: 'truefalse', question: 'A triangle has four sides.', answers: ['True', 'False'], correct: 1, category: 'Math' },
  { type: 'truefalse', question: 'Lightning never strikes the same place twice.', answers: ['True', 'False'], correct: 1, category: 'Science' },
  { type: 'truefalse', question: 'Venus is hotter than Mercury.', answers: ['True', 'False'], correct: 0, category: 'Science' },
  { type: 'truefalse', question: 'Shakespeare wrote "To Kill a Mockingbird".', answers: ['True', 'False'], correct: 1, category: 'Literature' },
  { type: 'truefalse', question: 'Sound travels faster in water than in air.', answers: ['True', 'False'], correct: 0, category: 'Science' },
  { type: 'truefalse', question: 'Mount Everest is located in India.', answers: ['True', 'False'], correct: 1, category: 'Geography' },
  { type: 'truefalse', question: 'The human heart has four chambers.', answers: ['True', 'False'], correct: 0, category: 'Biology' },
  { type: 'truefalse', question: 'JavaScript was developed by Microsoft.', answers: ['True', 'False'], correct: 1, category: 'Technology' },
  { type: 'truefalse', question: 'An octopus has three hearts.', answers: ['True', 'False'], correct: 0, category: 'Biology' },
  { type: 'truefalse', question: 'The Amazon River is the longest river in the world.', answers: ['True', 'False'], correct: 1, category: 'Geography' },
  { type: 'truefalse', question: 'Zero is an even number.', answers: ['True', 'False'], correct: 0, category: 'Math' },

  // Add these to the QUESTIONS array
{ type: 'multiple', question: 'What is the mean of the numbers 4, 8, 12, and 16?', answers: ['8', '9', '10', '11'], correct: 2, category: 'Math' },
{ type: 'multiple', question: 'Solve for x: 3x + 5 = 14', answers: ['2', '3', '4', '5'], correct: 2, category: 'Math' },
{ type: 'multiple', question: 'What is the area of a circle with radius 7?', answers: ['49π', '14π', '7π', '28π'], correct: 0, category: 'Math' },
{ type: 'multiple', question: 'Find the derivative of f(x) = 3x² + 2x + 1.', answers: ['3x + 2', '6x + 2', '6x + 1', '3x² + 2'], correct: 1, category: 'Math' },
{ type: 'multiple', question: 'What is sin(30°)?', answers: ['1', '√3/2', '1/2', '√2/2'], correct: 2, category: 'Math' },
{ type: 'truefalse', question: 'The median is always equal to the mean in a normal distribution.', answers: ['True', 'False'], correct: 0, category: 'Math' },
{ type: 'multiple', question: 'Simplify: (x²y³) × (x³y²)', answers: ['x⁵y⁵', 'x⁶y⁵', 'x⁵y⁶', 'x⁴y⁴'], correct: 0, category: 'Math' },
{ type: 'multiple', question: 'The sum of the interior angles of a pentagon is:', answers: ['360°', '450°', '540°', '720°'], correct: 2, category: 'Math' },
{ type: 'multiple', question: 'Find the integral of f(x) = 2x.', answers: ['x² + C', '2x² + C', 'x + C', '4x + C'], correct: 0, category: 'Math' },
{ type: 'multiple', question: 'If tan(θ) = 1, what is θ?', answers: ['30°', '45°', '60°', '90°'], correct: 1, category: 'Math' },

  
  // Enumeration Questions
  { type: 'enumeration', question: 'Which are the primary colors?', answers: ['Red, Blue, Yellow', 'Red, Green, Blue', 'Orange, Purple, Green', 'Black, White, Gray'], correct: 0, category: 'Art' },
  { type: 'enumeration', question: 'What are the three states of matter?', answers: ['Solid, Liquid, Gas', 'Hot, Cold, Warm', 'Hard, Soft, Medium', 'Big, Small, Tiny'], correct: 0, category: 'Science' },
  { type: 'enumeration', question: 'Name the first three planets from the Sun.', answers: ['Mercury, Venus, Earth', 'Venus, Earth, Mars', 'Earth, Mars, Jupiter', 'Mars, Jupiter, Saturn'], correct: 0, category: 'Science' },
  { type: 'enumeration', question: 'What are the main components of a computer?', answers: ['CPU, RAM, Storage', 'Monitor, Keyboard, Mouse', 'Power, Display, Sound', 'Internet, Email, Browser'], correct: 0, category: 'Technology' },
  { type: 'enumeration', question: 'List the three branches of the US government.', answers: ['Executive, Legislative, Judicial', 'President, Senate, Court', 'Federal, State, Local', 'Military, Civil, Police'], correct: 0, category: 'History' },
  { type: 'enumeration', question: 'What are the three main macronutrients?', answers: ['Carbohydrates, Proteins, Fats', 'Vitamins, Minerals, Water', 'Sugar, Salt, Spice', 'Fruits, Vegetables, Grains'], correct: 0, category: 'Biology' },
  { type: 'enumeration', question: 'Name the three types of rocks.', answers: ['Igneous, Sedimentary, Metamorphic', 'Hard, Soft, Medium', 'Big, Small, Tiny', 'Gray, Brown, Black'], correct: 0, category: 'Science' },
  { type: 'enumeration', question: 'What are the RGB color values?', answers: ['Red, Green, Blue', 'Red, Gray, Black', 'Rose, Gold, Bronze', 'Ruby, Garnet, Beryl'], correct: 0, category: 'Technology' },
  { type: 'enumeration', question: 'List the three main programming paradigms.', answers: ['Procedural, Object-Oriented, Functional', 'Fast, Medium, Slow', 'Easy, Hard, Expert', 'Old, New, Future'], correct: 0, category: 'Technology' },
  { type: 'enumeration', question: 'What are the three laws of motion by Newton?', answers: ['Inertia, F=ma, Action-Reaction', 'Speed, Velocity, Acceleration', 'Push, Pull, Twist', 'Up, Down, Sideways'], correct: 0, category: 'Science' }
];

// ========== UTILITIES ==========
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getPlayerAvatar(name) {
  const emojis = ['😀', '😎', '🤓', '🥳', '🚀', '⭐', '🏓', '🏆', '💡', '🎨'];
  return emojis[name.charCodeAt(0) % emojis.length];
}

function saveToLeaderboard(player) {
  const leaderboardData = {
    name: player.name,
    avatar: player.avatar,
    score: player.score,
    correct: player.correct,
    accuracy: Math.round((player.correct / state.quiz.length) * 100),
    streak: player.streak,
    timestamp: Date.now(),
    gamesPlayed: 1,
    category: state.quiz[0]?.category || 'General'
  };
  
  state.globalLeaderboard.push(leaderboardData);
  state.globalLeaderboard.sort((a, b) => b.score - a.score);
  
  if (state.globalLeaderboard.length > 50) {
    state.globalLeaderboard = state.globalLeaderboard.slice(0, 50);
  }
  
  localStorage.setItem('inspersona_leaderboard', JSON.stringify(state.globalLeaderboard));
}

function loadLeaderboardData() {
  const saved = localStorage.getItem('inspersona_leaderboard');
  if (saved) {
    state.globalLeaderboard = JSON.parse(saved);
  }
}

function showPowerupNotification(powerName) {
  const notification = document.getElementById('powerupNotification');
  const icon = document.getElementById('powerupIcon');
  const text = document.getElementById('powerupText');
  
  const powerData = {
    fifty: { icon: '🏓', text: '50/50 Activated!' },
    freeze: { icon: '⏰', text: 'Time Freeze +10s!' },
    skip: { icon: '⭐', text: 'Question Skipped!' },
    double: { icon: '💎', text: '2x Points Active!' }
  };
  
  const data = powerData[powerName];
  icon.textContent = data.icon;
  text.textContent = data.text;
  
  notification.classList.add('active');
  setTimeout(() => {
    notification.classList.remove('active');
  }, 2000);
}

// ========== ACHIEVEMENT SYSTEM ==========
function initializeAchievements() {
  const saved = localStorage.getItem('inspersona_achievements');
  if (saved) {
    const data = JSON.parse(saved);
    state.unlockedAchievements = data.unlockedAchievements || [];
  }
  
  state.achievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: state.unlockedAchievements.includes(a.id)
  }));
}

function getAchievementStats() {
  const saved = localStorage.getItem('inspersona_stats');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    quizzesCompleted: 0,
    perfectScores: 0,
    noTimeoutsStreak: 0,
    bestStreak: 0,
    noPowerUpsUsed: 0,
    highestScore: 0,
    highAccuracyCount: 0,
    ultraHighAccuracyCount: 0
  };
}

function saveAchievementStats(stats) {
  localStorage.setItem('inspersona_stats', JSON.stringify(stats));
}

function checkAchievements() {
  const stats = getAchievementStats();
  
  stats.quizzesCompleted += 1;
  
  const accuracy = (state.correctAnswers / state.quiz.length) * 100;
  if (accuracy === 100) stats.perfectScores += 1;
  if (accuracy >= 90) stats.highAccuracyCount += 1;
  if (accuracy >= 95) stats.ultraHighAccuracyCount += 1;
  
  if (state.powerUpsUsedThisQuiz === 0) stats.noPowerUpsUsed += 1;
  
  stats.bestStreak = Math.max(stats.bestStreak, state.bestStreak);
  stats.highestScore = Math.max(stats.highestScore, state.score);
  
  if (state.timeoutsInQuiz === 0) {
    stats.noTimeoutsStreak = (stats.noTimeoutsStreak || 0) + 1;
  } else {
    stats.noTimeoutsStreak = 0;
  }
  
  saveAchievementStats(stats);
  
  state.newlyUnlockedAchievements = [];
  
  state.achievements.forEach(achievement => {
    if (!achievement.unlocked && achievement.check(stats)) {
      achievement.unlocked = true;
      state.unlockedAchievements.push(achievement.id);
      state.newlyUnlockedAchievements.push(achievement);
      state.skillPoints += achievement.reward;
    }
  });
  
  localStorage.setItem('inspersona_achievements', JSON.stringify({
    unlockedAchievements: state.unlockedAchievements
  }));
  
  localStorage.setItem('inspersona_skillPoints', state.skillPoints);
  
  return state.newlyUnlockedAchievements;
}

function renderAchievements() {
  const container = document.getElementById('achievementsGrid');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Group achievements by difficulty
  const easyAchievements = state.achievements.filter(a => a.difficulty === 'easy');
  const hardAchievements = state.achievements.filter(a => a.difficulty === 'hard');
  const impossibleAchievements = state.achievements.filter(a => a.difficulty === 'impossible');
  
  // Helper function to render achievement group
  const renderGroup = (achievements, title, color) => {
    const section = document.createElement('div');
    section.className = 'achievement-difficulty-section';
    section.innerHTML = `<h3 class="achievement-difficulty-title" style="color: ${color};">${title}</h3>`;
    
    const grid = document.createElement('div');
    grid.className = 'achievements-difficulty-grid';
    
    achievements.forEach(achievement => {
      const card = document.createElement('div');
      card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
      
      const progressPercent = achievement.unlocked ? 100 : 0;
      
      card.innerHTML = `
        <div class="achievement-difficulty-badge ${achievement.difficulty}">${achievement.difficulty.toUpperCase()}</div>
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.description}</div>
        <div class="achievement-progress">
          <div class="achievement-progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="achievement-status">${achievement.unlocked ? 'Unlocked!' : 'Locked'}</div>
        <div class="achievement-reward">+${achievement.reward} SP</div>
      `;
      
      grid.appendChild(card);
    });
    
    section.appendChild(grid);
    container.appendChild(section);
  };
  
  // Render each difficulty group
  renderGroup(easyAchievements, '🏢 EASY ACHIEVEMENTS', '#10B981');
  renderGroup(hardAchievements, '🏠  HARD ACHIEVEMENTS', '#F59E0B');
  renderGroup(impossibleAchievements, '🔴 IMPOSSIBLE ACHIEVEMENTS', '#EF4444');
}

function showUnlockedAchievements() {
  if (state.newlyUnlockedAchievements.length === 0) {
    document.getElementById('achievementsUnlocked').style.display = 'none';
    return;
  }
  
  const section = document.getElementById('achievementsUnlocked');
  const list = document.getElementById('unlockedAchievementsList');
  
  section.style.display = 'block';
  list.innerHTML = '';
  
  state.newlyUnlockedAchievements.forEach(achievement => {
    const badge = document.createElement('div');
    badge.className = 'unlocked-achievement-badge';
    badge.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div>
        <div style="font-weight: 800;">${achievement.name}</div>
        <div style="font-size: 12px; color: #64748B;">+${achievement.reward} SP</div>
      </div>
    `;
    list.appendChild(badge);
  });
}

// ========== SKILL TREE ==========
const SKILL_LIMITS = {
  extraFifty: 5,
  extraFreeze: 5,
  extraSkip: 5,
  extraDouble: 5
};

function loadSkillTree() {
  document.getElementById('skillPoints').textContent = state.skillPoints;
  
  document.querySelectorAll('.skill-node').forEach(node => {
    const skill = node.dataset.skill;
    const cost = parseInt(node.dataset.cost);
    const owned = state.unlockedSkills.filter(s => s === skill).length;
    const limit = SKILL_LIMITS[skill] || 1;
    
    // Update owned count display
    const ownedDisplay = node.querySelector('.skill-owned');
    if (ownedDisplay) {
      ownedDisplay.textContent = `Owned: ${owned}/${limit}`;
      if (owned >= limit) {
        ownedDisplay.style.color = 'var(--correct)';
      }
    }
    
    // Check if max owned
    if (owned >= limit) {
      node.classList.remove('locked', 'affordable');
      node.classList.add('max-owned');
    } else if (owned > 0) {
      node.classList.remove('locked');
      node.classList.add('partially-owned');
      if (state.skillPoints >= cost) {
        node.classList.add('affordable');
      } else {
        node.classList.remove('affordable');
      }
    } else if (state.skillPoints >= cost) {
      node.classList.add('affordable');
      node.classList.remove('locked');
    } else {
      node.classList.remove('affordable');
      node.classList.add('locked');
    }
  });
}

function unlockSkill(skillName, cost) {
  const owned = state.unlockedSkills.filter(s => s === skillName).length;
  const limit = SKILL_LIMITS[skillName] || 1;
  
  if (owned >= limit) {
    alert(`❌ Maximum owned! You already have ${limit}x ${skillName}.`);
    return;
  }
  
  if (state.skillPoints >= cost) {
    state.skillPoints -= cost;
    state.unlockedSkills.push(skillName);
    
    localStorage.setItem('inspersona_skillPoints', state.skillPoints);
    localStorage.setItem('inspersona_unlockedSkills', JSON.stringify(state.unlockedSkills));
    
    loadSkillTree();
    
    const skillNode = document.querySelector(`[data-skill="${skillName}"]`);
    const skillNameText = skillNode.querySelector('.skill-name').textContent;
    const newOwned = state.unlockedSkills.filter(s => s === skillName).length;
    alert(`✨ Skill Purchased: ${skillNameText}! (${newOwned}/${limit})`);
  }
}

function applySkillBonuses() {
  let basePowerUps = { fifty: 1, freeze: 1, skip: 1, double: 1 };
  
  // Count how many of each skill is owned
  const fiftyCount = state.unlockedSkills.filter(s => s === 'extraFifty').length;
  const freezeCount = state.unlockedSkills.filter(s => s === 'extraFreeze').length;
  const skipCount = state.unlockedSkills.filter(s => s === 'extraSkip').length;
  const doubleCount = state.unlockedSkills.filter(s => s === 'extraDouble').length;
  
  basePowerUps.fifty += fiftyCount;
  basePowerUps.freeze += freezeCount;
  basePowerUps.skip += skipCount;
  basePowerUps.double += doubleCount;
  
  state.powerUps = basePowerUps;
}

function calculateSkillPointsEarned() {
  let earnedSP = 3;
  
  const accuracy = (state.correctAnswers / state.quiz.length) * 100;
  if (accuracy === 100) earnedSP += 5;
  else if (accuracy >= 90) earnedSP += 3;
  else if (accuracy >= 80) earnedSP += 2;
  
  if (state.bestStreak >= 10) earnedSP += 4;
  else if (state.bestStreak >= 5) earnedSP += 2;
  
  if (state.powerUpsUsedThisQuiz === 0) earnedSP += 3;
  
  if (state.timeoutsInQuiz === 0) earnedSP += 2;
  
  return earnedSP;
}

function loadSavedData() {
  const savedSP = localStorage.getItem('inspersona_skillPoints');
  const savedSkills = localStorage.getItem('inspersona_unlockedSkills');
  
  if (savedSP) state.skillPoints = parseInt(savedSP);
  if (savedSkills) state.unlockedSkills = JSON.parse(savedSkills);
}

// ========== NAVIGATION ==========
document.getElementById('navBrandHome').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('homeSection').classList.add('active');
  document.getElementById('mainNav').classList.remove('visible');
});

document.getElementById('navDashboard').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('navDashboard').classList.add('active');
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('dashboardSection').classList.add('active');
  document.getElementById('mainNav').classList.add('visible');
  loadDashboardData();
});

document.getElementById('navLearn').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('navLearn').classList.add('active');
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('learnSection').classList.add('active');
  document.getElementById('mainNav').classList.add('visible');
});

document.getElementById('navQuiz').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('navQuiz').classList.add('active');
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('quizGameSection').classList.add('active');
  document.getElementById('mainNav').classList.add('visible');
});

document.getElementById('navSkillTree').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('navSkillTree').classList.add('active');
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('skillTreeSection').classList.add('active');
  document.getElementById('mainNav').classList.add('visible');
  loadSkillTree();
  renderAchievements();
});

document.getElementById('navLeaderboard').addEventListener('click', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('navLeaderboard').classList.add('active');
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById('leaderboardSection').classList.add('active');
  document.getElementById('mainNav').classList.add('visible');
  renderLeaderboard();
});

document.getElementById('startLearningHero').addEventListener('click', () => {
  document.getElementById('navLearn').click();
});

document.getElementById('startLearningCTA').addEventListener('click', () => {
  document.getElementById('navLearn').click();
});

document.querySelectorAll('.skill-node').forEach(node => {
  node.addEventListener('click', () => {
    const skill = node.dataset.skill;
    const cost = parseInt(node.dataset.cost);
    const owned = state.unlockedSkills.filter(s => s === skill).length;
    const limit = SKILL_LIMITS[skill] || 1;
    
    if (owned >= limit) {
      alert(`✅ Already maxed out! You own ${limit}/${limit} of this power-up.`);
    } else if (state.skillPoints >= cost) {
      unlockSkill(skill, cost);
    } else {
      alert(`❌ Not enough Skill Points! You need ${cost} SP but only have ${state.skillPoints} SP.`);
    }
  });
});

// ========== FILE UPLOAD ==========
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const learningFormatsCard = document.getElementById('learningFormatsCard');
const quizConfigCard = document.getElementById('quizConfigCard');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFileUpload(file);
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleFileUpload(e.target.files[0]);
});

function handleFileUpload(file) {
  state.uploadedFile = file;
  uploadArea.classList.add('has-file');
  document.getElementById('uploadIcon').textContent = '✅';
  document.getElementById('fileName').textContent = file.name;
  fileInfo.classList.add('active');
  
  showLoadingScreen('upload'); // CHANGED
  
  setTimeout(() => {
    hideLoadingScreen();
    learningFormatsCard.classList.add('active');
  }, 3000);
}

document.getElementById('removeFileBtn').addEventListener('click', () => {
  state.uploadedFile = null;
  fileInput.value = '';
  uploadArea.classList.remove('has-file');
  document.getElementById('uploadIcon').textContent = '📄';
  fileInfo.classList.remove('active');
  learningFormatsCard.classList.remove('active');
  quizConfigCard.classList.remove('active');
  // Remove selected state from all format cards
  document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
});

let loadingInterval = null;
let progressInterval = null;

function showLoadingScreen(type = 'quiz') {
  const loadingScreen = document.getElementById('loadingScreen');
  const config = LOADING_CONFIGS[type] || LOADING_CONFIGS.quiz;
  
  // Update content
  document.querySelector('.loading-title').textContent = config.title;
  document.querySelector('.loading-subtitle').textContent = config.subtitle;
  
  const steps = document.querySelectorAll('.loading-step');
  steps.forEach((step, index) => {
    if (config.steps[index]) {
      step.querySelector('.step-icon').textContent = config.steps[index].icon;
      step.querySelector('.step-text').textContent = config.steps[index].text;
      step.classList.remove('active');
    }
  });
  
  // Show loading screen
  loadingScreen.classList.add('active');
  
  // Animate progress bar
  const progressBar = document.querySelector('.loading-progress-bar');
  let progress = 0;
  progressBar.style.width = '0%';
  
  progressInterval = setInterval(() => {
    progress += 2;
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';
    
    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 30);
  
  // Animate steps
  let currentStep = 0;
  steps[0].classList.add('active');
  
  loadingInterval = setInterval(() => {
    steps.forEach(s => s.classList.remove('active'));
    currentStep = (currentStep + 1) % steps.length;
    steps[currentStep].classList.add('active');
  }, 1000);
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.remove('active');
  
  // Clear intervals
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  
  // Reset progress bar
  const progressBar = document.querySelector('.loading-progress-bar');
  progressBar.style.width = '0%';
}

// ========== AI IMAGE GENERATION ==========
function showImageGeneration() {
  document.getElementById('imageGenerationScreen').classList.add('active');
  
  const gallery = document.getElementById('imageGallery');
  gallery.innerHTML = '';
  
  const imageTopics = [
    { 
      title: 'Concept Visualization', 
      desc: 'Visual diagram illustrating the main concepts and their relationships',
      icon: '🎨',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      title: 'Mind Map', 
      desc: 'Interactive mind map showing connections between key ideas',
      icon: '🧠 ',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      title: 'Flowchart Diagram', 
      desc: 'Step-by-step process flowchart for better understanding',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      title: 'Infographic Summary', 
      desc: 'Data-driven infographic with statistics and key takeaways',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      title: 'Timeline View', 
      desc: 'Chronological timeline showing progression and milestones',
      icon: '⏳',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      title: 'Comparison Chart', 
      desc: 'Side-by-side comparison of different concepts or approaches',
      icon: '⚖️',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    }
  ];
  
  imageTopics.forEach((topic, index) => {
    setTimeout(() => {
      const card = document.createElement('div');
      card.className = 'image-card';
      card.innerHTML = `
        <div class="image-placeholder" style="background: ${topic.gradient}">
          <div class="image-placeholder-content">
            <div class="placeholder-icon">${topic.icon}</div>
            <div class="placeholder-status">Generating...</div>
          </div>
        </div>
        <div class="image-info">
          <div class="image-title">${topic.title}</div>
          <div class="image-desc">${topic.desc}</div>
          <button class="btn-view-image">View Full Size</button>
        </div>
      `;
      
      // Animate the placeholder after card is added
      setTimeout(() => {
        const placeholder = card.querySelector('.image-placeholder-content');
        placeholder.classList.add('generated');
        card.querySelector('.placeholder-status').textContent = 'Ready';
      }, 1500);
      
      // Add click handler for view button
      card.querySelector('.btn-view-image').addEventListener('click', () => {
       alert(`🖼️ Full-size view of: ${topic.title}\n\nIn a real implementation, this would show the generated AI image in a lightbox overlay.`);
      });
      
      gallery.appendChild(card);
    }, index * 400);
  });
}

document.getElementById('backFromImageBtn').addEventListener('click', () => {
  document.getElementById('imageGenerationScreen').classList.remove('active');
});

// ========== SMART SUMMARY ==========
function showSmartSummary() {
  document.getElementById('summaryScreen').classList.add('active');
  
  // Show notification when entering summary screen
  setTimeout(() => {
    alert('📋 Example Summary\n\nThis is a demonstration summary. In a real implementation, AI would analyze your actual document content and provide personalized insights based on the material you uploaded.');
  }, 500);
  
  const content = document.getElementById('summaryContent');
  content.innerHTML = '';
  
  const summaryHTML = `
    <div class="summary-section">
      <h2>📊 Document Overview</h2>
      <p>This document covers <span class="highlight">essential concepts</span> in ${state.uploadedFile.name.split('.')[0]}. The material presents a comprehensive analysis of key topics, providing both theoretical foundations and practical applications.</p>
    </div>
    
    <div class="summary-section">
      <h2>🔍 Main Topics</h2>
      <p>The content is structured around several <span class="highlight">core principles</span> that build upon each other. Each section introduces new concepts while reinforcing previous knowledge, creating a cohesive learning experience.</p>
      
      <div class="key-points">
        <h3>Key Takeaways</h3>
        <ul>
          <li><span class="highlight">Foundational Knowledge:</span> Understanding the basics is crucial for advanced topics</li>
          <li><span class="highlight">Practical Application:</span> Real-world examples demonstrate concept implementation</li>
          <li><span class="highlight">Critical Thinking:</span> Analysis and evaluation skills are emphasized throughout</li>
          <li><span class="highlight">Best Practices:</span> Industry-standard approaches and methodologies are highlighted</li>
          <li><span class="highlight">Future Implications:</span> Forward-looking perspectives on how concepts evolve</li>
        </ul>
      </div>
    </div>
    
    <div class="summary-section">
      <h2>💡 Important Concepts</h2>
      <p>Several <span class="highlight">critical concepts</span> emerge as central themes. These include systematic approaches to problem-solving, evidence-based reasoning, and the importance of context in application.</p>
    </div>
    
    <div class="summary-section">
      <h2>🔬 Detailed Analysis</h2>
      <p>The document provides <span class="highlight">in-depth exploration</span> of complex topics, breaking them down into manageable components. This analytical approach helps learners grasp difficult concepts through structured explanation and examples.</p>
      
      <div class="key-points">
        <h3>Critical Points</h3>
        <ul>
          <li>Systematic methodology ensures consistent results</li>
          <li>Evidence-based approaches provide reliable foundations</li>
          <li>Contextual understanding enhances practical application</li>
          <li>Continuous improvement through feedback and iteration</li>
        </ul>
      </div>
    </div>
    
    <div class="summary-section">
      <h2>✅ Conclusion</h2>
      <p>The material successfully combines <span class="highlight">theoretical knowledge with practical insights</span>, providing a comprehensive learning resource. Students who engage with this content will develop both understanding and applicable skills.</p>
    </div>
  `;
  
  content.innerHTML = summaryHTML;
  
  setTimeout(() => {
    document.querySelectorAll('.summary-section').forEach((section, index) => {
      section.style.animation = `slideUp 0.5s ease ${index * 0.1}s backwards`;
    });
  }, 100);
}

document.getElementById('backFromSummaryBtn').addEventListener('click', () => {
  document.getElementById('summaryScreen').classList.remove('active');
});

// ========== AI TUTOR CHAT ==========
function showAIChat() {
  document.getElementById('chatScreen').classList.add('active');
  
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.innerHTML = `
    <div class="chat-message ai-message">
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <p>Hello! I've analyzed your document "<strong>${state.uploadedFile.name}</strong>" and I'm ready to help you learn. Ask me anything about the content!</p>
      </div>
    </div>
  `;
  
  document.getElementById('chatInput').value = '';
}

document.getElementById('backFromChatBtn').addEventListener('click', () => {
  document.getElementById('chatScreen').classList.remove('active');
});

document.getElementById('sendMessageBtn').addEventListener('click', sendChatMessage);
document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  addChatMessage(message, 'user');
  input.value = '';
  
  // Show notification when user sends message
  alert('💬 Simulated AI Response\n\nThis is a demonstration chatbot. In a real implementation, AI would analyze your uploaded document and provide contextual, relevant answers based on the actual content of your material.');
  
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateAIResponse(message);
    addChatMessage(response, 'ai');
  }, 1500 + Math.random() * 1000);
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;
  
  const avatar = sender === 'user' ? '👤' : '🤖';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <p>${text}</p>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message ai-message typing-message';
  typingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  const typingMessage = document.querySelector('.typing-message');
  if (typingMessage) typingMessage.remove();
}

function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('what') && (lowerMessage.includes('about') || lowerMessage.includes('is'))) {
    return `Based on the document, this topic covers essential information about ${state.uploadedFile.name.split('.')[0]}. The content explores key concepts, methodologies, and practical applications. Would you like me to explain any specific section in more detail?`;
  }
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('how')) {
    return `Great question! Let me break this down for you. The document presents this concept through several interconnected ideas. First, it establishes the foundational principles, then builds upon them with examples and applications. The key is understanding how each component relates to the others. Is there a particular aspect you'd like me to clarify?`;
  }
  
  if (lowerMessage.includes('example') || lowerMessage.includes('instance')) {
    return `Certainly! Here's a practical example from the material: Consider a real-world scenario where these principles are applied. The document illustrates this through case studies showing both successful implementations and common pitfalls to avoid. This helps contextualize the theory with actionable insights.`;
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    return `Here's a concise summary: The document presents a comprehensive overview of its subject matter, covering fundamental concepts, advanced applications, and best practices. Key themes include systematic approaches, evidence-based reasoning, and practical implementation strategies. Each section builds logically on previous content to create a cohesive learning experience.`;
  }
  
  if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('confus')) {
    return `I understand this can be challenging! Let's approach it step by step. The concept becomes clearer when you break it into smaller parts. Think of it as building blocks - each piece makes sense on its own, and together they form the complete picture. Which specific part would you like me to explain more simply?`;
  }
  
  if (lowerMessage.includes('why') || lowerMessage.includes('reason')) {
    return `That's an excellent question! The reasoning behind this is multifaceted. According to the document, this approach is preferred because it provides several advantages: reliability, efficiency, and practical applicability. The authors emphasize that understanding the 'why' is just as important as knowing the 'how' for true mastery.`;
  }
  
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference')) {
    return `Good thinking - comparison helps deepen understanding! The document highlights several key differences and similarities. While both approaches share common foundations, they diverge in their implementation and use cases. The choice between them often depends on specific requirements and contexts outlined in the material.`;
  }
  
  if (lowerMessage.includes('important') || lowerMessage.includes('key')) {
    return `The most important points from the document include: (1) Understanding fundamental principles before advanced topics, (2) Recognizing practical applications in real scenarios, (3) Developing critical thinking skills through analysis, and (4) Following established best practices. These form the core of what you should focus on mastering.`;
  }
  
  if (lowerMessage.includes('test') || lowerMessage.includes('exam') || lowerMessage.includes('quiz')) {
    return `For test preparation, I recommend focusing on: the main concepts discussed in each section, practical applications and examples, key terminology and definitions, and relationships between different topics. The quiz feature can help you practice! Would you like some specific questions to test your understanding?`;
  }
  
  if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
    return `You're welcome! I'm here to help you learn and understand the material better. Feel free to ask any more questions about the document - whether you need clarification, examples, or want to explore topics in more depth. What else would you like to know?`;
  }
  
  const defaultResponses = [
    `That's an interesting question! From the document's perspective, this relates to the broader concepts of systematic learning and practical application. The material suggests approaching this by first understanding the fundamentals, then exploring more complex variations. Would you like me to elaborate on any specific aspect?`,
    
    `Based on the content in your document, this topic is addressed through several key points. The authors emphasize the importance of contextual understanding and provide frameworks for analysis. Let me know if you'd like me to go deeper into any particular element.`,
    
    `Great query! The document provides valuable insights on this. The key takeaway is that understanding requires both theoretical knowledge and practical application. The material includes examples that demonstrate these principles in action. Is there a specific part you'd like to explore further?`,
    
    `Excellent question! According to the material, this concept is fundamental to the overall subject matter. It connects to several other topics discussed in the document, creating a web of related knowledge. Would you like me to explain how these connections work?`,
    
    `That's a thoughtful question! The document addresses this by presenting multiple perspectives and evidence-based conclusions. The authors recommend considering various factors and contexts when applying these principles. Shall I break down the specific factors mentioned?`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}


// ========== AI VIDEO GENERATION ==========
// ========== AI VIDEO GENERATION ==========
function showVideoGeneration() {
  document.getElementById('videoGenerationScreen').classList.add('active');
  
  // Show notification when entering video screen
  setTimeout(() => {
    alert('🎬 Video Generation Demo\n\nThis feature generates ONE comprehensive educational video that students can watch and copy along with.\n\n✨ What you see:\n• Single demonstration video\n• Complete step-by-step guide\n• Easy to follow and replicate\n\n🚀 In a real implementation:\n• AI analyzes your document\n• Generates custom video demonstration\n• Creates hands-on visual tutorial\n• Perfect for kinesthetic learners to watch and copy\n• Students can pause and practice each step');
  }, 500);
  
  const gallery = document.getElementById('videoGallery');
  gallery.innerHTML = '';
  
  // Single video for students to copy
  const video = {
    title: 'Complete Step-by-Step Video Tutorial', 
    desc: 'Watch this comprehensive demonstration and follow along at your own pace. Perfect for hands-on learning - pause, rewind, and practice each step as many times as needed.',
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    duration: '8:45'
  };
  
  setTimeout(() => {
    const card = document.createElement('div');
    card.className = 'video-card video-card-single';
    card.innerHTML = `
      <div class="video-placeholder" style="background: ${video.gradient}">
        <div class="video-placeholder-content">
          <div class="video-placeholder-icon">${video.icon}</div>
          <div class="video-play-overlay">
            <div class="video-play-button">▶</div>
          </div>
          <div class="video-duration">${video.duration}</div>
          <div class="video-status">Ready to Watch</div>
        </div>
      </div>
      <div class="video-info">
        <div class="video-title">${video.title}</div>
        <div class="video-desc">${video.desc}</div>
        
        <div class="video-learning-tips">
          <h4>📚 How to Use This Video:</h4>
          <ul>
            <li>👀 <strong>Watch</strong> the entire demonstration first</li>
            <li>⏸️ <strong>Pause</strong> at each step to practice</li>
            <li>✋ <strong>Copy</strong> the movements and techniques shown</li>
            <li>🔁 <strong>Repeat</strong> until you feel confident</li>
            <li>✅ <strong>Practice</strong> on your own after watching</li>
          </ul>
        </div>
        
        <div class="video-actions">
          <button class="btn-play-video" data-title="${video.title}">
            <span class="btn-icon">▶</span>
            Watch & Learn
          </button>
          <button class="btn-download-video" data-title="${video.title}">
            <span class="btn-icon">⬇</span>
            Download
          </button>
        </div>
        
        <div class="video-features">
          <span class="video-feature">👋 Kinesthetic Learning</span>
          <span class="video-feature">📋 Follow Along</span>
          <span class="video-feature">🔁 Repeatable</span>
          <span class="video-feature">⏸️ Pauseable</span>
        </div>
      </div>
    `;
    
    // Animate the placeholder after card is added
    setTimeout(() => {
      const placeholder = card.querySelector('.video-placeholder-content');
      placeholder.classList.add('generated');
    }, 800);
    
    // Add click handler for play button
    card.querySelector('.btn-play-video').addEventListener('click', () => {
      alert(`🎬 Playing: ${video.title}\n\n📺 This video demonstrates:\n\n1️⃣ Complete overview of the topic\n2️⃣ Step-by-step breakdown\n3️⃣ Hands-on demonstrations\n4️⃣ Practice techniques\n5️⃣ Common mistakes to avoid\n\n💡 Learning Tips:\n• Watch the full video first\n• Pause and practice each section\n• Copy the techniques shown\n• Repeat as many times as needed\n• Practice independently afterward\n\nPerfect for kinesthetic learners who learn by doing!`);
    });
    
    // Add click handler for download button
    card.querySelector('.btn-download-video').addEventListener('click', () => {
      alert(`⬇ Download Video\n\nDownloading: ${video.title}\n\nIn a real implementation, you could:\n✅ Save for offline viewing\n✅ Watch without internet\n✅ Practice anytime, anywhere\n✅ Share with study partners\n\nPerfect for repeated practice and review!`);
    });
    
    gallery.appendChild(card);
  }, 400);
}

document.getElementById('backFromVideoBtn').addEventListener('click', () => {
  document.getElementById('videoGenerationScreen').classList.remove('active');
});


// ========== LEARNING FORMATS ==========
document.querySelectorAll('.format-card').forEach(card => {
  card.addEventListener('click', () => {
    if (!state.uploadedFile) {
      alert('Please upload a file first!');
      return;
    }
    
    document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedFormat = card.dataset.format;
    
    if (card.dataset.format === 'video') {
      showLoadingScreen('video');
      setTimeout(() => {
        hideLoadingScreen();
        showVideoGeneration();
      }, 3000);

    } else if (card.dataset.format === 'image') {
      showLoadingScreen('image'); // CHANGED
      setTimeout(() => {
        hideLoadingScreen();
        showImageGeneration();
      }, 3000);
    } else if (card.dataset.format === 'summary') {
      showLoadingScreen('summary'); // CHANGED
      setTimeout(() => {
        hideLoadingScreen();
        showSmartSummary();
      }, 3000);
    } else if (card.dataset.format === 'chat') {
      showLoadingScreen('chat'); // CHANGED
      setTimeout(() => {
        hideLoadingScreen();
        showAIChat();
      }, 2000);
    } else if (card.dataset.format === 'quiz') {
      showLoadingScreen('quiz'); // CHANGED
      setTimeout(() => {
        hideLoadingScreen();
        quizConfigCard.classList.add('active');
        quizConfigCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 2000);
    }
  });
});

// ========== QUIZ CONFIGURATION ==========
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.difficulty = btn.dataset.difficulty;
  });
});

document.getElementById('timePerQuestion').addEventListener('change', (e) => {
  state.timePerQuestion = parseInt(e.target.value);
  state.initialTimePerQuestion = state.timePerQuestion;
});

document.getElementById('numQuestions').addEventListener('change', (e) => {
  state.numQuestions = parseInt(e.target.value);
});

document.querySelectorAll('.type-checkbox input').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    state.questionTypes = Array.from(document.querySelectorAll('.type-checkbox input:checked')).map(cb => cb.dataset.type);
    if (state.questionTypes.length === 0) {
      checkbox.checked = true;
      state.questionTypes = [checkbox.dataset.type];
    }
  });
});

document.getElementById('startLearningBtn').addEventListener('click', () => {
  if (!state.uploadedFile) {
    alert('Please upload a file first!');
    return;
  }
  startQuiz();
});

// ========== QUESTION SOURCE SELECTION ==========
let questionSource = 'default';
let selectedCategories = ['all'];

// Source option selection
document.querySelectorAll('.source-option-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.source-option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    questionSource = card.dataset.source;
    state.questionSource = questionSource;
    
    // Show/hide appropriate sections
    if (questionSource === 'default') {
      document.getElementById('categorySelectionSection').style.display = 'block';
      document.getElementById('aiGenerationSection').style.display = 'none';
    } else {
      document.getElementById('categorySelectionSection').style.display = 'none';
      document.getElementById('aiGenerationSection').style.display = 'block';
      
      // Update AI file name display
      if (state.uploadedFile) {
        document.getElementById('aiFileName').textContent = state.uploadedFile.name;
      }
    }
  });
});

// Category selection
const categoryCheckboxes = document.querySelectorAll('.category-checkbox input[type="checkbox"]');
const categoryAll = document.getElementById('categoryAll');

categoryCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const category = checkbox.dataset.category;
    
    if (category === 'all') {
      // If "All" is checked, uncheck all others
      if (checkbox.checked) {
        categoryCheckboxes.forEach(cb => {
          if (cb.dataset.category !== 'all') {
            cb.checked = false;
          }
        });
        selectedCategories = ['all'];
      } else {
        // Don't allow unchecking "All" if no other categories are selected
        checkbox.checked = true;
      }
    } else {
      // If a specific category is checked, uncheck "All"
      if (checkbox.checked) {
        categoryAll.checked = false;
        selectedCategories = Array.from(categoryCheckboxes)
          .filter(cb => cb.checked && cb.dataset.category !== 'all')
          .map(cb => cb.dataset.category);
        
        // If no categories selected, check "All"
        if (selectedCategories.length === 0) {
          categoryAll.checked = true;
          selectedCategories = ['all'];
        }
      } else {
        selectedCategories = Array.from(categoryCheckboxes)
          .filter(cb => cb.checked && cb.dataset.category !== 'all')
          .map(cb => cb.dataset.category);
        
        // If no categories selected, check "All"
        if (selectedCategories.length === 0) {
          categoryAll.checked = true;
          selectedCategories = ['all'];
        }
      }
    }
    
    state.selectedCategories = selectedCategories;
    updateAvailableQuestionsCount();
  });
});

// Update available questions count
function updateAvailableQuestionsCount() {
  if (questionSource !== 'default') return;
  
  let availableQuestions;
  if (selectedCategories.includes('all')) {
    availableQuestions = QUESTIONS;
  } else {
    availableQuestions = QUESTIONS.filter(q => 
      selectedCategories.includes(q.category) && state.questionTypes.includes(q.type)
    );
  }
  
  const count = availableQuestions.length;
  const maxQuestions = document.getElementById('numQuestions');
  
  // Update max attribute
  maxQuestions.max = count;
  
  // If current value exceeds available, adjust it
  if (parseInt(maxQuestions.value) > count) {
    maxQuestions.value = count;
    state.numQuestions = count;
  }
}

// Update question types handler to also update count
document.querySelectorAll('.type-checkbox input').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    state.questionTypes = Array.from(document.querySelectorAll('.type-checkbox input:checked')).map(cb => cb.dataset.type);
    if (state.questionTypes.length === 0) {
      checkbox.checked = true;
      state.questionTypes = [checkbox.dataset.type];
    }
    updateAvailableQuestionsCount();
  });
});

function startQuiz() {
  if (!state.uploadedFile) {
    alert('Please upload a file first!');
    return;
  }
  
  let quizQuestions;
  
  if (state.questionSource === 'ai') {
    // AI Generated Questions
    showLoadingScreen('quiz');
    
    setTimeout(() => {
      hideLoadingScreen();
      
      // Simulate AI generation with notification
      alert('🤖 AI Question Generation\n\nIn a real implementation, AI would:\n\n1️⃣ Analyze your uploaded file content\n2️⃣ Extract key concepts and topics\n3️⃣ Generate custom questions based on the material\n4️⃣ Adapt difficulty to your selected level\n5️⃣ Create various question types\n\nFor this demo, we\'ll use sample questions that simulate AI-generated content based on your file.');
      
      // For demo, use random questions as if they were AI-generated
      const filteredQuestions = QUESTIONS.filter(q => state.questionTypes.includes(q.type));
      
      if (filteredQuestions.length === 0) {
        alert('No questions available for selected types! Please select different question types.');
        return;
      }
      
      const numQuestionsToUse = Math.min(state.numQuestions, filteredQuestions.length);
      quizQuestions = shuffleArray(filteredQuestions).slice(0, numQuestionsToUse);
      
      initializeQuiz(quizQuestions);
    }, 3000);
    return;
    
  } else {
    // Default Questions
    let filteredQuestions;
    
    if (state.selectedCategories.includes('all')) {
      filteredQuestions = QUESTIONS.filter(q => state.questionTypes.includes(q.type));
    } else {
      filteredQuestions = QUESTIONS.filter(q => 
        state.selectedCategories.includes(q.category) && state.questionTypes.includes(q.type)
      );
    }
    
    if (filteredQuestions.length === 0) {
      alert('No questions available for selected categories and types! Please adjust your selection.');
      return;
    }
    
    const numQuestionsToUse = Math.min(state.numQuestions, filteredQuestions.length);
    
    if (numQuestionsToUse < state.numQuestions) {
      alert(`Only ${numQuestionsToUse} questions available for your selection. Starting quiz with available questions.`);
    }
    
    // Separate math questions from other questions
    const mathQuestions = filteredQuestions.filter(q => q.category === 'Math');
    const otherQuestions = filteredQuestions.filter(q => q.category !== 'Math');
    
    // Shuffle both arrays
    const shuffledMath = shuffleArray(mathQuestions);
    const shuffledOthers = shuffleArray(otherQuestions);
    
    // Prioritize math questions first, then add others
    const prioritizedQuestions = [...shuffledMath, ...shuffledOthers];
    
    // Take the required number of questions
    quizQuestions = prioritizedQuestions.slice(0, numQuestionsToUse);
  }
  
  initializeQuiz(quizQuestions);
}

function initializeQuiz(questions) {
  state.quiz = questions;
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.correctAnswers = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.doublePointsActive = false;
  state.powerUpsUsedThisQuiz = 0;
  state.timeoutsInQuiz = 0;
  
  applySkillBonuses();
  
  state.timePerQuestion = state.initialTimePerQuestion;
  
  state.currentPlayer = {
    id: Date.now(),
    name: 'You',
    avatar: '👤',
    score: state.score,
    correct: 0,
    streak: 0
  };
  state.players = [state.currentPlayer];
  
  document.getElementById('gameScreen').classList.add('active');
  loadQuestion();
}

// ========== QUIZ GAME MODE ==========
document.getElementById('createGameBtn').addEventListener('click', () => {
  document.getElementById('quizGameHome').style.display = 'none';
  document.getElementById('gameLobby').classList.add('active');
  document.getElementById('gamePin').textContent = state.gamePin;
  isHost = true;
  state.players = [];
  state.customQuestions = [];
  hostPlayer = null;
  document.getElementById('playersGrid').innerHTML = '';
  document.getElementById('hostJoinSection').style.display = 'block';
  document.getElementById('playersWaitingSection').style.display = 'none';
  updateQuestionCount();
});

document.getElementById('joinGameBtn').addEventListener('click', () => {
  document.getElementById('joinModal').classList.add('active');
  document.getElementById('playerNameInput').value = '';
  document.getElementById('gamePinInput').value = '';
  document.getElementById('pinError').classList.remove('active');
});

document.getElementById('cancelJoinBtn').addEventListener('click', () => {
  document.getElementById('joinModal').classList.remove('active');
});

document.getElementById('submitPinBtn').addEventListener('click', () => {
  const name = document.getElementById('playerNameInput').value.trim();
  const pin = document.getElementById('gamePinInput').value.trim();
  const errorEl = document.getElementById('pinError');
  
  if (!name) {
    errorEl.textContent = '❌ Please enter your name';
    errorEl.classList.add('active');
    return;
  }
  
  if (pin.length !== 6) {
    errorEl.textContent = '❌ Please enter a 6-digit PIN';
    errorEl.classList.add('active');
    return;
  }
  
  if (pin === state.gamePin) {
    document.getElementById('joinModal').classList.remove('active');
    document.getElementById('quizGameHome').style.display = 'none';
    document.getElementById('gameLobby').classList.add('active');
    isHost = false;
    
    // Add player to lobby
    addPlayer(name);
    
    alert(`✅ Successfully joined game as ${name}! In a real multiplayer game, you would see other players here.`);
  } else {
    errorEl.textContent = '❌ Invalid PIN. Try again!';
    errorEl.classList.add('active');
  }
});

document.getElementById('gamePinInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('submitPinBtn').click();
});

document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('gamePinInput').focus();
});

document.getElementById('backToGameHomeBtn').addEventListener('click', () => {
  document.getElementById('gameLobby').classList.remove('active');
  document.getElementById('quizGameHome').style.display = 'flex';
  state.players = [];
  hostPlayer = null;
  isHost = false;
  document.getElementById('playersGrid').innerHTML = '';
  document.getElementById('playerCount').textContent = '0';
  document.getElementById('hostJoinSection').style.display = 'block';
  document.getElementById('playersWaitingSection').style.display = 'none';
});

document.getElementById('hostJoinBtn').addEventListener('click', () => {
  const name = document.getElementById('hostNameInput').value.trim();
  if (!name) {
    alert('Please enter your name!');
    return;
  }
  
  hostPlayer = {
    id: Date.now(),
    name: name,
    avatar: getPlayerAvatar(name),
    score: 0,
    correct: 0,
    streak: 0,
    isHost: true
  };
  
  state.currentPlayer = hostPlayer;
  state.players = [hostPlayer];
  
  document.getElementById('hostJoinSection').style.display = 'none';
  document.getElementById('playersWaitingSection').style.display = 'block';
  document.getElementById('hostNameDisplay').textContent = name;
  document.getElementById('playerCount').textContent = '0';
  document.getElementById('hostNameInput').value = '';
});

document.getElementById('hostNameInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('hostJoinBtn').click();
});

function addPlayer(playerName) {
  if (!hostPlayer) return;
  
  const player = {
    id: Date.now() + Math.random(),
    name: playerName,
    avatar: getPlayerAvatar(playerName),
    score: 0,
    correct: 0,
    streak: 0,
    isHost: false
  };
  
  state.players.push(player);
  
  const card = document.createElement('div');
  card.className = 'player-card';
  card.dataset.playerId = player.id;
  card.innerHTML = `
    <div class="player-avatar">${player.avatar}</div>
    <div class="player-name">${player.name}</div>
    <button class="btn-kick" onclick="kickPlayer(${player.id})">❌</button>
  `;
  document.getElementById('playersGrid').appendChild(card);
  
  const nonHostPlayers = state.players.filter(p => !p.isHost);
  document.getElementById('playerCount').textContent = nonHostPlayers.length;
  
  if (nonHostPlayers.length > 0) {
    document.getElementById('startGameBtn').classList.add('active');
  }
}

function kickPlayer(playerId) {
  state.players = state.players.filter(p => p.id !== playerId);
  
  const card = document.querySelector(`[data-player-id="${playerId}"]`);
  if (card) card.remove();
  
  const nonHostPlayers = state.players.filter(p => !p.isHost);
  document.getElementById('playerCount').textContent = nonHostPlayers.length;
  
  if (nonHostPlayers.length === 0) {
    document.getElementById('startGameBtn').classList.remove('active');
  }
}

window.kickPlayer = kickPlayer;

window.simulatePlayerJoin = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
  const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
  addPlayer(randomName);
};

document.getElementById('startGameBtn').addEventListener('click', () => {
  if (state.customQuestions.length < 5) {
    alert('Please create at least 5 questions to start the game!');
    return;
  }
  
  if (state.players.length < 1) {
    alert('Need at least the host to start!');
    return;
  }
  
  // Use custom questions created by host
  state.quiz = shuffleArray(state.customQuestions);
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.correctAnswers = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.doublePointsActive = false;
  state.powerUpsUsedThisQuiz = 0;
  state.timeoutsInQuiz = 0;
  
  applySkillBonuses();
  
  state.timePerQuestion = 20;
  
  document.getElementById('gameScreen').classList.add('active');
  loadQuestion();
});

// ========== LEADERBOARD ==========
function renderLeaderboard(filter = 'all', category = 'all') {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;
  
  let filteredData = state.globalLeaderboard;
  
  // Time filter
  if (filter === 'today') {
    filteredData = state.globalLeaderboard.filter(p => (now - p.timestamp) < oneDay);
  } else if (filter === 'week') {
    filteredData = state.globalLeaderboard.filter(p => (now - p.timestamp) < oneWeek);
  } else if (filter === 'month') {
    filteredData = state.globalLeaderboard.filter(p => (now - p.timestamp) < oneMonth);
  }
  
  // Category filter
  if (filter === 'category' && category !== 'all') {
    filteredData = filteredData.filter(p => p.category === category);
  }
  
  // Show/hide empty state
  const emptyState = document.getElementById('leaderboardEmpty');
  const podiumSection = document.getElementById('podiumSection');
  const listContainer = document.getElementById('leaderboardList');
  
  if (filteredData.length === 0) {
    emptyState.style.display = 'block';
    podiumSection.style.display = 'none';
    listContainer.style.display = 'none';
    
    // Update empty message based on filter
    const emptyMessage = document.getElementById('emptyMessage');
    if (filter === 'today') {
      emptyMessage.textContent = 'No players today yet. Be the first to play and set a record!';
    } else if (filter === 'week') {
      emptyMessage.textContent = 'No players this week. Start playing to claim the top spot!';
    } else if (filter === 'month') {
      emptyMessage.textContent = 'No players this month. Your chance to dominate!';
    } else if (filter === 'category') {
      emptyMessage.textContent = `No scores in this category yet. Be the first expert!`;
    } else {
      emptyMessage.textContent = 'Be the first to play and claim the top spot!';
    }
    return;
  }
  
  emptyState.style.display = 'none';
  podiumSection.style.display = 'flex';
  listContainer.style.display = 'flex';
  
  // Render podium
  if (filteredData.length >= 1) {
    document.getElementById('first-avatar').textContent = filteredData[0].avatar;
    document.getElementById('first-name').textContent = filteredData[0].name;
    document.getElementById('first-score').textContent = filteredData[0].score.toLocaleString();
  } else {
    document.getElementById('first-avatar').textContent = '👤';
    document.getElementById('first-name').textContent = 'No Player';
    document.getElementById('first-score').textContent = '0';
  }
  
  if (filteredData.length >= 2) {
    document.getElementById('second-avatar').textContent = filteredData[1].avatar;
    document.getElementById('second-name').textContent = filteredData[1].name;
    document.getElementById('second-score').textContent = filteredData[1].score.toLocaleString();
  } else {
    document.getElementById('second-avatar').textContent = '👤';
    document.getElementById('second-name').textContent = 'No Player';
    document.getElementById('second-score').textContent = '0';
  }
  
  if (filteredData.length >= 3) {
    document.getElementById('third-avatar').textContent = filteredData[2].avatar;
    document.getElementById('third-name').textContent = filteredData[2].name;
    document.getElementById('third-score').textContent = filteredData[2].score.toLocaleString();
  } else {
    document.getElementById('third-avatar').textContent = '👤';
    document.getElementById('third-name').textContent = 'No Player';
    document.getElementById('third-score').textContent = '0';
  }
  
  // Render list
  listContainer.innerHTML = '';
  
  const remaining = filteredData.slice(3);
  remaining.forEach((player, index) => {
    const rank = index + 4;
    const div = document.createElement('div');
    div.className = 'leaderboard-item';
    div.onclick = () => showPlayerProfile(player, rank);
    div.innerHTML = `
      <div class="leaderboard-rank">${rank}</div>
      <div class="leaderboard-avatar">${player.avatar}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${player.name}</div>
        <div class="leaderboard-stats">
          ${player.correct} correct • ${player.accuracy}% accuracy • ${player.gamesPlayed || 1} games
        </div>
        <div class="leaderboard-category">🏓 ${player.category || 'General'}</div>
      </div>
      <div class="leaderboard-score-container">
        <div class="leaderboard-score">${player.score.toLocaleString()}</div>
        <div class="view-profile-hint">Click for details</div>
      </div>
    `;
    listContainer.appendChild(div);
  });
  
  if (filteredData.length === 0) {
    listContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light); font-size: 18px;">No players yet. Be the first to play!</p>';
  }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    
    // Show/hide category selector
    const categorySelector = document.getElementById('categorySelector');
    if (filter === 'category') {
      categorySelector.style.display = 'block';
      renderLeaderboard(filter, 'all');
    } else {
      categorySelector.style.display = 'none';
      renderLeaderboard(filter);
    }
  });
});

// Category pills
document.querySelectorAll('.category-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const category = pill.dataset.category;
    renderLeaderboard('category', category);
  });
});

// Start playing button
document.getElementById('startPlayingBtn').addEventListener('click', () => {
  document.getElementById('navLearn').click();
});

// Player profile modal
function showPlayerProfile(player, rank) {
  const modal = document.getElementById('playerProfileModal');
  modal.classList.add('active');
  
  // Generate fake but realistic stats
  const gamesPlayed = player.gamesPlayed || Math.floor(Math.random() * 50) + 10;
  const totalScore = player.score * gamesPlayed;
  const avgAccuracy = player.accuracy;
  const bestStreak = player.streak + Math.floor(Math.random() * 10);
  
  document.getElementById('profileAvatar').textContent = player.avatar;
  document.getElementById('profileName').textContent = player.name;
  document.getElementById('profileRankBadge').textContent = `#${rank} Global Rank`;
  document.getElementById('profileTotalScore').textContent = totalScore.toLocaleString();
  document.getElementById('profileGamesPlayed').textContent = gamesPlayed;
  document.getElementById('profileAccuracy').textContent = avgAccuracy + '%';
  document.getElementById('profileBestStreak').textContent = bestStreak;
  
  // Category performance (fake data)
  const categories = ['Geography', 'Science', 'Technology', 'History', 'Math', 'Art'];
  const categoryPerformance = document.getElementById('categoryPerformance');
  categoryPerformance.innerHTML = '';
  
  categories.forEach(cat => {
    const accuracy = Math.floor(Math.random() * 30) + 70;
    const games = Math.floor(Math.random() * 15) + 3;
    const card = document.createElement('div');
    card.className = 'category-perf-item';
    card.innerHTML = `
      <div class="category-perf-name">${cat}</div>
      <div class="category-perf-bar-container">
        <div class="category-perf-bar" style="width: ${accuracy}%"></div>
      </div>
      <div class="category-perf-stats">${accuracy}% • ${games} games</div>
    `;
    categoryPerformance.appendChild(card);
  });
  
  // Recent achievements (fake data)
  const recentAchievements = document.getElementById('recentAchievements');
  recentAchievements.innerHTML = '';
  
  const playerAchievements = ACHIEVEMENTS.filter(a => a.unlocked).slice(0, 3);
  if (playerAchievements.length === 0) {
    // Show some random achievements
    const randomAchievements = ACHIEVEMENTS.slice(0, 3);
    randomAchievements.forEach(achievement => {
      const badge = document.createElement('div');
      badge.className = 'recent-achievement-badge';
      badge.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-reward">+${achievement.reward} SP</div>
        </div>
      `;
      recentAchievements.appendChild(badge);
    });
  } else {
    playerAchievements.forEach(achievement => {
      const badge = document.createElement('div');
      badge.className = 'recent-achievement-badge';
      badge.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-reward">+${achievement.reward} SP</div>
        </div>
      `;
      recentAchievements.appendChild(badge);
    });
  }
}

document.getElementById('closeProfileBtn').addEventListener('click', () => {
  document.getElementById('playerProfileModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('playerProfileModal').addEventListener('click', (e) => {
  if (e.target.id === 'playerProfileModal') {
    document.getElementById('playerProfileModal').classList.remove('active');
  }
});

// ========== GAME LOGIC ==========
function loadQuestion() {
  if (state.currentQuestionIndex >= state.quiz.length) {
    endGame();
    return;
  }
  
  state.fiftyFiftyUsedThisQuestion = false;
  
  const question = state.quiz[state.currentQuestionIndex];
  
  document.getElementById('currentQ').textContent = state.currentQuestionIndex + 1;
  document.getElementById('totalQ').textContent = state.quiz.length;
  document.getElementById('questionBadge').textContent = question.category || 'General';
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('gameScore').textContent = state.score;
  
  renderAnswers(question);
  startTimer();
  updatePowerUps();
}

function renderAnswers(question) {
  const container = document.getElementById('answersContainer');
  container.innerHTML = '';
  
  container.classList.remove('truefalse-layout', 'enumeration-layout');
  
  if (question.type === 'truefalse') {
    container.classList.add('truefalse-layout');
  } else if (question.type === 'enumeration') {
    container.classList.add('enumeration-layout');
  }
  
  let answerData = question.answers.map((answer, index) => ({
    text: answer,
    originalIndex: index
  }));
  
  answerData = shuffleArray(answerData);
  
  answerData.forEach((answerObj, displayIndex) => {
    const option = document.createElement('div');
    option.className = `answer-option option-${displayIndex}`;
    option.textContent = answerObj.text;
    option.dataset.originalIndex = answerObj.originalIndex;
    option.addEventListener('click', () => selectAnswer(answerObj.originalIndex));
    container.appendChild(option);
  });
}

function selectAnswer(originalIndex) {
  if (state.timerInterval === null) return;
  
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  
  const question = state.quiz[state.currentQuestionIndex];
  const options = document.querySelectorAll('.answer-option');
  const isCorrect = originalIndex === question.correct;
  
  options.forEach((opt) => {
    opt.classList.add('disabled');
    const optOriginalIndex = parseInt(opt.dataset.originalIndex);
    if (optOriginalIndex === question.correct) {
      opt.classList.add('correct');
    }
  });
  
  if (!isCorrect) {
    options.forEach((opt) => {
      if (parseInt(opt.dataset.originalIndex) === originalIndex) {
        opt.classList.add('wrong');
      }
    });
  }
  
  handleAnswer(isCorrect);
}

function handleAnswer(isCorrect) {
  const timeLeft = parseInt(document.getElementById('timerText').textContent);
  const timeBonus = Math.floor((timeLeft / state.timePerQuestion) * 500);
  
  if (isCorrect) {
    let points = 1000 + timeBonus;
    
    if (state.doublePointsActive) {
      points *= 2;
      state.doublePointsActive = false;
    }
    
    state.score += points;
    state.correctAnswers++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    
    setTimeout(() => showFeedback(true, points), 1500);
  } else {
    state.streak = 0;
    state.doublePointsActive = false;
    setTimeout(() => showFeedback(false, 0), 1500);
  }
}

function startTimer() {
  let timeLeft = state.timePerQuestion;
  document.getElementById('timerText').textContent = timeLeft;
  
  const circle = document.getElementById('timerCircle');
  const circumference = 2 * Math.PI * 26;
  circle.style.strokeDashoffset = '0';
  
  state.timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timerText').textContent = timeLeft;
    
    const progress = (timeLeft / state.timePerQuestion) * circumference;
    circle.style.strokeDashoffset = circumference - progress;
    
    if (timeLeft <= 0) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  state.timeoutsInQuiz++;
  
  const question = state.quiz[state.currentQuestionIndex];
  const options = document.querySelectorAll('.answer-option');
  
  options.forEach((opt) => {
    opt.classList.add('disabled');
    const optOriginalIndex = parseInt(opt.dataset.originalIndex);
    if (optOriginalIndex === question.correct) {
      opt.classList.add('correct');
    }
  });
  
  state.streak = 0;
  state.doublePointsActive = false;
  setTimeout(() => showFeedback(false, 0), 1500);
}

// ========== FEEDBACK ==========
function showFeedback(isCorrect, points) {
  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('feedbackScreen').classList.add('active');
  
  const resultIcon = document.getElementById('resultIcon');
  const resultText = document.getElementById('resultText');
  const resultPoints = document.getElementById('resultPoints');
  const streakDisplay = document.getElementById('streakDisplay');
  
  if (isCorrect) {
    resultIcon.textContent = '✓';
    resultIcon.classList.remove('wrong');
    resultText.textContent = 'Correct!';
    
    if (points > 0) {
      resultPoints.textContent = `+${points} points`;
      resultPoints.style.display = 'block';
    } else {
      resultPoints.style.display = 'none';
    }
    
    if (state.streak >= 2) {
      streakDisplay.classList.remove('hidden');
      streakDisplay.querySelector('.streak-text').textContent = `${state.streak} Streak!`;
    } else {
      streakDisplay.classList.add('hidden');
    }
  } else {
    resultIcon.textContent = '✖';
    resultIcon.classList.add('wrong');
    resultText.textContent = 'Wrong!';
    resultPoints.style.display = 'none';
    streakDisplay.classList.add('hidden');
  }
  
  const question = state.quiz[state.currentQuestionIndex];
  document.getElementById('correctAnswer').textContent = question.answers[question.correct];
  
  updateCurrentPlayer();
  renderMiniLeaderboard();
}

document.getElementById('nextQuestionBtn').addEventListener('click', () => {
  document.getElementById('feedbackScreen').classList.remove('active');
  state.currentQuestionIndex++;
  
  if (state.currentQuestionIndex < state.quiz.length) {
    document.getElementById('gameScreen').classList.add('active');
    loadQuestion();
  } else {
    endGame();
  }
});

function updateCurrentPlayer() {
  if (state.currentPlayer) {
    state.currentPlayer.score = state.score;
    state.currentPlayer.correct = state.correctAnswers;
    state.currentPlayer.streak = state.bestStreak;
  }
}

function renderMiniLeaderboard() {
  const container = document.getElementById('miniLeaderboard');
  container.innerHTML = '';
  
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  
  top3.forEach((player, index) => {
    const div = document.createElement('div');
    div.className = `mini-player rank-${index + 1}`;
    div.innerHTML = `
      <div class="mini-rank">${index + 1}</div>
      <div class="mini-name">${player.name}</div>
      <div class="mini-score">${player.score}</div>
    `;
    container.appendChild(div);
  });
}

// ========== POWER-UPS ==========
function updatePowerUps() {
  document.getElementById('fifty-count').textContent = state.powerUps.fifty;
  document.getElementById('freeze-count').textContent = state.powerUps.freeze;
  document.getElementById('skip-count').textContent = state.powerUps.skip;
  document.getElementById('double-count').textContent = state.powerUps.double;
  
  document.querySelectorAll('.power-up').forEach(btn => {
    const power = btn.dataset.power;
    if (state.powerUps[power] <= 0) {
      btn.classList.add('used');
    } else {
      btn.classList.remove('used');
    }
  });
}

document.querySelectorAll('.power-up').forEach(btn => {
  btn.addEventListener('click', () => {
    const power = btn.dataset.power;
    if (state.powerUps[power] > 0 && state.timerInterval !== null) {
      usePowerUp(power);
    }
  });
});

function usePowerUp(power) {
  if (power === 'fifty' && state.fiftyFiftyUsedThisQuestion) {
    return;
  }
  
  state.powerUps[power]--;
  state.powerUpsUsedThisQuiz++;
  updatePowerUps();
  showPowerupNotification(power);
  
  if (power === 'fifty') {
    state.fiftyFiftyUsedThisQuestion = true;
    const question = state.quiz[state.currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    const wrongOptions = [];
    
    options.forEach((opt) => {
      const optOriginalIndex = parseInt(opt.dataset.originalIndex);
      if (optOriginalIndex !== question.correct) {
        wrongOptions.push(opt);
      }
    });
    
    const shuffledWrong = shuffleArray(wrongOptions);
    const toRemove = shuffledWrong.slice(0, 2);
    
    toRemove.forEach(option => {
      option.style.opacity = '0.3';
      option.style.pointerEvents = 'none';
    });
  } else if (power === 'freeze') {
    let currentTime = parseInt(document.getElementById('timerText').textContent);
    const newTime = Math.min(currentTime + 10, state.timePerQuestion * 2);
    
    clearInterval(state.timerInterval);
    
    let timeLeft = newTime;
    document.getElementById('timerText').textContent = timeLeft;
    
    const circle = document.getElementById('timerCircle');
    const circumference = 2 * Math.PI * 26;
    
    state.timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timerText').textContent = timeLeft;
      
      const progress = (timeLeft / state.timePerQuestion) * circumference;
      circle.style.strokeDashoffset = circumference - progress;
      
      if (timeLeft <= 0) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        handleTimeout();
      }
    }, 1000);
  } else if (power === 'skip') {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    
    state.currentQuestionIndex++;
    
    if (state.currentQuestionIndex < state.quiz.length) {
      setTimeout(() => {
        loadQuestion();
      }, 1000);
    } else {
      setTimeout(() => endGame(), 1000);
    }
  } else if (power === 'double') {
    state.doublePointsActive = true;
  }
}

// ========== EXIT GAME ==========
document.getElementById('exitGameBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to exit the game? Your progress will be lost.')) {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('feedbackScreen').classList.remove('active');
    
    state.players = [];
    state.currentPlayer = null;
    state.quiz = [];
    
    document.getElementById('navLearn').click();
  }
});

// ========== RESULTS ==========
function endGame() {
  // Update streak and today's stats
  updateStreak();
  const quizTime = Math.ceil((state.quiz.length * state.initialTimePerQuestion) / 60); // Convert to minutes
  updateTodayStats(quizTime, state.correctAnswers, state.quiz.length);

  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('feedbackScreen').classList.remove('active');
  document.getElementById('resultsScreen').classList.add('active');
  
  updateCurrentPlayer();
  
  const newAchievements = checkAchievements();
  const earnedSP = calculateSkillPointsEarned();
  state.skillPoints += earnedSP;
  
  localStorage.setItem('inspersona_skillPoints', state.skillPoints);
  
  document.getElementById('earnedSP').textContent = earnedSP;
  
  showUnlockedAchievements();
  
  state.players.forEach(player => {
    saveToLeaderboard(player);
  });
  
  document.getElementById('finalScore').textContent = state.score;
  document.getElementById('correctCount').textContent = `${state.correctAnswers}/${state.quiz.length}`;
  document.getElementById('accuracyPercent').textContent = Math.round((state.correctAnswers / state.quiz.length) * 100) + '%';
  document.getElementById('bestStreak').textContent = state.bestStreak;
  
  renderFinalLeaderboard();
}

function renderFinalLeaderboard() {
  const container = document.getElementById('finalLeaderboard');
  container.innerHTML = '';
  
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  
  sorted.forEach((player, index) => {
    const div = document.createElement('div');
    div.className = `final-player rank-${index + 1}`;
    div.innerHTML = `
      <div class="final-rank">${index + 1}</div>
      <div class="final-avatar">${player.avatar}</div>
      <div class="final-info">
        <div class="final-name">${player.name}</div>
        <div class="final-stats">${player.correct}/${state.quiz.length} correct • ${player.streak} best streak</div>
      </div>
      <div class="final-score">${player.score}</div>
    `;
    container.appendChild(div);
  });
}

document.getElementById('playAgainBtn').addEventListener('click', () => {
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.correctAnswers = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.doublePointsActive = false;
  state.powerUpsUsedThisQuiz = 0;
  state.timeoutsInQuiz = 0;
  
  state.players.forEach(player => {
    player.score = 0;
    player.correct = 0;
    player.streak = 0;
  });
  
  applySkillBonuses();
  
  const filteredQuestions = QUESTIONS.filter(q => state.questionTypes.includes(q.type));
  const questionsToUse = filteredQuestions.length > 0 ? filteredQuestions : QUESTIONS;
  const numQuestionsToUse = Math.min(state.numQuestions, questionsToUse.length);
  
  state.quiz = shuffleArray(questionsToUse).slice(0, numQuestionsToUse);
  
  document.getElementById('resultsScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  loadQuestion();
});

document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
  document.getElementById('resultsScreen').classList.remove('active');
  document.getElementById('navLeaderboard').click();
});

document.getElementById('backToHomeBtn').addEventListener('click', () => {
  document.getElementById('resultsScreen').classList.remove('active');
  
  state.players = [];
  state.currentPlayer = null;
  state.quiz = [];
  state.uploadedFile = null;
  
  fileInput.value = '';
  uploadArea.classList.remove('has-file');
  document.getElementById('uploadIcon').textContent = '📄';
  fileInfo.classList.remove('active');
  learningFormatsCard.classList.remove('active');
  quizConfigCard.classList.remove('active');
  
  document.getElementById('gameLobby').classList.remove('active');
  document.getElementById('quizGameHome').style.display = 'flex';
  document.getElementById('playersGrid').innerHTML = '';
  document.getElementById('playerCount').textContent = '0';
  document.getElementById('hostJoinSection').style.display = 'block';
  document.getElementById('playersWaitingSection').style.display = 'none';
  
  document.getElementById('navHome').click();
});

// ========== QUESTION CREATION ==========
function updateQuestionCount() {
  document.getElementById('questionCountDisplay').textContent = state.customQuestions.length;
  const startBtn = document.getElementById('startGameBtn');
  
  if (state.customQuestions.length >= 5) {
    startBtn.style.opacity = '1';
    startBtn.style.cursor = 'pointer';
    startBtn.textContent = `Start Game (${state.customQuestions.length} questions)`;
  } else {
    startBtn.style.opacity = '0.5';
    startBtn.style.cursor = 'not-allowed';
    startBtn.textContent = `Start Game (Need ${5 - state.customQuestions.length} more questions)`;
  }
}

function updateAnswerInputs() {
  const questionType = document.getElementById('questionTypeSelect').value;
  const answersInputs = document.getElementById('answersInputs');
  const correctBtns = document.getElementById('correctAnswerBtns');
  
  answersInputs.innerHTML = '';
  correctBtns.innerHTML = '';
  
  if (questionType === 'truefalse') {
    // True/False: 2 answers
    for (let i = 0; i < 2; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'config-input answer-input';
      input.placeholder = i === 0 ? 'True' : 'False';
      input.value = i === 0 ? 'True' : 'False';
      input.dataset.index = i;
      answersInputs.appendChild(input);
      
      const btn = document.createElement('button');
      btn.className = 'correct-btn';
      btn.dataset.index = i;
      btn.textContent = i + 1;
      btn.addEventListener('click', selectCorrectAnswer);
      correctBtns.appendChild(btn);
    }
  } else {
    // Multiple Choice & Enumeration: 4 answers
    for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'config-input answer-input';
      input.placeholder = `Answer ${i + 1}`;
      input.dataset.index = i;
      answersInputs.appendChild(input);
      
      const btn = document.createElement('button');
      btn.className = 'correct-btn';
      btn.dataset.index = i;
      btn.textContent = i + 1;
      btn.addEventListener('click', selectCorrectAnswer);
      correctBtns.appendChild(btn);
    }
  }
  
  state.selectedCorrectAnswer = null;
}

function selectCorrectAnswer(e) {
  const index = parseInt(e.target.dataset.index);
  state.selectedCorrectAnswer = index;
  
  document.querySelectorAll('.correct-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  e.target.classList.add('selected');
}

function addQuestion() {
  const questionType = document.getElementById('questionTypeSelect').value;
  const questionText = document.getElementById('questionInput').value.trim();
  const answerInputs = document.querySelectorAll('.answer-input');
  
  if (!questionText) {
    alert('Please enter a question!');
    return;
  }
  
  const answers = Array.from(answerInputs).map(input => input.value.trim());
  
  if (answers.some(a => !a)) {
    alert('Please fill in all answer fields!');
    return;
  }
  
  if (state.selectedCorrectAnswer === null) {
    alert('Please select the correct answer!');
    return;
  }
  
  const question = {
    type: questionType,
    question: questionText,
    answers: answers,
    correct: state.selectedCorrectAnswer,
    category: 'Custom'
  };
  
  state.customQuestions.push(question);
  
  // Clear form
  document.getElementById('questionInput').value = '';
  answerInputs.forEach(input => {
    if (input.placeholder !== 'True' && input.placeholder !== 'False') {
      input.value = '';
    }
  });
  document.querySelectorAll('.correct-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  state.selectedCorrectAnswer = null;
  
  // Add to list
  renderCreatedQuestions();
  updateQuestionCount();
}

function renderCreatedQuestions() {
  const container = document.getElementById('createdQuestionsList');
  container.innerHTML = '';
  
  if (state.customQuestions.length === 0) {
    container.innerHTML = '<p class="no-questions">No questions created yet. Add your first question above!</p>';
    return;
  }
  
  state.customQuestions.forEach((question, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const typeLabel = {
      multiple: 'Multiple Choice',
      truefalse: 'True/False',
      enumeration: 'Enumeration'
    }[question.type];
    
    card.innerHTML = `
      <div class="question-card-header">
        <span class="question-type-badge">${typeLabel}</span>
        <button class="btn-delete-question" onclick="deleteQuestion(${index})">ðŸ—‘ï¸</button>
      </div>
      <div class="question-card-text">${question.question}</div>
      <div class="question-card-answers">
        ${question.answers.map((answer, i) => `
          <div class="question-answer ${i === question.correct ? 'correct-answer' : ''}">
            ${i === question.correct ? '✓ ' : ''}${answer}
          </div>
        `).join('')}
      </div>
    `;
    
    container.appendChild(card);
  });
}

function deleteQuestion(index) {
  if (confirm('Are you sure you want to delete this question?')) {
    state.customQuestions.splice(index, 1);
    renderCreatedQuestions();
    updateQuestionCount();
  }
}

window.deleteQuestion = deleteQuestion;

// Event Listeners for Question Creation
document.getElementById('questionTypeSelect').addEventListener('change', updateAnswerInputs);
document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);

// Initialize answer inputs
updateAnswerInputs();

// ========== INIT ==========
function init() {
  console.log('Inspersona initialized!');
  console.log('Game PIN:', state.gamePin);
  console.log('To test multiplayer lobby, type: simulatePlayerJoin() in the console');
  
  loadSavedData();
  initializeAchievements();
  loadLeaderboardData();
  
  renderLeaderboard();
  
  const streakDisplay = document.getElementById('streakDisplay');
  if (streakDisplay) {
    streakDisplay.classList.add('hidden');
  }
  
  loadSkillTree();
  
  hideLoadingScreen();
  
  console.log('✨ Welcome to Inspersona! Your AI-powered learning platform.');
  console.log('💡 Current Skill Points:', state.skillPoints);
  console.log('🏆 Achievements Unlocked:', state.unlockedAchievements.length + '/' + ACHIEVEMENTS.length);
}

// ========== DASHBOARD ==========
function loadDashboardData() {
  // Show dashboard info on first visit
  const dashboardVisited = localStorage.getItem('inspersona_dashboard_visited');
  if (!dashboardVisited) {
    setTimeout(() => {
      alert('📈 Dashboard Demo\n\nWelcome to your Learning Dashboard! This section displays your learning analytics and progress.\n\n✨ What you see:\n• Real stats from your quiz completions\n• Learning streak tracking\n• Performance trends\n• Weak areas analysis (simulated)\n• File progress (demo data)\n\n🚀 In the full implementation:\n• Advanced AI analytics\n• Personalized learning recommendations\n• Detailed progress tracking per topic\n• Real-time file analysis\n• Custom study plans');
      localStorage.setItem('inspersona_dashboard_visited', 'true');
    }, 500);
  }
  
  // Load stats from localStorage
  const stats = getAchievementStats();
  const leaderboard = state.globalLeaderboard;
  
  // Calculate total quizzes
  const totalQuizzes = stats.quizzesCompleted || 0;
  document.getElementById('totalQuizzesTaken').textContent = totalQuizzes;
  
  // Calculate average accuracy
  let avgAccuracy = 0;
  if (leaderboard.length > 0) {
    const userGames = leaderboard.filter(g => g.name === state.currentPlayer?.name || g.name === 'You');
    if (userGames.length > 0) {
      avgAccuracy = Math.round(userGames.reduce((sum, g) => sum + g.accuracy, 0) / userGames.length);
    }
  }
  document.getElementById('averageScore').textContent = avgAccuracy + '%';
  
  // Calculate study time (approximate based on quizzes)
  const avgTimePerQuiz = 5; // minutes
  const totalMinutes = totalQuizzes * avgTimePerQuiz;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  document.getElementById('totalStudyTime').textContent = `${hours}h ${minutes}m`;
  
  // Achievements unlocked
  const achievementsCount = state.unlockedAchievements.length;
  document.getElementById('achievementsUnlocked').textContent = `${achievementsCount}/${ACHIEVEMENTS.length}`;
  
  // Load streak
  loadStreak();
  
  // Load today's stats
  loadTodayStats();
  
  // Generate streak calendar
  generateStreakCalendar();
}

function loadStreak() {
  const streakData = JSON.parse(localStorage.getItem('inspersona_streak') || '{"current": 0, "lastDate": null, "dates": []}');
  const today = new Date().toDateString();
  
  // Check if user studied today
  if (streakData.lastDate === today) {
    document.getElementById('currentStreak').textContent = streakData.current;
    document.getElementById('streakMessage').textContent = `Amazing! Keep it up! 🔥`;
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (streakData.lastDate === yesterday) {
      document.getElementById('currentStreak').textContent = streakData.current;
      document.getElementById('streakMessage').textContent = `You're on a roll! Complete a quiz today to keep your streak! 💪`;
    } else {
      document.getElementById('currentStreak').textContent = streakData.current || 0;
      document.getElementById('streakMessage').textContent = `Start your learning journey today! 🚀`;
    }
  }
}

function updateStreak() {
  const streakData = JSON.parse(localStorage.getItem('inspersona_streak') || '{"current": 0, "lastDate": null, "dates": []}');
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (streakData.lastDate === today) {
    // Already studied today, no change
    return;
  } else if (streakData.lastDate === yesterday || !streakData.lastDate) {
    // Continuing streak or starting new
    streakData.current = (streakData.current || 0) + 1;
    streakData.lastDate = today;
    if (!streakData.dates) streakData.dates = [];
    streakData.dates.push(today);
  } else {
    // Streak broken, restart
    streakData.current = 1;
    streakData.lastDate = today;
    streakData.dates = [today];
  }
  
  localStorage.setItem('inspersona_streak', JSON.stringify(streakData));
}

function loadTodayStats() {
  const today = new Date().toDateString();
  const todayStats = JSON.parse(localStorage.getItem('inspersona_today_stats') || '{}');
  
  if (todayStats.date !== today) {
    // Reset for new day
    todayStats.date = today;
    todayStats.quizzes = 0;
    todayStats.time = 0;
    todayStats.correct = 0;
    todayStats.total = 0;
    localStorage.setItem('inspersona_today_stats', JSON.stringify(todayStats));
  }
  
  document.getElementById('todayQuizzes').textContent = todayStats.quizzes || 0;
  document.getElementById('todayTime').textContent = `${todayStats.time || 0}m`;
  
  const accuracy = todayStats.total > 0 ? Math.round((todayStats.correct / todayStats.total) * 100) : 0;
  document.getElementById('todayAccuracy').textContent = accuracy + '%';
}

function updateTodayStats(quizTime, correct, total) {
  const today = new Date().toDateString();
  const todayStats = JSON.parse(localStorage.getItem('inspersona_today_stats') || '{}');
  
  if (todayStats.date !== today) {
    todayStats.date = today;
    todayStats.quizzes = 0;
    todayStats.time = 0;
    todayStats.correct = 0;
    todayStats.total = 0;
  }
  
  todayStats.quizzes = (todayStats.quizzes || 0) + 1;
  todayStats.time = (todayStats.time || 0) + quizTime;
  todayStats.correct = (todayStats.correct || 0) + correct;
  todayStats.total = (todayStats.total || 0) + total;
  
  localStorage.setItem('inspersona_today_stats', JSON.stringify(todayStats));
}

function generateStreakCalendar() {
  const calendar = document.getElementById('streakCalendar');
  if (!calendar) return;
  
  calendar.innerHTML = '';
  
  const streakData = JSON.parse(localStorage.getItem('inspersona_streak') || '{"dates": []}');
  const dates = streakData.dates || [];
  
  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - (i * 86400000));
    const dateStr = date.toDateString();
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    
    const dayEl = document.createElement('div');
    dayEl.className = 'streak-day';
    if (dates.includes(dateStr)) {
      dayEl.classList.add('active');
    }
    if (i === 0) {
      dayEl.classList.add('today');
    }
    
    dayEl.innerHTML = `
      <div class="streak-day-name">${dayName}</div>
      <div class="streak-day-indicator">${dates.includes(dateStr) ? '🔥' : '⭕'}</div>
    `;
    
    calendar.appendChild(dayEl);
  }
}

// Add click info handlers for dashboard sections
document.addEventListener('DOMContentLoaded', () => {
  // Weak Areas Info
  const weakAreasCard = document.querySelector('.weak-areas-card');
  if (weakAreasCard) {
    const cardHeader = weakAreasCard.querySelector('.card-header-dash h2');
    if (cardHeader) {
      cardHeader.style.cursor = 'pointer';
      cardHeader.title = 'Click for more info';
      cardHeader.addEventListener('click', () => {
        alert('📉 Weak Areas Analysis\n\nThis section identifies topics where you need improvement based on your quiz performance.\n\n🎯 Current Display:\n• Simulated weak areas with sample data\n• Shows accuracy percentage per topic\n• Quick practice button for focused learning\n\n🚀 Full Implementation:\n• Real-time AI analysis of your answers\n• Personalized difficulty assessment\n• Adaptive question generation\n• Progress tracking per concept\n• Smart review scheduling\n• Spaced repetition algorithms');
      });
    }
  }

  // File Progress Info
  const filesCard = document.querySelector('.files-progress-card');
  if (filesCard) {
    const cardHeader = filesCard.querySelector('.card-header-dash h2');
    if (cardHeader) {
      cardHeader.style.cursor = 'pointer';
      cardHeader.title = 'Click for more info';
      cardHeader.addEventListener('click', () => {
        alert('📁 File Learning Progress\n\nTrack your mastery of uploaded learning materials with AI-powered insights.\n\n✨ Current Display:\n• Demo files with simulated progress\n• Sample mastery percentages\n• Concept tags and categories\n• Progress visualization\n\n🚀 Full Implementation:\n• Real file upload and processing\n• AI content analysis and extraction\n• Automatic concept identification\n• Personalized learning paths\n• Knowledge graph generation\n• Intelligent review recommendations\n• Cross-file concept linking\n• Mastery assessment per topic');
      });
    }
  }

  // Recent Activities Info
  const activitiesCard = document.querySelectorAll('.dashboard-card')[1]; // Activities is typically second card in right column
  if (activitiesCard && activitiesCard.querySelector('.activities-list')) {
    const cardHeader = activitiesCard.querySelector('.card-header-dash h2');
    if (cardHeader) {
      cardHeader.style.cursor = 'pointer';
      cardHeader.title = 'Click for more info';
      cardHeader.addEventListener('click', () => {
        alert('📋 Recent Activities\n\nYour learning journey timeline and activity feed.\n\n✨ Current Display:\n• Sample activities with demo data\n• Mix of quizzes, uploads, and achievements\n• Time-based activity log\n\n🚀 Full Implementation:\n• Real-time activity tracking\n• Detailed session information\n• Study pattern analysis\n• Social learning features\n• Collaboration tracking\n• Study group activities\n• Mentor/peer interactions\n• Learning milestone celebrations');
      });
    }
  }

  // Performance Chart Info
  const performanceCards = document.querySelectorAll('.dashboard-card');
  performanceCards.forEach(card => {
    const header = card.querySelector('.card-header-dash h2');
    if (header && header.textContent.includes('Performance Trend')) {
      header.style.cursor = 'pointer';
      header.title = 'Click for more info';
      header.addEventListener('click', () => {
        alert('📊 Performance Trend\n\nVisualize your learning progress over time.\n\n✨ Current Display:\n• Sample 7-day performance data\n• Accuracy percentage trends\n• Visual bar chart representation\n\n🚀 Full Implementation:\n• Real performance data from your quizzes\n• Multiple time ranges (daily, weekly, monthly)\n• Topic-specific trend analysis\n• Comparative analytics\n• Predictive performance insights\n• Study efficiency metrics\n• Time-of-day performance patterns\n• Learning velocity calculations\n• Custom date range selection');
      });
    }
  });

  // Streak Info
  const streakCard = document.querySelector('.streak-card');
  if (streakCard) {
    const cardHeader = streakCard.querySelector('.card-header-dash h2');
    if (cardHeader) {
      cardHeader.style.cursor = 'pointer';
      cardHeader.title = 'Click for more info';
      cardHeader.addEventListener('click', () => {
        alert('🔥 Learning Streak\n\nMaintain your daily learning momentum!\n\n✨ How It Works:\n• Complete at least one quiz per day\n• Streak increases with consecutive days\n• Visual calendar shows your activity\n• Motivational messages keep you engaged\n\n📈 Current Status:\n• Real streak tracking from your activity\n• Automatically updates when you complete quizzes\n• Calendar shows last 7 days\n• Today is highlighted with gold border\n\n🚀 Full Implementation:\n• Streak freeze power-ups\n• Weekly/monthly streak challenges\n• Social streak competitions\n• Streak recovery options\n• Personalized streak goals\n• Achievement unlocks at milestones\n• Streak leaderboards\n• Reminder notifications');
      });
    }
  }

  // Today's Activity Info
  const todayCards = document.querySelectorAll('.dashboard-card');
  todayCards.forEach(card => {
    const header = card.querySelector('.card-header-dash h2');
    if (header && header.textContent.includes("Today's Activity")) {
      header.style.cursor = 'pointer';
      header.title = 'Click for more info';
      header.addEventListener('click', () => {
        alert("📅 Today's Activity\n\nYour learning stats for today.\n\n✨ What's Tracked:\n• Number of quizzes completed today\n• Total study time in minutes\n• Average accuracy percentage\n\n📊 Real Data:\n• Updates automatically after each quiz\n• Resets daily at midnight\n• Stored locally in your browser\n\n🚀 Full Implementation:\n• Detailed session breakdowns\n• Topic-wise time allocation\n• Focus time vs break time\n• Productivity score\n• Daily goals and targets\n• Progress towards weekly objectives\n• Study session analytics\n• Optimal study time recommendations");
      });
    }
  });

  // Quick Stats Cards Info
  const quickStats = document.querySelectorAll('.stat-overview-card');
  quickStats.forEach(card => {
    card.style.cursor = 'help';
    card.title = 'Click for details';
    card.addEventListener('click', function(e) {
      // Prevent click if clicking on the card itself, not child elements
      if (e.target === this || e.target.classList.contains('stat-overview-content') || 
          e.target.classList.contains('stat-overview-value') || 
          e.target.classList.contains('stat-overview-label') ||
          e.target.classList.contains('stat-overview-icon')) {
        
        const label = this.querySelector('.stat-overview-label').textContent;
        
        if (label.includes('Quizzes')) {
          alert('🎯 Quizzes Completed\n\n✨ Real Data:\n• Tracks every quiz you complete\n• Updates automatically after each game\n• Persistent across sessions\n\n📊 Counts:\n• Solo learning quizzes\n• Multiplayer quiz games\n• All difficulty levels\n\n🚀 Full Implementation:\n• Quiz category breakdown\n• Success rate per quiz type\n• Most/least practiced topics\n• Quiz completion time trends');
        } else if (label.includes('Accuracy')) {
          alert('⭐ Average Accuracy\n\n✨ Real Data:\n• Calculated from all your completed quizzes\n• Shows percentage of correct answers\n• Updates after each quiz\n\n📊 Calculation:\n• Total correct answers / Total questions\n• Weighted across all quiz sessions\n• Reflects your overall performance\n\n🚀 Full Implementation:\n• Accuracy trends over time\n• Topic-specific accuracy\n• Difficulty-adjusted scoring\n• Comparison with peer averages\n• Accuracy improvement rate');
        } else if (label.includes('Study Time')) {
          alert('⏱️ Total Study Time\n\n✨ Current Calculation:\n• Estimated from quiz completions\n• Approximately 5 minutes per quiz\n• Cumulative total time\n\n📊 Includes:\n• Active quiz time\n• Estimated review time\n• Learning session duration\n\n🚀 Full Implementation:\n• Precise time tracking per session\n• Active vs passive learning time\n• Break time exclusion\n• Topic-wise time allocation\n• Study efficiency metrics\n• Optimal study duration insights\n• Time-of-day productivity analysis');
        } else if (label.includes('Achievements')) {
          alert('🏅 Achievements Unlocked\n\n✨ Real Progress:\n• Shows your actual unlocked achievements\n• Updates when you complete new challenges\n• Earns Skill Points (SP) for each achievement\n\n📊 Achievement Tiers:\n• Easy: 6 achievements (10-30 SP each)\n• Hard: 8 achievements (80-120 SP each)\n• Impossible: 9 achievements (200-500 SP each)\n\n🎯 How to Unlock:\n• Complete quizzes\n• Maintain accuracy streaks\n• Avoid timeouts\n• Use strategic power-ups\n• Reach score milestones\n\n🚀 Full Implementation:\n• Hidden achievements\n• Time-limited challenges\n• Social achievements\n• Collaboration rewards\n• Seasonal events\n• Custom achievement creation');
        }
      }
    });
  });
});

// Add practice button handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-practice-weak')) {
    alert('🎯 Practice Mode (Demo)\n\nThis feature would start a focused quiz session on your weak areas.\n\n✨ Current Display:\n• Simulated weak areas based on common learning patterns\n• Sample accuracy percentages\n• Demo topic categories\n\n🚀 Full Implementation:\n• AI analyzes your actual quiz performance\n• Identifies specific concepts you struggle with\n• Generates targeted practice questions\n• Adaptive difficulty based on your progress\n• Spaced repetition scheduling\n• Personalized learning paths\n• Progress tracking per weak area\n• Smart review recommendations\n• Mastery verification quizzes');
  }


  if (e.target.classList.contains('btn-view-all-files')) {
    alert('📁 File Management (Demo)\n\nView and manage all your uploaded learning materials.\n\n✨ Current Display:\n• Sample uploaded files with demo data\n• Simulated progress percentages\n• Example concept tags\n\n🚀 Full Implementation:\n• Real file upload and storage\n• AI-powered content extraction\n• Automatic summarization\n• Concept identification and tagging\n• Knowledge graph visualization\n• Cross-reference between files\n• Search within file contents\n• Export study materials\n• Organize files by subject/topic\n• Share files with study groups\n• Version tracking for updated materials\n• Cloud synchronization\n• Offline access to files');
  }
});

// ========== AI PODCAST ==========
let podcastPlaying = false;
let podcastCurrentTime = 0;
let podcastTotalDuration = 525; // 8:45 in seconds
let podcastPlaybackSpeed = 1;
let podcastInterval = null;

function showAIPodcast() {
  document.getElementById('podcastScreen').classList.add('active');
  
  // Update file name in podcast
  if (state.uploadedFile) {
    document.getElementById('podcastFileName').textContent = state.uploadedFile.name.split('.')[0];
  }
  
  // Show notification
  setTimeout(() => {
    alert('🎙️ AI Podcast Demo\n\nThis feature generates an engaging audio podcast about your learning material.\n\n✨ What you see:\n• Interactive podcast player\n• Simulated playback controls\n• Topic timeline\n• Speed controls and download option\n\n🚀 In a real implementation:\n• AI analyzes your document\n• Generates natural conversation between AI hosts\n• Creates professional audio with voice synthesis\n• Discusses key concepts in detail\n• Perfect for auditory learners and multitasking\n• Listen while commuting, exercising, or relaxing');
  }, 500);
  
  // Reset podcast state
  podcastPlaying = false;
  podcastCurrentTime = 0;
  updatePodcastDisplay();
}

document.getElementById('backFromPodcastBtn').addEventListener('click', () => {
  document.getElementById('podcastScreen').classList.remove('active');
  stopPodcast();
});

// Play/Pause functionality
document.getElementById('podcastPlayPause').addEventListener('click', () => {
  if (podcastPlaying) {
    pausePodcast();
  } else {
    playPodcast();
  }
});

function playPodcast() {
  podcastPlaying = true;
  document.getElementById('podcastPlayIcon').textContent = '⏸️';
  
  podcastInterval = setInterval(() => {
    podcastCurrentTime += podcastPlaybackSpeed;
    if (podcastCurrentTime >= podcastTotalDuration) {
      podcastCurrentTime = podcastTotalDuration;
      pausePodcast();
    }
    updatePodcastDisplay();
  }, 1000);
}

function pausePodcast() {
  podcastPlaying = false;
  document.getElementById('podcastPlayIcon').textContent = '▶️';
  if (podcastInterval) {
    clearInterval(podcastInterval);
    podcastInterval = null;
  }
}

function stopPodcast() {
  pausePodcast();
  podcastCurrentTime = 0;
  updatePodcastDisplay();
}

function updatePodcastDisplay() {
  const progress = (podcastCurrentTime / podcastTotalDuration) * 100;
  document.getElementById('podcastProgress').style.width = progress + '%';
  document.getElementById('podcastHandle').style.left = progress + '%';
  
  const currentMins = Math.floor(podcastCurrentTime / 60);
  const currentSecs = Math.floor(podcastCurrentTime % 60);
  document.getElementById('podcastCurrentTime').textContent = 
    `${currentMins}:${currentSecs.toString().padStart(2, '0')}`;
  
  const totalMins = Math.floor(podcastTotalDuration / 60);
  const totalSecs = Math.floor(podcastTotalDuration % 60);
  document.getElementById('podcastDuration').textContent = 
    `${totalMins}:${totalSecs.toString().padStart(2, '0')}`;
}

// Rewind functionality
document.getElementById('podcastRewind').addEventListener('click', () => {
  podcastCurrentTime = Math.max(0, podcastCurrentTime - 15);
  updatePodcastDisplay();
});

// Forward functionality
document.getElementById('podcastForward').addEventListener('click', () => {
  podcastCurrentTime = Math.min(podcastTotalDuration, podcastCurrentTime + 15);
  updatePodcastDisplay();
});

// Speed control
document.getElementById('podcastSpeed').addEventListener('click', () => {
  const speeds = [1, 1.25, 1.5, 1.75, 2];
  const currentIndex = speeds.indexOf(podcastPlaybackSpeed);
  const nextIndex = (currentIndex + 1) % speeds.length;
  podcastPlaybackSpeed = speeds[nextIndex];
  document.getElementById('speedValue').textContent = podcastPlaybackSpeed + 'x';
});

// Download functionality
document.getElementById('podcastDownload').addEventListener('click', () => {
  alert('⬇️ Download Podcast\n\nDownloading: Learning Insights Podcast\n\nIn a real implementation, you could:\n✅ Save for offline listening\n✅ Access without internet\n✅ Listen anytime, anywhere\n✅ Share with study partners\n\nPerfect for on-the-go learning!');
});

// Progress bar click
document.querySelector('.podcast-progress-bar').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;
  podcastCurrentTime = percentage * podcastTotalDuration;
  updatePodcastDisplay();
});

// Topic items click
document.querySelectorAll('.topic-item').forEach(item => {
  item.addEventListener('click', () => {
    const timeText = item.querySelector('.topic-time').textContent;
    const [mins, secs] = timeText.split(':').map(Number);
    podcastCurrentTime = (mins * 60) + secs;
    updatePodcastDisplay();
    
    if (!podcastPlaying) {
      playPodcast();
    }
  });
});

// Add podcast to format selection
document.querySelectorAll('.format-card').forEach(card => {
  if (card.dataset.format === 'podcast') {
    card.addEventListener('click', () => {
      if (!state.uploadedFile) {
        alert('Please upload a file first!');
        return;
      }
      
      document.querySelectorAll('.format-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedFormat = 'podcast';
      
      showLoadingScreen('podcast');
      setTimeout(() => {
        hideLoadingScreen();
        showAIPodcast();
      }, 3000);
    });
  }
});


// ===== ABOUT DASHBOARD MODAL =====
const aboutModal = document.getElementById('aboutDashboardModal');
const closeModal = document.getElementById('closeDashboardModal');

document.getElementById('dashboardInfoBtn').addEventListener('click', () => {
  aboutModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  aboutModal.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    aboutModal.classList.remove('active');
  }
});


init();
