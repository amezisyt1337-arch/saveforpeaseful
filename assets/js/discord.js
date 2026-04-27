// Ждем, пока весь HTML-документ будет загружен и разобран
document.addEventListener('DOMContentLoaded', () => {

    // 1. ОПРЕДЕЛЯЕМ ДАННЫЕ
    // Исправлено: оставляем одно объявление с нужным ID
    const userId = "1258876531611275404";
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

    // 2. ПОЛУЧАЕМ ССЫЛКИ НА HTML-ЭЛЕМЕНТЫ
    const profilePicture = document.getElementById('profile-picture');
    const avatarFrame = document.getElementById('avatar-frame');

    // Простая проверка: если элементов нет на странице, останавливаем скрипт
    if (!profilePicture || !avatarFrame) {
        console.error('Не найдены элементы #profile-picture или #avatar-frame на странице. Скрипт остановлен.');
        return;
    }

    // Скрываем рамку по умолчанию, пока не узнаем, есть ли она у пользователя
    avatarFrame.style.display = 'none';

    // 3. ДЕЛАЕМ ЗАПРОС К API
    fetch(apiUrl)
        .then(response => {
            // Проверяем, успешен ли ответ сервера (статус 200–299)
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Ответ API:", data); // Для отладки

            // 4. УСТАНАВЛИВАЕМ АВАТАР
            // Берем ссылку из данных или ставим заглушку по умолчанию
            const avatarUrl = data.avatar?.link || './assets/pfp/default.jpg';
            profilePicture.src = avatarUrl;
            // Обработка ошибки загрузки аватарки
            profilePicture.onerror = () => {
                console.warn("Не удалось загрузить аватар по ссылке:", avatarUrl);
                profilePicture.src = './assets/pfp/default.jpg'; // Запасной вариант
            };

            // 5. УСТАНАВЛИВАЕМ РАМКУ (avatar decoration)
            // Используем опциональную цепочку (?.) для безопасного доступа к вложенным свойствам
            const assetName = data.avatar_decoration?.asset;

            if (assetName) {
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${assetName}.png`;
                console.log("URL рамки:", frameUrl);

                avatarFrame.src = frameUrl;
                avatarFrame.style.display = 'block'; // Показываем рамку
                avatarFrame.onerror = () => {
                    // Если рамка не загрузилась, скрываем элемент
                    console.warn("Не удалось загрузить рамку:", frameUrl);
                    avatarFrame.style.display = 'none';
                };
            } else {
                console.log("У этого пользователя нет рамки для аватара.");
            }
        })
        .catch(error => {
            console.error("Ошибка при получении данных пользователя:", error);
            // Здесь можно показать пользователю сообщение об ошибке на странице
        });
});