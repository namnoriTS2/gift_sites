// ===== Переключение слайдов =====
function goToSlide(num) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.getElementById('slide' + num).classList.add('active');
}

// ===== Убегающая кнопка "Нет" =====
const noBtn = document.getElementById('noBtn');

function moveButton() {
  // Случайное смещение
  const maxX = window.innerWidth * 0.35;
  const maxY = window.innerHeight * 0.35;

  const x = (Math.random() - 0.5) * 2 * maxX;
  const y = (Math.random() - 0.5) * 2 * maxY;

  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

// Убегает при наведении (ПК)
noBtn.addEventListener('mouseenter', moveButton);

// Убегает при касании (телефон)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveButton();
});

// На случай, если всё же умудрилась нажать
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveButton();
});