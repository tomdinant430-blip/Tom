const defaultCourse = `Conduction : chaleur transmise de proche en proche par agitation des molécules.
Ex : faire chauffer une casserole.
Convection : transfert de chaleur dans un fluide d'une zone chaude vers froide avec déplacement du fluide. Donne des échanges thermiques entre la peau et le milieu, favorisés par la vitesse de déplacement de l'air.
Ex : le ventilateur.
Rayonnement infrarouge : émis par un élément chaud, se propage dans l'air. Ex : le corps humain.
Thermorégulation : les RI émis varient en fonction de la température, la tension artérielle devient importante.
Une mauvaise thermorégulation peut entraîner une hyperthermie ou une hypothermie.
Déséquilibre thermique : réactions corporelles, T° de référence = 37°C chez l'homme.
Thermorécepteurs détectent l'écart, réactions comportementales et physiologiques (frisson, vasoconstriction) pour revenir à 37°C.
Vasomotricité : changement de diamètre des vaisseaux sanguins en fonction du milieu.
Production de chaleur : la T° reste stable car l'énergie perdue est compensée par l'énergie produite. Le métabolisme produit de l'énergie chimique et thermique.
Métabolisme : énergie minimale dont le corps a besoin pour assurer ses fonctions vitales.
Ectothermes : T° interne semblable à la T° ambiante (poissons, reptiles).
Endothermes : maintien d'une T° interne élevée et constante.
Homéothermie : équilibre entre thermogenèse et thermolyse régulées par un centre thermorégulateur.
Thermogenèse : réactions métaboliques au niveau des graisses brunes et des muscles.
Thermolyse : s'effectue par conduction, convection et radiation afin de maintenir la T° à 37°C.`;

const courseInput = document.querySelector("#course-input");
const flashcardEl = document.querySelector("#flashcard");
const flashcardFront = document.querySelector("#flashcard-front");
const flashcardBack = document.querySelector("#flashcard-back");
const flashcardCounter = document.querySelector("#flashcard-counter");
const quizList = document.querySelector("#quiz-list");

const state = {
  cards: [],
  currentIndex: 0,
  flipped: false,
};

const normalizeLine = (line) =>
  line
    .replace(/^[-•*\s]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const parseCourse = (text) => {
  const lines = text
    .split("\n")
    .map((line) => normalizeLine(line))
    .filter((line) => line.length > 0);

  return lines.map((line) => {
    const [termPart, ...rest] = line.split(":");
    if (rest.length > 0) {
      return {
        term: termPart.trim(),
        definition: rest.join(":").trim(),
      };
    }

    return {
      term: line.trim(),
      definition: "Relis le cours pour préciser cette idée.",
    };
  });
};

const buildQuizQuestions = (cards) =>
  cards.map((card, index) => {
    if (card.definition && card.definition !== "Relis le cours pour préciser cette idée.") {
      return {
        question: `Que signifie « ${card.term} » ?`,
        answer: card.definition,
      };
    }

    return {
      question: `Explique l'idée suivante (carte ${index + 1}).`,
      answer: card.term,
    };
  });

const renderFlashcard = () => {
  if (state.cards.length === 0) {
    flashcardFront.textContent = "Ajoute ton cours pour créer des flashcards.";
    flashcardBack.textContent = "";
    flashcardCounter.textContent = "0 / 0";
    flashcardFront.classList.add("active");
    flashcardBack.classList.remove("active");
    return;
  }

  const card = state.cards[state.currentIndex];
  flashcardFront.textContent = card.term;
  flashcardBack.textContent = card.definition;
  flashcardCounter.textContent = `${state.currentIndex + 1} / ${state.cards.length}`;

  if (state.flipped) {
    flashcardFront.classList.remove("active");
    flashcardBack.classList.add("active");
  } else {
    flashcardFront.classList.add("active");
    flashcardBack.classList.remove("active");
  }
};

const renderQuiz = (questions) => {
  quizList.innerHTML = "";
  if (questions.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Génère un quiz pour afficher des questions.";
    quizList.appendChild(empty);
    return;
  }

  questions.forEach((item) => {
    const li = document.createElement("li");
    li.className = "quiz-item";
    const title = document.createElement("p");
    title.textContent = item.question;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Écris ta réponse ici";
    input.dataset.answer = item.answer;
    li.appendChild(title);
    li.appendChild(input);
    quizList.appendChild(li);
  });
};

const generateFlashcards = () => {
  state.cards = parseCourse(courseInput.value);
  state.currentIndex = 0;
  state.flipped = false;
  renderFlashcard();
};

const generateQuiz = () => {
  const questions = buildQuizQuestions(parseCourse(courseInput.value));
  renderQuiz(questions);
};

const updateCourseInput = (value) => {
  courseInput.value = value;
};

const moveCard = (direction) => {
  if (state.cards.length === 0) {
    return;
  }

  state.currentIndex =
    (state.currentIndex + direction + state.cards.length) % state.cards.length;
  state.flipped = false;
  renderFlashcard();
};

const flipCard = () => {
  if (state.cards.length === 0) {
    return;
  }
  state.flipped = !state.flipped;
  renderFlashcard();
};

courseInput.addEventListener("input", () => {
  state.cards = [];
  renderFlashcard();
});

document.querySelector("#generate-flashcards").addEventListener("click", () => {
  generateFlashcards();
});

document.querySelector("#generate-quiz").addEventListener("click", () => {
  generateQuiz();
});

document.querySelector("#reset-course").addEventListener("click", () => {
  updateCourseInput(defaultCourse);
  generateFlashcards();
  generateQuiz();
});

document.querySelector("#clear-course").addEventListener("click", () => {
  updateCourseInput("");
  state.cards = [];
  renderFlashcard();
  renderQuiz([]);
});

document.querySelector("#prev-card").addEventListener("click", () => {
  moveCard(-1);
});

document.querySelector("#next-card").addEventListener("click", () => {
  moveCard(1);
});

document.querySelector("#flip-card").addEventListener("click", () => {
  flipCard();
});

document.querySelector("#reset-quiz").addEventListener("click", () => {
  generateQuiz();
});

updateCourseInput(defaultCourse);
renderFlashcard();
renderQuiz(buildQuizQuestions(parseCourse(defaultCourse)));
