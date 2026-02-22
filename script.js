// ==============================
// VARIABLES
// ==============================
let minutes = 25;
let seconds = 0;
let isRunning = false;
let timerInterval = null;
let sessionCount = 0;
let totalFocusedTime = 0; // in minutes

// Elements
const minEl = document.getElementById('minutes');
const secEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const sessionInfo = document.getElementById('session-info');
const progressBar = document.getElementById('progress-bar');
const progressCircle = document.getElementById('progress-circle');

// Task Elements
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');

// Ambient Sound Toggle
const soundToggle = document.getElementById('sound-toggle');
let ambientPlaying = false;
const ambientSound = new Audio('assets/ambient.mp3'); 
ambientSound.loop = true;

// Quote Element
const quoteEl = document.getElementById('quote');

// Motivational Quotes
const quotes = [
    "Focus on your goal, not your fear.",
    "Small steps every day lead to big results.",
    "Discipline is the bridge between goals and achievement.",
    "Your future depends on what you do today.",
    "Push yourself, because no one else will."
];

// Circular Timer
const circleCircumference = 2 * Math.PI * 70;
progressCircle.style.strokeDasharray = circleCircumference;
progressCircle.style.strokeDashoffset = circleCircumference;

// ==============================
// DARK / LIGHT MODE
// ==============================
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// ==============================
// AMBIENT SOUND TOGGLE
// ==============================
soundToggle.addEventListener('click', () => {
    ambientPlaying = !ambientPlaying;
    if(ambientPlaying) ambientSound.play();
    else ambientSound.pause();
});

// ==============================
// TIMER FUNCTIONS
// ==============================
function updateDisplay() {
    minEl.textContent = minutes.toString().padStart(2,'0');
    secEl.textContent = seconds.toString().padStart(2,'0');
}

function updateProgressCircle() {
    let totalSeconds = 25*60;
    let elapsed = totalSeconds - (minutes*60 + seconds);
    let offset = circleCircumference - (elapsed/totalSeconds)*circleCircumference;
    progressCircle.style.strokeDashoffset = offset;
}

function startTimer() {
    if(isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if(seconds === 0){
            if(minutes === 0){
                sessionCount++;
                totalFocusedTime += 25;
                sessionInfo.textContent = `Session: ${sessionCount}`;
                updateProgress();
                playAlert();
                resetPomodoro();
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        updateDisplay();
        updateProgressCircle();
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetPomodoro() {
    pauseTimer();
    minutes = 25;
    seconds = 0;
    updateDisplay();
    updateProgressCircle();
}

function playAlert() {
    const audio = new Audio('assets/bell.mp3');
    audio.play();
}

// ==============================
// PROGRESS BAR FUNCTION
// ==============================
function updateProgress() {
    const progress = Math.min((totalFocusedTime/200)*100, 100);
    progressBar.style.width = progress + '%';
    document.getElementById('total-time').textContent = totalFocusedTime;
}

// ==============================
// TASK FUNCTIONS
// ==============================
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if(task.completed) li.classList.add('completed');

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteTask(index));

        li.addEventListener('click', () => toggleComplete(index));

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}

function saveTasks(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(){
    const text = newTaskInput.value.trim();
    if(!text) return;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({text, completed:false});
    saveTasks(tasks);
    newTaskInput.value = '';
    loadTasks();
}

function deleteTask(index){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index,1);
    saveTasks(tasks);
    loadTasks();
}

function toggleComplete(index){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    loadTasks();
}

// ==============================
// MOTIVATIONAL QUOTE
// ==============================
function showRandomQuote(){
    const random = quotes[Math.floor(Math.random()*quotes.length)];
    quoteEl.textContent = random;
}

// ==============================
// EVENT LISTENERS
// ==============================
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetPomodoro);

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress',(e)=>{
    if(e.key==='Enter') addTask();
});

// Initial load
updateDisplay();
updateProgressCircle();
loadTasks();
showRandomQuote();
setInterval(showRandomQuote,30000);