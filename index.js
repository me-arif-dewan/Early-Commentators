
// =========================
// DATASET
// =========================

const scholars = [
    {"name": "عبد الله بن مسعود", "class": "الصحابة", "death_year": "٣٢", "note": ""},
    {"name": "عبد الله بن عباس", "class": "الصحابة", "death_year": "٦٨", "note": ""},
    {"name": "أبو العالية", "class": "التابعين", "death_year": "٩٣", "note": ""},
    {"name": "سعيد بن جبير", "class": "التابعين", "death_year": "٩٥", "note": ""},
    {"name": "الضحاك بن مزاحم", "class": "التابعين", "death_year": "١٠٠", "note": ""},
    {"name": "عكرمة مولى ابن عباس", "class": "التابعين", "death_year": "١٠٥", "note": ""},
    {"name": "مجاهد بن جبر", "class": "التابعين", "death_year": "١٠٦", "note": ""},
    {"name": "الحسن البصري", "class": "التابعين", "death_year": "١١٠", "note": ""},
    {"name": "عطاء بن أبي رباح", "class": "التابعين", "death_year": "١١٤", "note": ""},
    {"name": "قتادة بن دعامة", "class": "التابعين", "death_year": "١١٧", "note": ""},
    {"name": "إسماعيل السدي", "class": "التابعين", "death_year": "١٢٧", "note": ""},
    {"name": "الربيع بن أنس", "class": "التابعين", "death_year": "١٣٩", "note": ""},
    {"name": "محمد بن السائب الكلبي", "class": "أتباع التابعين", "death_year": "١٤٦", "note": "في الحديث: متروك"},
    {"name": "مقاتل بن سليمان", "class": "أتباع التابعين", "death_year": "١٥٠", "note": "في الحديث: متهم بالكذب"},
    {"name": "مقاتل بن حيان", "class": "أتباع التابعين", "death_year": "١٥٠", "note": ""},
    {"name": "عبد الملك بن جريج", "class": "أتباع التابعين", "death_year": "١٥٠", "note": "في الحديث: مدلس"},
    {"name": "محمد بن إسحاق", "class": "أتباع التابعين", "death_year": "١٥٢", "note": "في الحديث: مدلس"},
    {"name": "عبد الرحمن بن زيد بن أسلم", "class": "أتباع التابعين", "death_year": "١٨٢", "note": "في الحديث: ضعيف"},
    {"name": "يحيى بن سلام", "class": "أتباع التابعين", "death_year": "٢٠٠", "note": ""}
];

// =========================
// GLOBALS
// =========================

let score = 0;
let currentQuestion = 0;
let totalQuestions = 10;
let currentTimer = null;
let timeLeft = 30;
let questionLocked = false;
let isPaused = false;
let isDark = true;
const MIN_FONT = 16;
const MAX_FONT = 30;
const FONT_STEP = 2;
let fontSize = 18;

// =========================
// ELEMENTS
// =========================

const landingScreen = document.getElementById("landingScreen");
const gameScreen = document.getElementById("gameScreen");
const finalScreen = document.getElementById("finalScreen");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const skipBtn = document.getElementById("skipBtn");
const themeBtn = document.getElementById("themeBtn");
const fontIncBtn = document.getElementById("fontIncBtn");
const fontDecBtn = document.getElementById("fontDecBtn");
const fontSizeLabel = document.getElementById("fontSizeLabel");
const qIncBtn = document.getElementById("qIncBtn");
const qDecBtn = document.getElementById("qDecBtn");
const qCountLabel = document.getElementById("qCountLabel");

window.setQCount = function(n) {
    totalQuestions = Math.max(5, Math.min(200, n));
    qCountLabel.textContent = totalQuestions;
}

qIncBtn.addEventListener("click", () => setQCount(totalQuestions + 5));
qDecBtn.addEventListener("click", () => setQCount(totalQuestions - 5));

const scoreDisplay = document.getElementById("scoreDisplay");
const questionCounter = document.getElementById("questionCounter");
const timerDisplay = document.getElementById("timerDisplay");
const timerBar = document.getElementById("timerBar");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const noteBox = document.getElementById("noteBox");
const noteText = document.getElementById("noteText");

const finalScore = document.getElementById("finalScore");
const finalDetails = document.getElementById("finalDetails");
const playAgainBtn = document.getElementById("playAgainBtn");
const restartBtn = document.getElementById("restartBtn");

// =========================
// HELPERS
// =========================

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function unique(arr) {
    return [...new Set(arr)];
}

// =========================
// GAME START
// =========================

startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
    finalScreen.classList.add("hidden");
    landingScreen.classList.remove("hidden");
    startBtn.disabled = false;
});
stopBtn.addEventListener("click", endGame);

pauseBtn.addEventListener("click", () => {
    if (isPaused) {
    isPaused = false;
    pauseBtn.textContent = "⏸ إيقاف مؤقت";
    if (!questionLocked) startTimer();
    } else {
    isPaused = true;
    pauseBtn.textContent = "▶ استمرار";
    clearInterval(currentTimer);
    }
});

skipBtn.addEventListener("click", () => {
    if (!questionLocked) return;
    clearTimeout(window.nextQTimer);
    nextQuestion();
});

themeBtn.addEventListener("click", () => {
    isDark = !isDark;
    document.body.classList.toggle("light", !isDark);
    themeBtn.textContent = isDark ? "🌙 داكن" : "☀️ فاتح";
});

function applyFontSize() {
    document.documentElement.style.fontSize = fontSize + "px";
    fontSizeLabel.textContent = fontSize + "px";
    fontDecBtn.disabled = fontSize <= MIN_FONT;
    fontIncBtn.disabled = fontSize >= MAX_FONT;
    fontDecBtn.classList.toggle("opacity-40", fontSize <= MIN_FONT);
    fontIncBtn.classList.toggle("opacity-40", fontSize >= MAX_FONT);
}

fontIncBtn.addEventListener("click", () => {
    if (fontSize < MAX_FONT) { fontSize += FONT_STEP; applyFontSize(); }
});

fontDecBtn.addEventListener("click", () => {
    if (fontSize > MIN_FONT) { fontSize -= FONT_STEP; applyFontSize(); }
});

applyFontSize();

function startGame() {

    score = 0;
    currentQuestion = 0;

    landingScreen.classList.add("hidden");
    finalScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    isPaused = false;
    startBtn.disabled = true;

    stopBtn.disabled = false;
    stopBtn.classList.remove("opacity-50", "cursor-not-allowed");

    pauseBtn.disabled = false;
    pauseBtn.classList.remove("opacity-50", "cursor-not-allowed");
    pauseBtn.textContent = "⏸ إيقاف مؤقت";

    skipBtn.disabled = true;
    skipBtn.classList.add("opacity-50", "cursor-not-allowed");

    updateStats();

    nextQuestion();
}

// =========================
// END GAME
// =========================

function endGame() {

    clearInterval(currentTimer);

    gameScreen.classList.add("hidden");
    finalScreen.classList.remove("hidden");

    stopBtn.disabled = true;
    stopBtn.classList.add("opacity-50", "cursor-not-allowed");

    pauseBtn.disabled = true;
    pauseBtn.classList.add("opacity-50", "cursor-not-allowed");

    skipBtn.disabled = true;
    skipBtn.classList.add("opacity-50", "cursor-not-allowed");

    const percentage = Math.round((score / totalQuestions) * 100);

    finalScore.textContent = percentage + "%";

    finalDetails.innerHTML = `
    أجبت بشكل صحيح على
    <span class="gold font-bold">${score}</span>
    من أصل
    <span class="gold font-bold">${totalQuestions}</span>
    سؤال
    `;
}

// =========================
// UPDATE UI
// =========================

function updateStats() {
    scoreDisplay.textContent = score;
    questionCounter.textContent = `${currentQuestion + 1} / ${totalQuestions}`;
}

// =========================
// TIMER
// =========================

function startTimer() {

    clearInterval(currentTimer);

    timerDisplay.textContent = timeLeft;
    timerBar.style.width = `${(timeLeft / 30) * 100}%`;

    currentTimer = setInterval(() => {

    timeLeft--;

    timerDisplay.textContent = timeLeft;

    timerBar.style.width = `${(timeLeft / 30) * 100}%`;

    if (timeLeft <= 0) {

        clearInterval(currentTimer);

        if (!questionLocked) {
        revealAnswer([], false);
        }
    }

    }, 1000);
}

// =========================
// NEXT QUESTION
// =========================

function nextQuestion() {

    if (currentQuestion >= totalQuestions) {
    endGame();
    return;
    }

    questionLocked = false;
    timeLeft = 30;

    noteBox.classList.add("hidden");

    updateStats();

    const question = generateQuestion();

    renderQuestion(question);

    startTimer();
}

// =========================
// QUESTION GENERATOR
// =========================

function generateQuestion() {

    const types = [
    "deathYear",
    "whoDied",
    "classOf",
    "selectClass",
    "importantNote",
    "noteOwner",
    "rankQuestion",
    "numberClass"
    ];

    const type = randomItem(types);

    switch(type) {

    case "deathYear":
        return generateDeathYearQuestion();

    case "whoDied":
        return generateWhoDiedQuestion();

    case "classOf":
        return generateClassQuestion();

    case "selectClass":
        return generateSelectClassQuestion();

    case "importantNote":
        return generateImportantNoteQuestion();

    case "noteOwner":
        return generateNoteOwnerQuestion();

    case "rankQuestion":
        return generateRankQuestion();

    case "numberClass":
        return generateNumberClassQuestion();
    }
}

// =========================
// QUESTION TYPES
// =========================

function generateDeathYearQuestion() {

    const scholar = randomItem(scholars);

    let options = unique(
    shuffle([
        scholar.death_year,
        ...shuffle(scholars)
        .slice(0,3)
        .map(s => s.death_year)
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `ما سنة وفاة ${scholar.name} ؟`,
    options,
    correct: [scholar.death_year],
    note: scholar.note
    };
}

function generateWhoDiedQuestion() {

    const scholar = randomItem(scholars);

    let options = unique(
    shuffle([
        scholar.name,
        ...shuffle(scholars)
        .slice(0,3)
        .map(s => s.name)
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `من الذي تُوفي سنة ${scholar.death_year} هـ ؟`,
    options,
    correct: [scholar.name],
    note: scholar.note
    };
}

function generateClassQuestion() {

    const scholar = randomItem(scholars);

    const classes = unique(scholars.map(s => s.class));

    return {
    type: "single",
    question: `إلى أي طبقة ينتمي ${scholar.name} ؟`,
    options: shuffle(classes),
    correct: [scholar.class],
    note: scholar.note
    };
}

function generateSelectClassQuestion() {

    const selectedClass = randomItem(unique(scholars.map(s => s.class)));

    const correctPeople = scholars
    .filter(s => s.class === selectedClass)
    .slice(0, Math.min(3, scholars.filter(s => s.class === selectedClass).length))
    .map(s => s.name);

    const wrongPeople = shuffle(
    scholars.filter(s => s.class !== selectedClass)
    ).slice(0,3).map(s => s.name);

    const options = shuffle([...correctPeople, ...wrongPeople]);

    return {
    type: "multiple",
    question: `اختر جميع الرواة الذين ينتمون إلى طبقة "${selectedClass}"`,
    options,
    correct: correctPeople,
    note: ""
    };
}

function generateImportantNoteQuestion() {

    const noted = scholars.filter(s => s.note);

    const scholar = randomItem(noted);

    let options = unique(
    shuffle([
        scholar.note,
        ...shuffle(noted)
        .slice(0,3)
        .map(s => s.note)
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `ما الملاحظة المهمة المتعلقة بـ ${scholar.name} ؟`,
    options,
    correct: [scholar.note],
    note: scholar.note
    };
}

function generateNoteOwnerQuestion() {

    const noted = scholars.filter(s => s.note);

    const scholar = randomItem(noted);

    let options = unique(
    shuffle([
        scholar.name,
        ...shuffle(scholars)
        .slice(0,3)
        .map(s => s.name)
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `من الذي لديه الملاحظة التالية: "${scholar.note}" ؟`,
    options,
    correct: [scholar.name],
    note: scholar.note
    };
}

function generateRankQuestion() {

    const scholar = randomItem(scholars);

    const rank = scholars.indexOf(scholar) + 1;

    let options = unique(
    shuffle([
        rank.toString(),
        (rank + 1).toString(),
        (Math.max(1, rank - 1)).toString(),
        (rank + 2).toString()
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `ما رقم (ترقي) ${scholar.name} ؟`,
    options,
    correct: [rank.toString()],
    note: scholar.note
    };
}

function generateNumberClassQuestion() {

    const scholar = randomItem(scholars);

    const rank = scholars.indexOf(scholar) + 1;

    let options = unique(
    shuffle([
        scholar.name,
        ...shuffle(scholars)
        .slice(0,3)
        .map(s => s.name)
    ])
    ).slice(0,4);

    return {
    type: "single",
    question: `من ينتمي إلى "${scholar.class}" ويحمل الرقم ${rank} ؟`,
    options,
    correct: [scholar.name],
    note: scholar.note
    };
}

// =========================
// RENDER QUESTION
// =========================

let currentQuestionData = null;
let selectedMultiple = [];

function renderQuestion(data) {

    currentQuestionData = data;

    questionText.textContent = data.question;

    optionsContainer.innerHTML = "";

    selectedMultiple = [];

    data.options.forEach(option => {

    const btn = document.createElement("button");

    btn.className = `
        option
        glass
        border
        border-white/10
        rounded-2xl
        p-4
        text-2xl
        text-right
        w-full
        hover:border-green-400
        hover:bg-green-500/10
        active:bg-green-500/20
    `;

    btn.textContent = option;

    if (data.type === "single") {

        btn.addEventListener("click", () => {

        if (questionLocked) return;

        revealAnswer([option], option === data.correct[0]);
        });

    } else {

        btn.addEventListener("click", () => {

        if (questionLocked) return;

        btn.classList.toggle("selected-option");

        if (selectedMultiple.includes(option)) {
            selectedMultiple = selectedMultiple.filter(x => x !== option);
        } else {
            selectedMultiple.push(option);
        }
        });
    }

    optionsContainer.appendChild(btn);
    });

    if (data.type === "multiple") {

    const submitBtn = document.createElement("button");

    submitBtn.className = `
        mt-4
        bg-yellow-500
        hover:bg-yellow-400
        active:bg-yellow-600
        text-black
        font-bold
        rounded-2xl
        p-4
        text-base
        w-full
    `;

    submitBtn.textContent = "تأكيد الإجابة";

    submitBtn.addEventListener("click", () => {

        if (questionLocked) return;

        const correct =
        data.correct.length === selectedMultiple.length &&
        data.correct.every(x => selectedMultiple.includes(x));

        revealAnswer(selectedMultiple, correct);
    });

    optionsContainer.appendChild(submitBtn);
    }
}

// =========================
// REVEAL ANSWER
// =========================

function revealAnswer(selected, isCorrect) {

    questionLocked = true;

    clearInterval(currentTimer);

    skipBtn.disabled = false;
    skipBtn.classList.remove("opacity-50", "cursor-not-allowed");

    const buttons = optionsContainer.querySelectorAll("button");

    buttons.forEach(btn => {

    const text = btn.textContent;

    btn.disabled = true;

    if (currentQuestionData.correct.includes(text)) {
        btn.classList.add("correct");
    }

    if (
        selected.includes(text) &&
        !currentQuestionData.correct.includes(text)
    ) {
        btn.classList.add("wrong");
    }
    });

    if (isCorrect) {
    score++;
    scoreDisplay.textContent = score;
    }

    if (currentQuestionData.note) {

    noteBox.classList.remove("hidden");

    noteText.textContent = currentQuestionData.note;
    }

    currentQuestion++;

    window.nextQTimer = setTimeout(() => {
    nextQuestion();
    }, isCorrect ? 2000 : 10000);
}