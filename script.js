const quizData = [
  {
    question: "Quelle est la fonction de la chaîne d'information appelée \"Acquérir\" ?",
    options: [
      "Transformer les grandeurs physiques en signaux exploitables",
      "Alimenter le système en énergie",
      "Commander la chaîne d'énergie",
      "Convertir un signal numérique en analogique"
    ],
    answer: 0
  },
  {
    question: "Une sortie TOR correspond à :",
    options: [
      "Un signal analogique continu",
      "Un signal numérique proportionnel",
      "Un signal binaire 0 ou 1",
      "Un signal en courant 4-20 mA"
    ],
    answer: 2
  },
  {
    question: "La sensibilité d'un capteur représente :",
    options: [
      "Le temps de réaction",
      "La variation de la sortie par rapport à la variation de l'entrée",
      "L'écart entre mesure et valeur vraie",
      "La plus petite variation détectable"
    ],
    answer: 1
  },
  {
    question: "La fidélité d'un capteur correspond à :",
    options: [
      "La répétabilité des mesures",
      "La linéarité",
      "L'étendue de mesure",
      "La conversion numérique"
    ],
    answer: 0
  },
  {
    question: "Un codeur absolu fournit :",
    options: [
      "Un signal TOR",
      "Un code numérique de position",
      "Une tension 0-10 V",
      "Un signal 4-20 mA"
    ],
    answer: 1
  },
  {
    question: "Quel est l'intérêt de l'hystérésis sur un capteur TOR ?",
    options: [
      "Augmenter la résolution",
      "Éviter les oscillations près du seuil",
      "Convertir un signal analogique",
      "Augmenter l'étendue de mesure"
    ],
    answer: 1
  },
  {
    question: "La formule de l'erreur relative est :",
    options: [
      "ε = x − X",
      "εr = ε / X",
      "εr = X / x",
      "ε = x + X"
    ],
    answer: 1
  },
  {
    question: "Un capteur analogique proportionnel délivre généralement :",
    options: [
      "Un code binaire",
      "Un signal continu proportionnel",
      "Uniquement des impulsions",
      "Un signal TOR"
    ],
    answer: 1
  }
];

const flashcards = [
  {
    front: "Définition d'un capteur",
    back: "Composant qui prélève une information issue d'une grandeur physique et fournit une sortie (souvent électrique) exploitable."
  },
  {
    front: "Étendue de mesure",
    back: "Intervalle des valeurs extrêmes qu'un capteur peut mesurer."
  },
  {
    front: "Résolution",
    back: "Plus petite variation de la grandeur mesurée que le capteur peut détecter."
  },
  {
    front: "Sensibilité",
    back: "Variation du signal de sortie rapportée à la variation du signal d'entrée."
  },
  {
    front: "Justesse vs fidélité",
    back: "Justesse = proximité de la valeur vraie. Fidélité = répétabilité des mesures."
  },
  {
    front: "Capteur TOR",
    back: "Capteur tout ou rien délivrant un signal binaire (0/1) avec souvent une hystérésis."
  },
  {
    front: "Exemples capteurs analogiques",
    back: "Jauge de contrainte, thermistance, accéléromètre capacitif."
  },
  {
    front: "Capteurs numériques",
    back: "Fournissent un code binaire (série ou parallèle), ex : codeur incrémental ou absolu."
  },
  {
    front: "Erreur absolue",
    back: "ε = x − X (écart entre mesure et valeur vraie)."
  },
  {
    front: "Erreur relative",
    back: "εr = ε / X (souvent exprimée en %)."
  }
];

const quizList = document.getElementById("quiz-list");
const quizTotal = document.getElementById("quiz-total");
const quizProgress = document.getElementById("quiz-progress");
const quizScore = document.getElementById("quiz-score");
const quizFeedback = document.getElementById("quiz-feedback");
const checkButton = document.getElementById("check-answers");
const resetButton = document.getElementById("reset-quiz");

const flashcard = document.getElementById("flashcard");
const flashcardFront = document.getElementById("flashcard-front");
const flashcardBack = document.getElementById("flashcard-back");
const flashcardIndex = document.getElementById("flashcard-index");
const flashcardTotal = document.getElementById("flashcard-total");
const prevCard = document.getElementById("prev-card");
const nextCard = document.getElementById("next-card");
const flipCard = document.getElementById("flip-card");

let currentCard = 0;

const renderQuiz = () => {
  quizList.innerHTML = "";
  quizTotal.textContent = quizData.length;
  quizProgress.textContent = 0;
  quizScore.textContent = 0;
  quizFeedback.textContent = "";

  quizData.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "quiz-item";
    const title = document.createElement("p");
    title.innerHTML = `<strong>Q${index + 1}.</strong> ${item.question}`;

    const options = document.createElement("div");
    options.className = "quiz-options";

    item.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      label.innerHTML = `
        <input type="radio" name="question-${index}" value="${optionIndex}" />
        <span>${option}</span>
      `;
      options.appendChild(label);
    });

    container.appendChild(title);
    container.appendChild(options);
    quizList.appendChild(container);
  });
};

const updateProgress = () => {
  const answered = document.querySelectorAll(".quiz-item input:checked").length;
  quizProgress.textContent = answered;
};

const scoreQuiz = () => {
  let score = 0;
  const questions = document.querySelectorAll(".quiz-item");
  questions.forEach((question, index) => {
    const selected = question.querySelector("input:checked");
    if (selected) {
      if (Number(selected.value) === quizData[index].answer) {
        score += 1;
        question.style.borderColor = "#22c55e";
        question.style.background = "#f0fdf4";
      } else {
        question.style.borderColor = "#ef4444";
        question.style.background = "#fef2f2";
      }
    } else {
      question.style.borderColor = "#f59e0b";
      question.style.background = "#fffbeb";
    }
  });

  quizScore.textContent = score;
  quizFeedback.textContent = `Tu as obtenu ${score}/${quizData.length} bonnes réponses.`;
};

const resetQuiz = () => {
  renderQuiz();
};

const renderFlashcard = () => {
  const card = flashcards[currentCard];
  flashcardFront.textContent = card.front;
  flashcardBack.textContent = card.back;
  flashcardIndex.textContent = currentCard + 1;
  flashcardTotal.textContent = flashcards.length;
  flashcard.classList.remove("is-flipped");
};

quizList.addEventListener("change", updateProgress);
checkButton.addEventListener("click", scoreQuiz);
resetButton.addEventListener("click", resetQuiz);

flipCard.addEventListener("click", () => {
  flashcard.classList.toggle("is-flipped");
});

flashcard.addEventListener("click", () => {
  flashcard.classList.toggle("is-flipped");
});

prevCard.addEventListener("click", () => {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  renderFlashcard();
});

nextCard.addEventListener("click", () => {
  currentCard = (currentCard + 1) % flashcards.length;
  renderFlashcard();
});

renderQuiz();
renderFlashcard();

window.addEventListener("load", updateProgress);
