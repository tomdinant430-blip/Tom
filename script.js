const defaultCourse = `Les échanges thermiques entre le corps et son milieu

Conduction : chaleur transmise de proche en proche par l'agitation des molécules (ex : faire chauffer une casserole).
Convection : transfert de chaleur dans un fluide (gaz/liquide) d'une zone chaude vers une zone froide avec déplacement de matière (ex : ventilateur).
Rayonnement infrarouge : rayonnement émis par un élément chaud qui se propage dans l'air (ex : corps humain émet des RIR).

Mauvaise thermorégulation : peut entraîner hypothermie ou hyperthermie.

Déséquilibre thermique + réaction corporelle : température de référence 37°C, thermorécepteurs détectent l'écart.
Réactions comportementales : choix des vêtements.
Réactions physiologiques : frissons musculaires, vasomotricité.

Métabolisme : énergie minimum pour assurer les fonctions vitales au repos.
Production de chaleur par le corps : énergie chimique (ATP) et énergie thermique.

Schéma : si la température extérieure est inférieure à celle du corps, pertes de chaleur par rayonnement et respiration pulmonaire.`;

const fallbackFlashcards = [
  {
    term: "Conduction",
    definition: "Chaleur transmise de proche en proche par l'agitation des molécules (ex : casserole).",
  },
  {
    term: "Convection",
    definition:
      "Transfert de chaleur dans un fluide d'une zone chaude vers une zone froide avec déplacement de matière (ex : ventilateur).",
  },
  {
    term: "Rayonnement infrarouge",
    definition:
      "Rayonnement émis par un élément chaud qui se propage dans l'air (ex : corps humain).",
  },
  {
    term: "Thermorégulation",
    definition: "Mécanismes pour maintenir la température corporelle autour de 37°C.",
  },
  {
    term: "Réactions comportementales",
    definition: "Adaptations comme le choix des vêtements pour limiter les pertes de chaleur.",
  },
  {
    term: "Réactions physiologiques",
    definition: "Frissons musculaires et vasomotricité pour réchauffer le corps.",
  },
  {
    term: "Métabolisme",
    definition: "Énergie minimale nécessaire aux fonctions vitales au repos.",
  },
];

const courseInput = document.getElementById("courseInput");
const quizContainer = document.getElementById("quizContainer");
const flashcardContainer = document.getElementById("flashcardContainer");
const generateAllButton = document.getElementById("generateAll");
const resetButton = document.getElementById("resetContent");
const newQuizButton = document.getElementById("newQuiz");

const parseFlashcards = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const cards = [];
  lines.forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const term = parts.shift().trim();
      const definition = parts.join(":").trim();
      if (term && definition) {
        cards.push({ term, definition });
      }
    }
  });

  return cards.length > 0 ? cards : [...fallbackFlashcards];
};

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildQuiz = (cards) => {
  quizContainer.innerHTML = "";
  const questions = shuffle(cards).slice(0, Math.min(cards.length, 5));

  questions.forEach((card, index) => {
    const options = shuffle([
      card.definition,
      ...shuffle(cards)
        .filter((item) => item.term !== card.term)
        .slice(0, 3)
        .map((item) => item.definition),
    ]);

    const quizCard = document.createElement("div");
    quizCard.className = "quiz-card";

    const title = document.createElement("h3");
    title.textContent = `Q${index + 1}. ${card.term}`;

    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "quiz-options";

    options.forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.textContent = option;
      optionButton.addEventListener("click", () => {
        if (optionsWrapper.dataset.answered === "true") {
          return;
        }
        optionsWrapper.dataset.answered = "true";
        optionButton.classList.add(option === card.definition ? "correct" : "wrong");
        [...optionsWrapper.children].forEach((child) => {
          if (child.textContent === card.definition) {
            child.classList.add("correct");
          }
        });
      });
      optionsWrapper.appendChild(optionButton);
    });

    quizCard.append(title, optionsWrapper);
    quizContainer.appendChild(quizCard);
  });
};

const buildFlashcards = (cards) => {
  flashcardContainer.innerHTML = "";
  cards.forEach((card) => {
    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = "flashcard";
    wrapper.setAttribute("aria-label", `Flashcard ${card.term}`);

    const inner = document.createElement("div");
    inner.className = "flashcard-inner";

    const front = document.createElement("div");
    front.className = "flashcard-face front";
    front.innerHTML = `<strong>${card.term}</strong><span class="muted">Clique pour voir la définition</span>`;

    const back = document.createElement("div");
    back.className = "flashcard-face back";
    back.innerHTML = `<strong>Définition</strong><p>${card.definition}</p>`;

    inner.append(front, back);
    wrapper.appendChild(inner);

    wrapper.addEventListener("click", () => {
      wrapper.classList.toggle("is-flipped");
    });

    flashcardContainer.appendChild(wrapper);
  });
};

const generateAll = () => {
  const content = courseInput.value.trim();
  const cards = parseFlashcards(content);
  buildQuiz(cards);
  buildFlashcards(cards);
};

resetButton.addEventListener("click", () => {
  courseInput.value = defaultCourse;
  generateAll();
});

newQuizButton.addEventListener("click", () => {
  const cards = parseFlashcards(courseInput.value.trim());
  buildQuiz(cards);
});

generateAllButton.addEventListener("click", generateAll);

courseInput.value = defaultCourse;
window.addEventListener("load", generateAll);
