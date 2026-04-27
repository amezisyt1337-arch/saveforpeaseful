document.addEventListener('DOMContentLoaded', function() {
  var videoBackground = document.getElementById('myVideo');
  var audioBackground = document.getElementById('myAudio');
  var blurredBox = document.getElementById('blurred-box');
  var enterOverlay = document.getElementById('enter-overlay');

  // Скрываем контент и видео до клика
  blurredBox.style.display = 'none';
  videoBackground.style.display = 'none';

  // Обработчик клика для входа
  function enterSite() {
    // Показываем видео и контент
    videoBackground.style.display = 'block';
    blurredBox.style.display = 'block';

    // Скрываем оверлей с анимацией
    enterOverlay.classList.add('hidden');

    // Устанавливаем громкость
    if (audioBackground) {
      audioBackground.volume = 0.1;
    }

    // Запускаем видео (без звука — это разрешено браузерами)
    videoBackground.play().catch(e => console.log('Видео не запустилось:', e));

    // Запускаем аудио
    if (audioBackground) {
      audioBackground.play().catch(e => {
        console.log('Аудио заблокировано браузером, ожидаем взаимодействия...');
      });
    }

    // Убираем обработчики
    document.removeEventListener('click', enterSite);
    document.removeEventListener('keydown', enterSite);
  }

  // Ждём клик для входа
  document.addEventListener('click', enterSite);
  document.addEventListener('keydown', enterSite);
});