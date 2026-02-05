const courseModules = [
  {
    title: "Wish : souhait au présent",
    points: [
      "I wish she would/could come = souhait futur ou improbable",
      "Utiliser would like someone to do sth pour une demande",
    ],
  },
  {
    title: "Wish : regret au présent",
    points: [
      "I wish she came / were here = regret actuel",
      "Le français imparfait → prétérit modal (were pour be)",
    ],
  },
  {
    title: "Wish : regret passé",
    points: [
      "I wish she had come = regret passé",
      "Plus-que-parfait → past perfect en anglais",
    ],
  },
  {
    title: "Would rather",
    points: [
      "Avec un sujet : infinitif sans to",
      "He'd rather sleep / have slept",
    ],
  },
  {
    title: "Would rather : deux sujets",
    points: [
      "He'd rather she stayed with him tonight",
      "He'd rather she had stayed with him last night",
    ],
  },
];

const quizQuestions = [
  {
    question: "Comment exprimer un souhait pour l'avenir ?",
    answer: "I wish + would/could + base verbale (I wish she would come).",
  },
  {
    question: "Quelle forme utiliser pour un regret au présent ?",
    answer: "I wish + prétérit modal (I wish she were here).",
  },
  {
    question: "Quelle structure pour un regret passé ?",
    answer: "I wish + past perfect (I wish she had come).",
  },
  {
    question: "Would rather avec un seul sujet se construit comment ?",
    answer: "Would rather + base verbale (He'd rather sleep).",
  },
  {
    question: "Would rather avec deux sujets (présent) ?",
    answer: "Would rather + sujet + prétérit (He'd rather she stayed...).",
  },
  {
    question: "Would rather avec deux sujets (passé) ?",
    answer: "Would rather + sujet + past perfect (He'd rather she had stayed...).",
  },
];

const flashcards = [
  {
    front: "Souhait futur ou improbable",
    back: "I wish she would/could come.",
  },
  {
    front: "Regret au présent",
    back: "I wish she came / were here.",
  },
  {
    front: "Regret au passé",
    back: "I wish she had come.",
  },
  {
    front: "Would rather + 1 sujet",
    back: "He'd rather sleep / have slept.",
  },
  {
    front: "Would rather + 2 sujets (présent)",
    back: "He'd rather she stayed with him tonight.",
  },
  {
    front: "Would rather + 2 sujets (passé)",
    back: "He'd rather she had stayed with him last night.",
  },
];

const courseGrid = document.getElementById("course-grid");
const quizGrid = document.getElementById("quiz-grid");
const flashcardGrid = document.getElementById("flashcard-grid");
const flashcardCount = document.getElementById("flashcard-count");
const quizCount = document.getElementById("quiz-count");

const renderCourse = () => {
  courseGrid.innerHTML = "";
  courseModules.forEach((module) => {
    const card = document.createElement("article");
    card.className = "course-card";

    const title = document.createElement("h3");
    title.textContent = module.title;

    const list = document.createElement("ul");
    module.points.forEach((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      list.appendChild(item);
    });

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${module.points.length} points clés`;

    card.append(title, badge, list);
    courseGrid.appendChild(card);
  });
};

const renderQuiz = (questions) => {
  quizGrid.innerHTML = "";
  questions.forEach((item) => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const title = document.createElement("h3");
    title.textContent = item.question;

    const answer = document.createElement("div");
    answer.className = "quiz-answer";
    answer.textContent = item.answer;

    const button = document.createElement("button");
    button.className = "button button--ghost";
    button.textContent = "Voir la réponse";
    button.addEventListener("click", () => {
      card.classList.toggle("revealed");
      button.textContent = card.classList.contains("revealed")
        ? "Masquer"
        : "Voir la réponse";
    });

    card.append(title, answer, button);
    quizGrid.appendChild(card);
  });
};

const renderFlashcards = () => {
  flashcardGrid.innerHTML = "";
  flashcards.forEach((cardData, index) => {
    const card = document.createElement("article");
    card.className = "flashcard";
    card.dataset.index = index.toString();

    const label = document.createElement("span");
    label.className = "flashcard__label";
    label.textContent = `Carte ${index + 1}`;

    const front = document.createElement("div");
    front.className = "flashcard__face flashcard__front";
    front.innerHTML = `
      <strong>${cardData.front}</strong>
      <span>Cliquer pour retourner</span>
    `;

    const back = document.createElement("div");
    back.className = "flashcard__face flashcard__back";
    back.textContent = cardData.back;

    card.append(label, front, back);
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });

    flashcardGrid.appendChild(card);
  });
};

const shuffleQuiz = () => {
  const shuffled = [...quizQuestions]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
  renderQuiz(shuffled);
};

const revealAllQuiz = () => {
  document.querySelectorAll(".quiz-card").forEach((card) => {
    card.classList.add("revealed");
    const button = card.querySelector("button");
    if (button) {
      button.textContent = "Masquer";
    }
  });
};

const resetFlashcards = () => {
  document.querySelectorAll(".flashcard").forEach((card) => {
    card.classList.remove("is-flipped");
  });
};

renderCourse();
renderQuiz(quizQuestions);
renderFlashcards();
flashcardCount.textContent = flashcards.length.toString();
quizCount.textContent = quizQuestions.length.toString();

const shuffleButton = document.getElementById("shuffle-quiz");
const revealButton = document.getElementById("reveal-all");
const resetFlashcardButton = document.getElementById("reset-flashcards");

shuffleButton.addEventListener("click", shuffleQuiz);
revealButton.addEventListener("click", revealAllQuiz);
resetFlashcardButton.addEventListener("click", resetFlashcards);
