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
const IMG_RIGHT = 'right.png';   // картинка при верном ответе

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