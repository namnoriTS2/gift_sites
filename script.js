// ===== Переключение слайдов =====
function goToSlide(num) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById('slide' + num).classList.add('active');

  if (num === 'B') initMemory();
  if (num === 'C') initReasons();
}

// ===== Убегающая кнопка "Нет" =====
const noBtn = document.getElementById('noBtn');

function moveButton() {
  const maxX = window.innerWidth * 0.35;
  const maxY = window.innerHeight * 0.35;
  const x = (Math.random() - 0.5) * 2 * maxX;
  const y = (Math.random() - 0.5) * 2 * maxY;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveButton();
});
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveButton();
});

// ===== Угадайка на слайде 2 =====

const CORRECT_ANSWERS = ['прическа', 'причёска', 'стрижка', 'парикмахер'];
const IMG_WRONG = 'minion2.jpg';
const IMG_RIGHT = 'minion3.jpg';

let attemptsLeft = 3;
let gameOver = false;

const input = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const attemptsText = document.getElementById('attemptsText');
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popupImg');

function showPopup(src, callback) {
  popupImg.src = src;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      if (callback) callback();
    }, 350);
  }, 1500);
}

function checkGuess() {
  if (gameOver) return;

  const answer = input.value.trim().toLowerCase();
  if (answer === '') return;

  const isCorrect = CORRECT_ANSWERS.includes(answer);

  if (isCorrect) {
    gameOver = true;
    checkBtn.disabled = true;
    input.disabled = true;

    showPopup(IMG_RIGHT, () => {
      goToSlide(3);
    });
  } else {
    attemptsLeft--;

    if (attemptsLeft > 0) {
      attemptsText.textContent = `Осталось попыток: ${attemptsLeft}`;
      showPopup(IMG_WRONG, () => {
        input.value = '';
        input.focus();
      });
    } else {
      attemptsText.textContent = 'Попытки закончились 😅';
      showPopup(IMG_WRONG, () => {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-yes';
        nextBtn.textContent = 'Дальше ➡️';
        nextBtn.style.marginTop = '15px';
        nextBtn.onclick = () => goToSlide(3);
        document.getElementById('slide2').appendChild(nextBtn);
      });
    }
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkGuess();
});

// ===== КАЛЕНДАРЬ НА СЛАЙДЕ 3 =====

const AVAILABLE_DAYS = [2, 3, 5, 6, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30];

const CAL_YEAR = 2026;
const CAL_MONTH = 9; // Октябрь

let selectedDay = null;

const calDays = document.getElementById('calDays');
const calMessage = document.getElementById('calMessage');
const calNextBtn = document.getElementById('calNextBtn');
const selectedInfo = document.getElementById('selectedInfo');
const monthLabel = document.getElementById('monthLabel');

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

function renderCalendar() {
  monthLabel.textContent = `${MONTH_NAMES[CAL_MONTH]} ${CAL_YEAR}`;
  calDays.innerHTML = '';

  const firstDay = new Date(CAL_YEAR, CAL_MONTH, 1);
  const daysInMonth = new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate();

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    calDays.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.textContent = d;

    if (AVAILABLE_DAYS.includes(d)) {
      dayEl.classList.add('available');
      dayEl.addEventListener('click', () => pickDay(d));
    } else {
      dayEl.classList.add('unavailable');
      dayEl.addEventListener('click', () => unavailableDay(d));
    }

    calDays.appendChild(dayEl);
  }
}

// Выбор доступного дня
function pickDay(day) {
  selectedDay = day;

  document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.cal-day.available').forEach(el => {
    if (parseInt(el.textContent) === day) el.classList.add('selected');
  });

  calMessage.textContent = 'Отличный выбор! 💛';
  calNextBtn.style.display = 'none';

  selectedInfo.textContent = `Ты выбрала ${day} октября 2026`;

  const btn = document.getElementById('toFinalBtn');
  if (btn) btn.style.display = 'inline-block';

  window.selectedDate = day;
}

// Клик по недоступному дню — ближайшая свободная дата
function unavailableDay(clickedDay) {
  // Ищем ближайший доступный день ПОСЛЕ нажатого
  let next = AVAILABLE_DAYS.find(d => d > clickedDay);
  if (!next) next = AVAILABLE_DAYS[0]; // если после нет — берём первый

  calMessage.style.whiteSpace = 'pre-line';
  calMessage.textContent =
    `В этот день нет свободного времени.\nБлижайшая доступная дата: ${next} октября`;

  calNextBtn.style.display = 'inline-block';
  calNextBtn.onclick = () => pickDay(next);
}

// Переход на финальный слайд
function goToFinal() {
  const finalText = document.getElementById('finalText');
  if (finalText && window.selectedDate) {
    finalText.textContent = `Ты выбрала дату ${window.selectedDate} октября 2026 💛`;
  }

  // Сначала показываем слайд — ссылка ещё скрыта
  const linkWrap = document.getElementById('finalLinkWrap');
  linkWrap.classList.remove('show');

  goToSlide(4);

  // Через 2 секунды плавно показываем кнопку записи
  setTimeout(() => {
    linkWrap.classList.add('show');
  }, 2000);
}
// Кнопки ‹ › (месяц пока один)
document.getElementById('prevMonth').addEventListener('click', () => {
  calMessage.textContent = 'Показан только октябрь 🙂';
});
document.getElementById('nextMonth').addEventListener('click', () => {
  calMessage.textContent = 'Показан только октябрь 🙂';
});

// Отрисовка календаря
renderCalendar();

// ===== СЛАЙД B: ИГРА НА ПАМЯТЬ =====

// Эмодзи для пар (6 пар = 12 карточек, сетка 4×3)
const MEMORY_ITEMS = ['💛', '🌸', '⭐', '🎀', '🍓', '🦋'];

let memoryState = {
  first: null,
  second: null,
  lock: false,
  matched: 0,
  initialized: false
};

const memoryGrid = document.getElementById('memoryGrid');
const memoryStatus = document.getElementById('memoryStatus');

function initMemory() {
  if (memoryState.initialized) return;
  memoryState.initialized = true;

  // Дублируем и перемешиваем
  const cards = [...MEMORY_ITEMS, ...MEMORY_ITEMS]
    .map(item => ({ item, id: Math.random() }))
    .sort(() => Math.random() - 0.5);

  memoryGrid.innerHTML = '';

  cards.forEach(({ item }) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.item = item;
    card.textContent = '?';
    card.addEventListener('click', () => flipCard(card));
    memoryGrid.appendChild(card);
  });

  memoryStatus.textContent = `Найдено пар: 0 / ${MEMORY_ITEMS.length}`;
}

function flipCard(card) {
  if (memoryState.lock) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.item;

  if (!memoryState.first) {
    memoryState.first = card;
  } else {
    memoryState.second = card;
    memoryState.lock = true;

    if (memoryState.first.dataset.item === memoryState.second.dataset.item) {
      // Пара найдена
      memoryState.first.classList.add('matched');
      memoryState.second.classList.add('matched');
      memoryState.matched++;

      memoryStatus.textContent =
        `Найдено пар: ${memoryState.matched} / ${MEMORY_ITEMS.length}`;

      resetMemoryPick();

      if (memoryState.matched === MEMORY_ITEMS.length) {
        memoryStatus.textContent = 'Ура! Все пары найдены 🎉';
        setTimeout(() => goToSlide('C'), 1200);
      }
    } else {
      // Не пара
      setTimeout(() => {
        memoryState.first.classList.remove('flipped');
        memoryState.second.classList.remove('flipped');
        memoryState.first.textContent = '?';
        memoryState.second.textContent = '?';
        resetMemoryPick();
      }, 800);
    }
  }
}

function resetMemoryPick() {
  memoryState.first = null;
  memoryState.second = null;
  memoryState.lock = false;
}

// ===== СЛАЙД C: ПРИЧИНЫ =====

const REASONS = [
  'За твою улыбка, что делает меня только счастилвее',
  'За твою заботу, которую ты даришь каждый день',
  'За твой юмор, мне правда смешно',
  'За твою красоту, что ослепляет меня каждый день',
  'За всё, что есть в тебе, ведь ты моя любовь'
];

let reasonsInitialized = false;

function initReasons() {
  if (reasonsInitialized) return;
  reasonsInitialized = true;

  const list = document.getElementById('reasonsList');
  list.innerHTML = '';

  REASONS.forEach((text, i) => {
    const el = document.createElement('div');
    el.className = 'reason';
    el.textContent = `Нажми, чтобы открыть причину №${i + 1} 💛`;
    el.dataset.opened = 'false';

    el.addEventListener('click', () => {
      if (el.dataset.opened === 'true') return;
      el.dataset.opened = 'true';
      el.classList.add('opened');
      el.textContent = text;

      checkAllReasonsOpened();
    });

    list.appendChild(el);
  });
}

function checkAllReasonsOpened() {
  const all = document.querySelectorAll('.reason');
  const opened = document.querySelectorAll('.reason.opened');
  if (all.length > 0 && all.length === opened.length) {
    document.getElementById('reasonsNextBtn').style.display = 'inline-block';
  }
}