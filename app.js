const pdfInput = document.getElementById("pdf-input");
const statusEl = document.getElementById("status");
const extractedTextEl = document.getElementById("extracted-text");
const quizContainer = document.getElementById("quiz-container");
const flashcardContainer = document.getElementById("flashcard-container");
const demoButton = document.getElementById("demo-button");

const demoText = `La photosynthèse est le processus par lequel les plantes convertissent l'énergie solaire en énergie chimique.\n\nElle se déroule principalement dans les chloroplastes, où la chlorophylle capture la lumière.\n\nL'équation simplifiée est : 6 CO2 + 6 H2O + lumière → C6H12O6 + 6 O2.\n\nLes facteurs influençant la photosynthèse incluent l'intensité lumineuse, la concentration en CO2 et la température.`;

const keywords = ["est", "sont", "définit", "définir", "processus", "facteur", "inclut", "incluent", "se déroule", "principalement"]; 

const createFlashcards = (sentences) => {
  return sentences.slice(0, 6).map((sentence, index) => {
    const trimmed = sentence.trim();
    return {
      question: `Flashcard ${index + 1}: ${trimmed.split(" ").slice(0, 7).join(" ")}...?`,
      answer: trimmed,
    };
  });
};

const createQuiz = (sentences) => {
  const quizItems = [];
  const optionsPool = sentences.map((sentence) => sentence.trim()).filter(Boolean);

  sentences.slice(0, 4).forEach((sentence, index) => {
    const cleaned = sentence.trim();
    if (!cleaned) {
      return;
    }
    const keywordsFound = keywords.find((keyword) => cleaned.toLowerCase().includes(keyword));
    const question = keywordsFound
      ? `Que dit le cours à propos de "${keywordsFound}" ?`
      : `Complète cette idée : "${cleaned.split(" ").slice(0, 6).join(" ")}"`;

    const options = [cleaned];
    while (options.length < 3 && optionsPool.length > options.length) {
      const random = optionsPool[Math.floor(Math.random() * optionsPool.length)];
      if (!options.includes(random)) {
        options.push(random);
      }
    }
    quizItems.push({
      question: `Quiz ${index + 1}: ${question}`,
      options: options.sort(() => Math.random() - 0.5),
      answer: cleaned,
    });
  });

  return quizItems;
};

const renderFlashcards = (flashcards) => {
  flashcardContainer.innerHTML = "";
  flashcards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "flashcard";
    cardEl.innerHTML = `
      <div class="question">${card.question}</div>
      <div class="answer">${card.answer}</div>
    `;
    flashcardContainer.appendChild(cardEl);
  });
};

const renderQuiz = (quizItems) => {
  quizContainer.innerHTML = "";
  quizItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "quiz-card";
    const optionsHtml = item.options
      .map(
        (option, optionIndex) => `
        <label>
          <input type="radio" name="quiz-${index}" />
          <span>${String.fromCharCode(65 + optionIndex)}. ${option}</span>
        </label>
      `
      )
      .join("");
    card.innerHTML = `
      <h3>${item.question}</h3>
      <div class="quiz-options">
        ${optionsHtml}
      </div>
    `;
    quizContainer.appendChild(card);
  });
};

const processText = (text) => {
  const cleanedText = text.replace(/\s+/g, " ").trim();
  const sentences = cleanedText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);

  extractedTextEl.textContent = cleanedText || "Le PDF ne contient pas de texte exploitable.";
  if (!sentences.length) {
    quizContainer.innerHTML = '<div class="placeholder">Pas assez de contenu pour générer un quiz.</div>';
    flashcardContainer.innerHTML = '<div class="placeholder">Pas assez de contenu pour générer des flashcards.</div>';
    return;
  }

  const flashcards = createFlashcards(sentences);
  const quizItems = createQuiz(sentences);
  renderFlashcards(flashcards);
  renderQuiz(quizItems);
};

const readPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = Array.from({ length: pdf.numPages }, (_, index) => index + 1);
  const pageTexts = [];

  for (const pageNumber of pages) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    pageTexts.push(strings.join(" "));
  }

  return pageTexts.join(" ");
};

const handlePdf = async (file) => {
  statusEl.textContent = `Lecture de ${file.name}...`;
  try {
    const text = await readPdf(file);
    statusEl.textContent = `PDF chargé : ${file.name}`;
    processText(text);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Impossible de lire ce PDF. Essaie un autre fichier.";
  }
};

pdfInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  handlePdf(file);
});

demoButton.addEventListener("click", () => {
  statusEl.textContent = "Démo chargée.";
  processText(demoText);
});
