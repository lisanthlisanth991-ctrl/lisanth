
const questions = [
    {
        question: "Which language is used to structure a web page?",
        options: ["HTML", "CSS", "Python", "C++"],
        answer: 0,
        info: "HTML defines the structure and content of web pages."
    },
    {
        question: "Which technology adds colors and styles to a website?",
        options: ["SQL", "CSS", "C", "Python"],
        answer: 1,
        info: "CSS controls colors, fonts, spacing and layout."
    },
    {
        question: "What does CPU stand for?",
        options: [
            "Computer Power Unit",
            "Central Program Utility",
            "Central Processing Unit",
            "Control Processing User"
        ],
        answer: 2,
        info: "CPU means Central Processing Unit."
    },
    {
        question: "Which symbol usually ends a C statement?",
        options: [";", ":", ",", "."],
        answer: 0,
        info: "Most C statements end with a semicolon."
    },
    {
        question: "Which one is a programming language?",
        options: ["HTML", "CSS", "Python", "HTTP"],
        answer: 2,
        info: "Python is a general-purpose programming language."
    },
    {
        question: "Which device is an input device?",
        options: ["Monitor", "Keyboard", "Speaker", "Projector"],
        answer: 1,
        info: "A keyboard sends input to a computer."
    },
    {
        question: "What is 12 × 5?",
        options: ["50", "55", "65", "60"],
        answer: 3,
        info: "12 multiplied by 5 equals 60."
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        options: ["<a>", "<p>", "<img>", "<h1>"],
        answer: 0,
        info: "The anchor tag <a> creates hyperlinks."
    },
    {
        question: "Which component stores temporary working data?",
        options: ["Mouse", "Printer", "RAM", "Speaker"],
        answer: 2,
        info: "RAM temporarily stores data used by running programs."
    },
    {
        question: "What does ECE stand for?",
        options: [
            "Electronic Computer Engineering",
            "Electronics and Communication Engineering",
            "Electrical Computer Education",
            "Electronic Circuit Education"
        ],
        answer: 1,
        info: "ECE stands for Electronics and Communication Engineering."
    }
];

const welcome = document.getElementById("home");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");

const counter = document.getElementById("counter");
const timer = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("question");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");

let index = 0;
let score = 0;
let correct = 0;
let wrong = 0;
let seconds = 15;
let timerId = null;
let answered = false;

function showScreen(screen) {
    welcome.classList.add("hidden");
    quiz.classList.add("hidden");
    result.classList.add("hidden");

    screen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz() {
    clearInterval(timerId);

    index = 0;
    score = 0;
    correct = 0;
    wrong = 0;

    showScreen(quiz);
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerId);

    if (index >= questions.length) {
        showResults();
        return;
    }

    answered = false;
    seconds = 15;

    const q = questions[index];

    counter.textContent = `Question ${index + 1} / ${questions.length}`;
    progressBar.style.width = `${index / questions.length * 100}%`;
    questionText.textContent = q.question;
    feedback.textContent = "";
    feedback.className = "";
    optionsBox.replaceChildren();

    nextBtn.disabled = true;
    nextBtn.textContent =
        index === questions.length - 1 ? "See Results →" : "Next Question →";

    q.options.forEach((text, i) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option";

        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = String.fromCharCode(65 + i);

        const label = document.createElement("span");
        label.textContent = text;

        button.append(letter, label);
        button.addEventListener("click", () => chooseAnswer(i));

        optionsBox.appendChild(button);
    });

    updateTimer();
    timerId = setInterval(tick, 1000);
}

function updateTimer() {
    timer.textContent = `${seconds}s`;
    timer.classList.toggle("danger", seconds <= 5);
}

function tick() {
    seconds--;
    updateTimer();

    if (seconds <= 0) {
        chooseAnswer(-1);
    }
}

function chooseAnswer(choice) {
    if (answered) return;

    answered = true;
    clearInterval(timerId);

    const q = questions[index];
    const buttons = optionsBox.querySelectorAll(".option");
    const isCorrect = choice === q.answer;

    buttons.forEach((button, i) => {
        button.disabled = true;

        if (i === q.answer) {
            button.classList.add("correct");
        }

        if (i === choice && !isCorrect) {
            button.classList.add("wrong");
        }
    });

    if (isCorrect) {
        score += 10;
        correct++;
        feedback.textContent = `✅ Correct! ${q.info}`;
        feedback.className = "success";
    } else {
        wrong++;
        feedback.textContent = choice === -1
            ? `⏰ Time's up! ${q.info}`
            : `❌ Not quite. ${q.info}`;
        feedback.className = "error";
    }

    progressBar.style.width = `${(index + 1) / questions.length * 100}%`;
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (!answered) return;

    index++;
    loadQuestion();
}

function showResults() {
    clearInterval(timerId);
    showScreen(result);

    const total = questions.length * 10;
    const percent = Math.round(score / total * 100);

    document.getElementById("score").textContent = `${score} / ${total}`;
    document.getElementById("percentage").textContent = `${percent}% score`;
    document.getElementById("correct").textContent = correct;
    document.getElementById("wrong").textContent = wrong;

    const title = document.getElementById("resultTitle");

    if (percent >= 80) {
        title.textContent = "Amazing! 🏆";
    } else if (percent >= 50) {
        title.textContent = "Great effort! 🎉";
    } else {
        title.textContent = "Keep practising! 💪";
    }
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);

homeBtn.addEventListener("click", () => {
    clearInterval(timerId);
    showScreen(welcome);
});

showScreen(welcome);
