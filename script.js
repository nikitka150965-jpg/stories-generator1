// Переменные для хранения состояния
let currentTheme = '';
let currentStyle = 'minimal';
let currentText = '';
// AI Генерация изображений через Stable Diffusion API
async function generateAIImage(prompt) {
    try {
        // Бесплатный API - Lexica.art
        const response = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
            // Берем случайное изображение из результатов
            const randomImage = data.images[Math.floor(Math.random() * Math.min(data.images.length, 10))];
            return randomImage.src;
        }
    } catch (error) {
        console.log('Не удалось сгенерировать AI изображение, используем fallback');
    }
    
    // Fallback - градиенты based on prompt
    return generateGradientFromText(prompt);
}

// Создает градиент на основе текста
function generateGradientFromText(text) {
    const colors = [
        ['#ff6b6b', '#4ecdc4'],
        ['#45aaf2', '#a55eea'], 
        ['#fd9644', '#f7b731'],
        ['#2bcbba', '#26de81'],
        ['#a55eea', '#fc5c7d']
    ];
    
    const colorIndex = text.length % colors.length;
    return `linear-gradient(135deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`;
}

// Обновленная функция генерации текста с AI изображением
async function generateTextWithImage() {
    if (!currentTheme) {
        showNotification('❌ Сначала выбери тему!', 'error');
        return;
    }

    // Показываем загрузку
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<div class="loading"></div> Творим магию...';
    generateBtn.disabled = true;

    try {
        // Генерируем текст
        const themeTexts = getTextsForTheme(currentTheme);
        currentText = themeTexts[Math.floor(Math.random() * themeTexts.length)];
        
        // Генерируем AI изображение на основе текста
        const imagePrompt = `${currentText} ${getThemeKeywords(currentTheme)} aesthetic social media story`;
        const imageBackground = await generateAIImage(imagePrompt);
        
        // Обновляем превью с изображением
        updateStoryPreview(currentText, imageBackground);
        
        // Обновляем интерфейс
        document.getElementById('textOutput').textContent = currentText;
        document.querySelector('.download-btn').disabled = false;
        
        showNotification('🎨 Текст и визуал готовы!');
        
    } catch (error) {
        console.error('Ошибка генерации:', error);
        showNotification('⚠️ Что-то пошло не так, пробуем еще раз...', 'error');
    } finally {
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

// Ключевые слова для AI промптов
function getThemeKeywords(theme) {
    const keywords = {
        love: "romantic love relationship heart emotional tender intimate",
        study: "study learning education knowledge books academic focus", 
        motivation: "motivation inspiration success achievement goals determined",
        humor: "funny humor comedy meme laugh hilarious cartoon"
    };
    return keywords[theme] || "";
}

// Обновляем превью с фоном
function updateStoryPreview(text, background) {
    const preview = document.getElementById('storyPreview');
    const content = preview.querySelector('.story-content');
    
    // Устанавливаем фон
    if (background.startsWith('http')) {
        preview.style.backgroundImage = `url(${background})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
    } else {
        preview.style.backgroundImage = background;
    }
    
    content.innerHTML = `<p>${text}</p>`;
}
// Выбор темы
function selectTheme(theme) {
    console.log('Выбираем тему:', theme);
    currentTheme = theme;
    
    // Убираем подсветку со всех кнопок тем
    const allThemeButtons = document.querySelectorAll('.theme-btn');
    allThemeButtons.forEach(btn => {
        btn.style.background = 'rgba(255,255,255,0.2)';
        btn.style.border = '1px solid rgba(255,255,255,0.3)';
    });
    
    // Подсвечиваем выбранную кнопку
    event.target.style.background = 'linear-gradient(45deg, #ff6bd6, #9c50ff)';
    event.target.style.border = '1px solid #ff6bd6';
    
    // Показываем уведомление
    showNotification(`Тема "${getThemeName(theme)}" выбрана!`);
}

// Получение красивого названия темы
function getThemeName(theme) {
    const names = {
        love: 'Отношения',
        study: 'Учеба', 
        motivation: 'Мотивация',
        humor: 'Юмор'
    };
    return names[theme];
}

// Выбор стиля оформления
function selectStyle(style) {
    console.log('Выбираем стиль:', style);
    currentStyle = style;
    
    // Убираем активный класс со всех стилей
    const allStyleOptions = document.querySelectorAll('.style-option');
    allStyleOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранному стилю
    event.currentTarget.classList.add('active');
    
    // Обновляем превью
    const preview = document.getElementById('storyPreview');
    preview.className = `story-preview ${style}`;
}

// Генерация текста
function generateText() {
    console.log('Генерируем текст для темы:', currentTheme);
    
    if (!currentTheme) {
        showNotification('❌ Сначала выбери тему!', 'error');
        return;
    }

    // Показываем загрузку
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.textContent;
    generateBtn.innerHTML = '<div class="loading"></div> Генерируем...';
    generateBtn.disabled = true;

    // Имитируем загрузку (позже заменим на настоящую AI)
    setTimeout(() => {
        const texts = {
            love: [
                "Любовь — это когда его присутствие важнее твоего отсутствия 💖",
                "Настоящие чувства не гаснут с расстоянием 🌙",
                "Ты заслуживаешь любви, которая не заставляет гадать ✨",
                "Сердце знает дорогу к тому, кто ему нужен 🫂",
                "Любить — значит видеть в человеке все и принимать это 🌟"
            ],
            study: [
                "Каждая выученная тема — шаг к мечте 📚",
                "Учеба — это суперсилка будущего 💻",
                "Сегодняшние дедлайны — завтрашние достижения 🎯",
                "Знания — валюта, которая никогда не обесценится 💰",
                "Мозг, как мышца: чем больше тренируешь, тем сильнее становится 🧠"
            ],
            motivation: [
                "Ты сильнее, чем думаешь 🚀",
                "Маленькие шаги каждый день > одно большое усилие раз в год 🐢",
                "Будущий ты благодарен настоящему тебе 🙏",
                "Мечты не работают, пока не работаешь ты 💪",
                "Сегодня — идеальный день чтобы начать 🌈"
            ],
            humor: [
                "Мой мозг: 80% мемы, 15% тревога, 5% где ключи 🤪",
                "Настроение: хочу достижений, но не хочу двигаться 🛋️",
                "Внутри меня два волка: один хочет спать, другой тоже 🐺",
                "Моя суперсила — находить проблемы там, где их нет 🦸",
                "Отличный день чтобы отложить все на отличный завтрашний день 📅"
            ]
        };

        const themeTexts = texts[currentTheme];
        currentText = themeTexts[Math.floor(Math.random() * themeTexts.length)];
        
        // Обновляем текст на странице
        document.getElementById('textOutput').textContent = currentText;
        document.getElementById('previewText').textContent = currentText;
        
        // Возвращаем кнопку в нормальное состояние
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        // Активируем кнопку скачивания
        document.querySelector('.download-btn').disabled = false;
        
        showNotification('✅ Текст сгенерирован!');
        
    }, 800); // Задержка 0.8 секунды для реалистичности
}

// Скачивание сторис
function downloadStory() {
    console.log('Начинаем скачивание...');
    
    if (!currentText) {
        showNotification('❌ Сначала сгенерируй текст!', 'error');
        return;
    }

    const element = document.getElementById('storyPreview');
    const downloadBtn = document.querySelector('.download-btn');
    const originalText = downloadBtn.innerHTML;
    
    // Показываем загрузку
    downloadBtn.innerHTML = '<div class="loading"></div> Создаем...';
    downloadBtn.disabled = true;

    // Создаем изображение с помощью html2canvas
    html2canvas(element, {
        scale: 2, // Увеличиваем качество в 2 раза
        useCORS: true,
        backgroundColor: null,
        logging: false
    }).then(canvas => {
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        const timestamp = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
        link.download = `story-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        
        // Кликаем по ссылке чтобы скачать
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Возвращаем кнопку в исходное состояние
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        showNotification('✅ Story скачана! Проверь папку "Загрузки"');
        
    }).catch(error => {
        console.error('Ошибка при создании изображения:', error);
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        showNotification('❌ Ошибка при создании изображения. Попробуй еще раз.', 'error');
    });
}

// Показ уведомлений
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#25d366'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Добавляем CSS анимацию для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Генератор Stories загружен!');
    
    // Устанавливаем начальный текст
    document.getElementById('previewText').textContent = 'Твой текст появится здесь';
    
    // Делаем кнопку скачивания неактивной до генерации текста
    document.querySelector('.download-btn').disabled = true;
    
    // Автоматически выбираем первый стиль
    document.querySelector('.style-option').classList.add('active');
    
    showNotification('👋 Добро пожаловать в генератор Stories!');
});// Анимированное слайд-шоу
function createSlideShow(text) {
    const preview = document.getElementById('storyPreview');
    const content = preview.querySelector('.story-content');
    
    // Создаем контейнер для анимации
    content.innerHTML = `
        <div class="slide-container">
            <div class="slide active">${text}</div>
            <div class="slide">${getRelatedText(text)}</div>
            <div class="slide">🎉 Поделись с друзьями!</div>
        </div>
    `;
    
    // Запускаем анимацию
    let currentSlide = 0;
    const slides = content.querySelectorAll('.slide');
    
    const slideInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 2000);
    
    // Останавливаем через 6 секунд
    setTimeout(() => {
        clearInterval(slideInterval);
        slides[currentSlide].classList.remove('active');
        slides[0].classList.add('active');
    }, 6000);
}

// Добавь в CSS новые стили для анимации
const slideStyles = `
.slide-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 25px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.6;
}

.slide.active {
    opacity: 1;
    transform: translateY(0);
}
`;

// Вставляем стили в страницу
const styleElement = document.createElement('style');
styleElement.textContent = slideStyles;
document.head.appendChild(styleElement);