// ===== Переключение слайдов =====
function goToSlide(num) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById('slide' + num).classList.add('active');
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

// 👉 ЗДЕСЬ МЕНЯЕМ ПРАВИЛЬНЫЙ ОТВЕТ И КАРТИНКИ
const CORRECT_ANSWERS = ['прическа', 'причёска', 'стрижка', 'парикмахер', 'прическа'];
const IMG_WRONG = 'minion2.jpg';   // картинка при неверном ответе
const IMG_RIGHT = 'minion3.jpg';   // картинка при верном ответе

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

  if (answer === '') return; // пустой ввод — игнорируем

  // Проверка на правильный ответ
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
      // Попытки закончились — показываем кнопку перехода
      attemptsText.textContent = 'Попытки закончились 😅';
      showPopup(IMG_WRONG, () => {
        // Показываем кнопку "Дальше"
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

// Enter = нажать "Проверить"
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkGuess();
});

// ===== КАЛЕНДАРЬ НА СЛАЙДЕ 3 =====

// Доступные дни для записи (октябрь 2026)
const AVAILABLE_DAYS = [2, 3, 5, 6, 13, 14, 17, 18, 21, 22, 25, 26, 29, 30];

// Год и месяц, которые показываем (0 = январь, 9 = октябрь)
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

  // Сдвиг: в JS воскресенье = 0, у нас неделя с понедельника
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  // Пустые клетки до первого дня месяца
  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    calDays.appendChild(empty);
  }

  // Дни месяца
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.textContent = d;

    if (AVAILABLE_DAYS.includes(d)) {
      dayEl.classList.add('available');
      dayEl.addEventListener('click', () => pickDay(d));
    } else {
      dayEl.classList.add('unavailable');
      dayEl.addEventListener('click', () => unavailableDay());
    }

    calDays.appendChild(dayEl);
  }
}

function pickDay(day) {
  selectedDay = day;

  // Снять выделение со всех и выделить выбранный
  document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
  const allDays = document.querySelectorAll('.cal-day.available');
  allDays.forEach(el => {
    if (parseInt(el.textContent) === day) el.classList.add('selected');
  });

  calMessage.textContent = `Отличный выбор! 💛`;
  calNextBtn.style.display = 'none';

  // Показать финальное подтверждение
  selectedInfo.textContent = `Ты записана на ${day} октября 2026 🎉`;

  // Через 1.2 секунды — переход на финальный слайд
  setTimeout(() => {
    const finalText = document.getElementById('finalText');
    if (finalText) {
      finalText.textContent = `Ты записана на ${day} октября 2026. Жду тебя 💛`;
    }
    goToSlide(4);
  }, 1200);
}

function unavailableDay() {
  // Найти ближайший доступный день
  const nextAvailable = AVAILABLE_DAYS[0]; // по умолчанию первый из списка
  const formattedDate = `${nextAvailable} октября`;

  calMessage.textContent =
    `В этот день нет свободного времени.\nБлижайшая доступная дата: ${formattedDate}`;
  calMessage.style.whiteSpace = 'pre-line';

  calNextBtn.style.display = 'inline-block';
  calNextBtn.onclick = () => pickDay(nextAvailable);
}

// Кнопки перелистывания месяца (пока декабрь→январь, можно расширить)
document.getElementById('prevMonth').addEventListener('click', () => {
  calMessage.textContent = 'Показан только октябрь 🙂';
});
document.getElementById('nextMonth').addEventListener('click', () => {
  calMessage.textContent = 'Показан только октябрь 🙂';
});

// Первая отрисовка календаря
renderCalendar();