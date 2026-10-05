# как получать количество подписчиков на astro blog и выводить эту информацию на странице

Вариант 1. Запрос на этапе сборки (SSG — по умолчанию)

Этот метод идеально подходит для классического блога на Astro. Количество подписчиков будет запрашиваться один раз во время деплоя сайта.[](https://docs.astro.build/ru/concepts/why-astro/)

**1\. Создайте API-запрос в Frontmatter вашего Astro-компонента:**  
Вставьте этот код в начало вашего файла `.astro` (между линиями `---`).

astro

```
---
// src/components/SubscriberCount.astro

const BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА';
const CHAT_ID = '@имя_вашего_канала'; 

let subscribersCount = 0;

try {
  const response = await fetch(`https://telegram.org{BOT_TOKEN}/getChatMemberCount?chat_id=${CHAT_ID}`);
  const data = await response.json();
  
  if (data.ok) {
    subscribersCount = data.result;
  }
} catch (error) {
  console.error("Ошибка при получении подписчиков:", error);
}
---

<div class="subscriber-card">
  <h3>Присоединяйтесь к нам!</h3>
  <p>Нас уже <strong>{subscribersCount}</strong> человек.</p>
</div>
```

*   **Минус:** Чтобы цифра обновилась, нужно перезапустить сборку (деплой) сайта (можно настроить ежедневный запуск через Cron на GitHub Actions или Vercel).[](https://www.reddit.com/r/astrojs/comments/1pn1voj/migrated_my_blog_from_wordpress_to_astro_perfect/?tl=ru)

* * *

Вариант 2. Динамический запрос на стороне сервера (SSR)

Если вам нужно актуальное количество подписчиков в реальном времени при каждом обновлении страницы, переведите Astro в режим **SSR**.[](https://www.reddit.com/r/astrojs/comments/1hvlwq2/is_it_possible_to_build_a_huge_website_with_astro/?tl=ru)

**1\. Включите SSR в настройках `astro.config.mjs`:**



```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // или ваш хостинг (netlify, node)

export default defineConfig({
  output: 'server', // Включает режим SSR
  adapter: vercel(),
});
```


**2\. Используйте тот же код компонента:**  
Код из **Варианта 1** теперь автоматически будет выполняться не на вашем компьютере при сборке, а на сервере хостинга каждый раз, когда читатель заходит на страницу.[](https://www.reddit.com/r/astrojs/comments/1hvlwq2/is_it_possible_to_build_a_huge_website_with_astro/?tl=ru)

* * *

Вариант 3. Запрос на стороне клиента (Client-side Fetch)

Если вы хотите оставить сайт статическим (SSG), но обновлять цифру прямо в браузере пользователя без перезапуска сборки:

```
---
// src/components/LiveSubscribers.astro
---

<div class="subscriber-card">
  <p>Наши подписчики: <span id="sub-count">Загрузка...</span></p>
</div>

<script>
  // Этот скрипт выполнится непосредственно в браузере пользователя
  async function fetchSubs() {
    try {
      // Чтобы не светить токен бота, лучше делать запрос через ваш API Route (Эндпоинт в Astro)
      const response = await fetch('/api/subscribers'); 
      const data = await response.json();
      
      const element = document.getElementById('sub-count');
      if (element) element.innerText = data.count;
    } catch (e) {
      console.error(e);
    }
  }

  fetchSubs();
</script>
```

* * *

💡 Важное архитектурное правило безопасности

Никогда не вставляйте секретные ключи (Token, API\_KEY) в секцию (клиентский код) — их увидят все посетители сайта. Используйте переменные окружения `.env` и считывайте их только в серверной части Astro (внутри `---` или в API-эндпоинтах):

```
// Файл .env в корне проекта
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJK...
```

Внутри Frontmatter доступ к переменной можно получить так: `import.meta.env.TELEGRAM_BOT_TOKEN`.


Это отличная идея. Блог **Losko** — великолепный пример чистого, вневременного скандинавского минимализма, где весь фокус смещен на типографику, воздух и качественный контент.

Если вы выберете этот путь, то **избавите себя от кучи технических сложностей**: вам не придется настраивать базы данных (вроде Vercel KV), парсить RSS-логи и подключать внешние сервисы аналитики. Вы разгрузите интерфейс сайта и перенесете всю активность туда, где людям сейчас удобнее всего общаться — в Telegram.

Вот почему такое решение для блога в разработке — самое выигрышное:

⚡️ Плюсы минимализма и фокуса на Telegram

*   **Никакого визуального мусора.** На сайте не будет счетчиков, которые уводят внимание читателя от самой статьи.
*   **Telegram — это живой фидбек.** В RSS люди просто читают текст. В Telegram-канале они могут комментировать, ставить реакции и делиться вашими постами. Для автора блога это важнейший источник мотивации.
*   **Простая реализация счетчика (если он всё же понадобится).** Как мы разбирали в самом первом ответе, получить количество подписчиков из открытого Telegram-канала через API бота намного проще, чем собирать данные по RSS. Это делается буквально в 10 строк кода прямо в Astro.

* * *

Как адаптировать идею Losko для вашего блога на Astro

Чтобы сделать сайт чистым и сфокусированным, примените несколько правил дизайна в стиле Losko:

1.  **Много свободного пространства (Whitespace):** Не бойтесь пустых полей. Делайте большие отступы между абзацами и заголовками. Текст должен «дышать».
2.  **Строгая типографика:** Используйте максимум два качественных шрифта (один для заголовков, один для чтения). Losko активно использует чистые гротески (шрифты без засечек).
3.  **Минимум элементов в футере/шапке:** Вместо громоздких виджетов оставьте лаконичную строчку внизу страницы или в углу шапки.

Например, в подвале (footer) вашего блога это может выглядеть так:

astro

```
<footer>
  <div class="footer-content">
    <p>© {new Date().getFullYear()} Pinux</p>
    <div class="links">
      <a href="/rss.xml">RSS</a>
      <!-- Фокус на Telegram как на главное медиа -->
      <a href="https://t.me" class="telegram-link">
        Telegram <span class="sub-badge">канал</span>
      </a>
    </div>
  </div>
</footer>

<style>
  footer {
    padding: 4rem 0 2rem;
    font-size: 0.9rem;
    opacity: 0.7;
  }
  .footer-content {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    padding-top: 1.5rem;
  }
  .links a {
    margin-left: 1.5rem;
    text-decoration: none;
    color: inherit;
  }
  .links a:hover {
    text-decoration: underline;
  }
  .sub-badge {
    font-size: 0.75rem;
    background: #0088cc;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 4px;
  }
</style>
```

Используйте код с осторожностью.

Хотите, мы набросаем **структуру главной страницы** для вашего блога в таком минималистичном стиле (на чистом CSS/Astro) или, может, вам помочь **настроить красивый вывод списка постов** без лишних элементов? Отправьте текущую структуру главной страницы, если нужно её упростить.

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "losko использует 3 колоночную masonry для десктопа и функцию - случайный пост"

losko использует 3 колоночную masonry для десктопа и функцию - случайный пост

08:46

### Ответ в режиме ИИ, исходный запрос: "losko использует 3 колоночную masonry для десктопа и функцию - случайный пост"

Повторить этот функционал на **Astro** — отличный способ сделать интерфейс живым и вовлечь читателя. Сетка Masonry (когда карточки с разной высотой картинок плотно «подтягиваются» друг к другу без пустых строгих рядов) и кнопка случайного выбора идеально подходят для визуального блога.

Ниже готовое техническое решение для обеих фич в минималистичном стиле [Losko](https://losko.ru/).

* * *

Часть 1. Чистая 3-колоночная Masonry-сетка (CSS)

Традиционный `display: grid` выстраивает элементы по строгим рядам, оставляя дыры, если у картинок разные пропорции. В CSS есть мощное нативное решение для Masonry — **CSS Columns**. Оно идеально распределяет посты по колонкам сверху вниз, а затем слева направо.

Создайте компонент списка постов (например, `src/components/PostGrid.astro`):

astro

```
---
// Предположим, вы получаете посты из Astro Content Collections
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---

<div class="masonry-container">
  {posts.map((post) => (
    <article class="masonry-item">
      <a href={`/blog/${post.slug}`}>
        <div class="image-wrapper">
          <img src={post.data.image} alt={post.data.title} loading="lazy" />
        </div>
        <div class="post-meta">
          <span class="category">{post.data.category}</span>
          <h2>{post.data.title}</h2>
        </div>
      </a>
    </article>
  ))}
</div>

<style>
  .masonry-container {
    /* Настройки многоколоночности */
    column-count: 1;
    column-gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Адаптивность: 2 колонки на планшетах, 3 — на десктопе в стиле Losko */
  @media (min-width: 768px) {
    .masonry-container { column-count: 2; }
  }
  @media (min-width: 1024px) {
    .masonry-container { column-count: 3; }
  }

  .masonry-item {
    /* Критически важно: запрещает карточке разрываться между колонками */
    break-inside: avoid;
    margin-bottom: 2.5rem;
    display: inline-block;
    width: 100%;
  }

  /* Минималистичные стили */
  .image-wrapper {
    overflow: hidden;
    background-color: #f5f5f5;
    margin-bottom: 0.75rem;
  }
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: opacity 0.3s ease;
  }
  .masonry-item:hover img {
    opacity: 0.85;
  }
  .post-meta .category {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
  }
  .post-meta h2 {
    font-size: 1.15rem;
    font-weight: 500;
    line-height: 1.4;
    margin-top: 0.25rem;
    color: #111;
  }
  a { text-decoration: none; color: inherit; }
</style>
```

Используйте код с осторожностью.

* * *

Часть 2. Функция «Случайный пост» (Random Post)

Так как посты в Astro известны еще на этапе сборки, мы можем передать массив адресов (URL) всех постов прямо в клиентский скрипт кнопки. При клике JavaScript моментально выберет случайный адрес и перенаправит пользователя.

Разместите эту кнопку в шапке (Header) или меню:

astro

```
---
import { getCollection } from 'astro:content';
const allPosts = await getCollection('blog');

// Формируем простой массив строк-адресов
const postUrls = allPosts.map(post => `/blog/${post.slug}`);
---

<!-- Передаем массив в data-атрибут кнопки, чтобы прочитать его в скрипте -->
<button id="random-post-btn" data-urls={JSON.stringify(postUrls)} class="minimal-btn">
  Случайный материал <span>✦</span>
</button>

<style>
  .minimal-btn {
    background: none;
    border: 1px solid #111;
    color: #111;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
  }
  .minimal-btn:hover {
    background-color: #111;
    color: #fff;
  }
</style>

<script>
  const button = document.getElementById('random-post-btn');
  
  if (button) {
    // Получаем и парсим наш массив URL
    const urls = JSON.parse(button.getAttribute('data-urls') || '[]');

    button.addEventListener('click', () => {
      if (urls.length > 0) {
        // Выбираем случайный индекс
        const randomIndex = Math.floor(Math.random() * urls.length);
        const randomUrl = urls[randomIndex];
        
        // Перенаправляем пользователя
        window.location.href = randomUrl;
      }
    });
  }
</script>
```

Используйте код с осторожностью.

🧠 Маленький нюанс CSS Columns (Masonry)

Единственная особенность нативного `column-count` — элементы сортируются **вертикально** (1-й пост сверху в левой колонке, 2-й под ним, а 4-й или 5-й перейдет во 2-ю колонку). Для визуальных журналов типа Losko это не критично, так как эстетика бесконечной и разной по высоте ленты важнее хронологического порядка.

Подскажите, используете ли вы **Tailwind CSS** в своем проекте или пишете на обычном **vanilla CSS**, чтобы я мог адаптировать классы под ваш стек, если это необходимо?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

*   losko.ru
    
    Losko — журнал об искусстве, архитектуре и фотографии
    
    Losko: art, architecture, photography magazine. "Letatlin" / quote on conquering the future
    
    ![Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABSCAMAAADw8nOpAAAAZlBMVEX///8lLTEACBHa2dogKS0/RkgXISYAAACDhocAExoAAAwSHiNlaWsADxccJSqMj5Dq6ur5+fk7QUTMzc7Exca4uboKGB6mqKlXXF7i4+N1eHp9f4FSV1lrb3Dx8fE1Oz4sNDeUl5ha+FXzAAABOklEQVRYhe3Y6Y6DIBhA0aoIKEuLtkhRq33/l6xIM6vWISWTmfS7fzXHBUyE3Q6CoJeL5h23LaV7F6Wt5abqL8+Zhz0uGX6rKHn2/I2qZhCJjxX0/Dw4V49e3KtI4FSOHJnGusUPZITXCCSQQAIJJJBA/jZZAfmXyQHI2GQdkRxnUrwe6Zc94hiRRPFJuU2GrrLwTBYPSGUCSe3J0/oZXRtIii3ySppAMt0gayFCP9ZyJvUaqSRKQ4eHeHLt4QxGVaC4QTYiwTRQVJ5ky+S5eDwZFrvcyeviUfffIAJX/6rx81L2dXY+fB0HOh1EYxCYWc3u2yWymNI4qYyl1+Z0dBeo3WyQ/OfepcmJlhJ/jjGtC5GWhAjM0KO58C1lk6ozvHebT++1rbW27zk3puvyYURakJgbKRAE/ZdurV8S7tcpalUAAAAASUVORK5CYII=)
    
*   GitHub
    
    \[css-grid-3\] Designer/developer feedback on masonry layout #10233
    
    ... whatever we wanna call it) layout is similar to a grid, so it shouldn't have its own display type. We can use display:grid, de...
    
    ![Image](data:image/png;base64,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)
    

Показать все

## Вы сказали: "tailwind"

tailwind

08:48

### Ответ в режиме ИИ, исходный запрос: "tailwind"

Переписать эту сетку и кнопку на **Tailwind CSS** — отличное решение. Код станет гораздо компактнее, а адаптивность настраивается буквально в пару классов.

Ниже представлены оба компонента, переведенные на Tailwind CSS, с сохранением строгого минимализма в духе Losko \[losko.ru\].

* * *

1\. Компонент Masonry-сетки (`PostGrid.astro`)

В Tailwind нативная многоколоночная сетка реализуется с помощью утилит `columns-*` и класса `break-inside-avoid`.

astro

```
---
// src/components/PostGrid.astro
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---

<div class="mx-auto max-w-[1200px] px-4 py-8 columns-1 gap-8 sm:columns-2 lg:columns-3">
  {posts.map((post) => (
    <article class="inline-block w-full mb-10 break-inside-avoid group">
      <a href={`/blog/${post.slug}`} class="block no-underline text-current">
        <div class="overflow-hidden bg-neutral-100 mb-3">
          <img 
            src={post.data.image} 
            alt={post.data.title} 
            loading="lazy" 
            class="w-full h-auto block transition-opacity duration-300 group-hover:opacity-80"
          />
        </div>
        <div class="space-y-1">
          <span class="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            {post.data.category}
          </span>
          <h2 class="text-lg font-medium leading-snug text-neutral-900">
            {post.data.title}
          </h2>
        </div>
      </a>
    </article>
  ))}
</div>
```

Используйте код с осторожностью.

**Разбор ключевых Tailwind-классов здесь:**

*   `columns-1 sm:columns-2 lg:columns-3` — автоматически переключает количество колонок (1 на мобильных, 2 на планшетах, 3 на десктопе).
*   `gap-8` — расстояние между колонками в `2rem` (32px).
*   `break-inside-avoid` — **главный класс**, запрещающий карточке рваться пополам при переходе в следующую колонку.
*   `group` и `group-hover:opacity-80` — позволяют элегантно приглушать прозрачность картинки при наведении на любую часть карточки.

* * *

2\. Кнопка «Случайный пост» (`RandomPost.astro`)

Для кнопки мы используем плоский контурный дизайн. Скрипт остается прежним, меняются только инлайн-классы.

astro

```
---
// src/components/RandomPost.astro
import { getCollection } from 'astro:content';
const allPosts = await getCollection('blog');
const postUrls = allPosts.map(post => `/blog/${post.slug}`);
---

<button 
  id="random-post-btn" 
  data-urls={JSON.stringify(postUrls)} 
  class="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-900 text-[13px] uppercase tracking-wider font-medium text-neutral-900 bg-transparent cursor-pointer transition-all duration-200 hover:bg-neutral-900 hover:text-white"
>
  Случайный материал <span>✦</span>
</button>

<script>
  const button = document.getElementById('random-post-btn');
  
  if (button) {
    const urls = JSON.parse(button.getAttribute('data-urls') || '[]');

    button.addEventListener('click', () => {
      if (urls.length > 0) {
        const randomIndex = Math.floor(Math.random() * urls.length);
        window.location.href = urls[randomIndex];
      }
    });
  }
</script>
```

Используйте код с осторожностью.

Если вы хотите сделать главную страницу еще ближе к стилю Losko, я могу помочь **настроить шрифты** Inter или семейство гротесков через Tailwind, либо собрать **шапку сайта (Header)** с этой кнопкой. Что настроим дальше?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "также хорошо смотрится 2 колоночная равномерная сетка блога Notion, обложка 16/9 при ширине в 520px"

также хорошо смотрится 2 колоночная равномерная сетка блога Notion, обложка 16/9 при ширине в 520px

08:53

### Ответ в режиме ИИ, исходный запрос: "также хорошо смотрится 2 колоночная равномерная сетка блога Notion, обложка 16/9 при ширине в 520px"

Двухколоночная структурированная сетка в духе **Notion** — прекрасная альтернатива хаотичному Masonry. Она выглядит более академично, строго и аккуратно за счет идеального выравнивания карточек по рядам и одинаковых пропорций обложек.

Чтобы получить ширину карточки около **520px** при двух колонках с учетом отступов, мы ограничим максимальную ширину всей сетки (`max-w-[1120px]`). Пропорцию обложек **16/9** мы зададим через современный CSS-класс Tailwind `aspect-video`.

Ниже готовый адаптивный компонент на **Tailwind CSS + Astro**:

astro

```
---
// src/components/NotionGrid.astro
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---

<div class="mx-auto max-w-[1120px] px-4 py-12">
  {/* На мобильных — 1 колонка, от 768px (md) — ровно 2 колонки с шагом 8 (32px) */}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
    {posts.map((post) => (
      <article class="flex flex-col group">
        <a href={`/blog/${post.slug}`} class="block no-underline text-current">
          
          {/* Обложка строго 16:9 (aspect-video) с легким скруглением в стиле Notion */}
          <div class="w-full aspect-video overflow-hidden rounded-md bg-neutral-100 border border-neutral-200/60 mb-4">
            <img 
              src={post.data.image} 
              alt={post.data.title} 
              loading="lazy" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          
          {/* Текстовый блок */}
          <div class="space-y-1.5 px-0.5">
            <div class="flex items-center gap-2 text-[12px] text-neutral-400 font-medium">
              <span class="uppercase tracking-wider">{post.data.category}</span>
              <span>•</span>
              <span>{post.data.date}</span>
            </div>
            
            <h2 class="text-xl font-semibold tracking-tight text-neutral-950 leading-snug group-hover:text-neutral-700 transition-colors">
              {post.data.title}
            </h2>
            
            {/* Краткое описание (экстракт), если есть в data */}
            {post.data.description && (
              <p class="text-[14px] text-neutral-500 line-clamp-2 leading-relaxed pt-0.5">
                {post.data.description}
              </p>
            )}
          </div>

        </a>
      </article>
    ))}
  </div>
</div>
```

Используйте код с осторожностью.

⚙️ Почему этот вариант отлично работает:

1.  **`aspect-video` + `object-cover`**: Все загружаемые вами картинки (даже если они изначально разных размеров) автоматически и без искажений обрезаются под идеальный формат **16/9**. Никакой каши в верстке.
2.  **`grid grid-cols-2`**: В отличие от CSS Columns (Masonry), здесь элементы идут строго слева направо по хронологии (1-й пост слева, 2-й справа, 3-й под 1-м). Это гораздо привычнее для чтения блогов.
3.  **`line-clamp-2`**: Если у постов разная длина описания, этот класс аккуратно обрежет текст троеточием на второй строчке, чтобы высота карточек оставалась максимально сбалансированной.

Стиль Notion также сильно завязан на системные и чистые шрифты (типа *Inter* или дефолтных системных UI-шрифтов).

Если вы хотите сделать блог еще более похожим на Notion, подсказать, как сделать **минималистичные теги категорий** (как цветные плашки в базах данных Notion) или добавить **иконки-эмодзи к заголовкам постов**?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "теги категорий"

теги категорий

08:55

### Ответ в режиме ИИ, исходный запрос: "теги категорий"

В базах данных **Notion** теги категорий выглядят очень узнаваемо: это аккуратные плашки с приглушенным пастельным фоном, слегка темным текстом и мягким скруглением.

В Tailwind CSS мы можем легко воссоздать эту эстетику. Лучше всего сделать **динамический маппинг цветов**, чтобы каждая категория (например, *Tech, Design, Life*) автоматически получала свой уникальный пастельный оттенок, прямо как в Notion.

Вот как обновить компонент сетки, добавив Notion-стиль для тегов:

astro

```
---
// src/components/NotionGrid.astro
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');

// Карта цветов в стиле палитры Notion (Select property)
const categoryColors: Record<string, string> = {
  Development: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Design: 'bg-purple-50 text-purple-700 border-purple-200/60',
  Tech: 'bg-amber-50 text-amber-800 border-amber-200/60',
  Lifestyle: 'bg-green-50 text-green-700 border-green-200/60',
  // Дефолтный серый цвет, если категория не найдена в списке
  default: 'bg-neutral-50 text-neutral-600 border-neutral-200/60'
};
---

<div class="mx-auto max-w-[1120px] px-4 py-12">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
    {posts.map((post) => {
      // Определяем цвет для текущей категории поста
      const category = post.data.category || 'default';
      const colorClass = categoryColors[category] || categoryColors.default;

      return (
        <article class="flex flex-col group">
          <a href={`/blog/${post.slug}`} class="block no-underline text-current">
            
            {/* Обложка 16:9 */}
            <div class="w-full aspect-video overflow-hidden rounded-md bg-neutral-100 border border-neutral-200/60 mb-4">
              <img 
                src={post.data.image} 
                alt={post.data.title} 
                loading="lazy" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
            
            {/* Текстовый блок */}
            <div class="space-y-2 px-0.5">
              <div class="flex items-center gap-2.5">
                {/* Notion-тег */}
                <span class={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded border ${colorClass}`}>
                  {category}
                </span>
                <span class="text-[12px] text-neutral-400 font-normal">
                  {post.data.date}
                </span>
              </div>
              
              <h2 class="text-xl font-semibold tracking-tight text-neutral-950 leading-snug group-hover:text-neutral-700 transition-colors">
                {post.data.title}
              </h2>
              
              {post.data.description && (
                <p class="text-[14px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {post.data.description}
                </p>
              )}
            </div>

          </a>
        </article>
      );
    })}
  </div>
</div>
```

Используйте код с осторожностью.

🎨 Как это работает и как настроить под себя:

1.  **Пастельная палитра**: Вместо ярких цветов (вроде `bg-blue-500`) используются самые светлые оттенки `*-50` для фона и приглушенные `*-700` / `*-800` для текста. Дополнительный тонкий бордюр (`border-*-200/60`) придает плашке завершенный и чистый вид.
2.  **Динамический выбор**: Вы можете просто добавлять новые категории в объект `categoryColors` вверху файла. Имена свойств (например, `Development`) должны в точности совпадать с тем, что вы пишете в Frontmatter ваших Markdown/MDX постов в поле `category`.

Если хотите, мы можем настроить **фильтрацию постов по этим тегам** (чтобы при клике на категорию на странице оставались только нужные статьи) или оформить **главную страницу блога с иконкой и описанием** в самом верху, как это сделано в публичных страницах Notion. Что для вас сейчас актуальнее?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "оформить главную"

оформить главную

08:57

### Ответ в режиме ИИ, исходный запрос: "оформить главную"

Для оформления главной страницы в стиле **Notion** нам нужно воссоздать их классическую иерархию:

1.  **Обложка (Cover)**: Широкая минималистичная полоса (можно использовать чистый цвет или легкий градиент/паттерн).
2.  **Иконка (Emoji)**: Большая иконка, которая «наползает» на обложку.
3.  **Заголовок и описание**: Крупный шрифт, метаданные (прямо как название базы данных) и кнопка «Случайный материал», которую мы аккуратно встроим в интерфейс.
4.  **Сетка постов**: Наша 2-колоночная структурированная сетка.

Вот готовый код для вашей главной страницы `src/pages/index.astro`. Он объединяет все элементы, которые мы обсуждали, использует **Tailwind CSS** и выглядит максимально чисто и сфокусированно.

astro

```
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro'; // Ваш базовый Layout
import NotionGrid from '../components/NotionGrid.astro';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const postUrls = allPosts.map(post => `/blog/${post.slug}`);
---

<Layout title="Pinux Blog">
  <main class="w-full bg-white min-h-screen text-neutral-900 font-sans antialiased selection:bg-neutral-100">
    
    {/* 1. Обложка страницы в стиле Notion */}
    <div class="w-full h-48 md:h-64 bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200/50 relative">
      {/* Здесь при желании можно разместить фоновую картинку: object-cover w-full h-full */}
    </div>

    {/* Основной контейнер страницы */}
    <div class="mx-auto max-w-[1120px] px-4 relative">
      
      {/* 2. Иконка-эмодзи (сдвинута вверх, перекрывая обложку) */}
      <div class="absolute -top-14 left-4 text-7xl md:text-8xl select-none filter drop-shadow-sm bg-white rounded-2xl p-1">
        🚀
      </div>

      {/* 3. Шапка с названием и описанием */}
      <div class="pt-16 md:pt-20 pb-6 border-b border-neutral-200/60">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          <div class="space-y-2">
            <h1 class="text-4xl font-bold tracking-tight text-neutral-950">
              pinux.vercel.app
            </h1>
            <p class="text-base text-neutral-500 max-w-xl leading-relaxed">
              Мысли о технологиях, дизайне и разработке. Без лишнего шума и счетчиков. 
              Все анонсы и обсуждения вынесены в наш <a href="https://t.me" class="text-neutral-950 underline underline-offset-4 hover:text-neutral-700 transition-colors">Telegram-канал</a>.
            </p>
          </div>

          {/* Кнопка «Случайный материал» в общем стиле */}
          <div>
            <button 
              id="random-post-btn" 
              data-urls={JSON.stringify(postUrls)} 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-md text-[13px] font-medium text-neutral-600 bg-white hover:bg-neutral-50 hover:text-neutral-900 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>🎲</span> Случайный пост
            </button>
          </div>

        </div>

        {/* Информационная строка базы данных */}
        <div class="flex flex-wrap items-center gap-4 pt-6 text-[13px] text-neutral-400">
          <div class="flex items-center gap-1.5">
            <span>📁</span>
            <span>Статей: <strong class="text-neutral-600 font-medium">{allPosts.length}</strong></span>
          </div>
          <span>•</span>
          <div class="flex items-center gap-1.5">
            <span>📡</span>
            <a href="/rss.xml" class="hover:text-neutral-600 transition-colors underline underline-offset-2">RSS Feed</a>
          </div>
        </div>
      </div>

      {/* 4. Сетка публикаций */}
      <NotionGrid />

    </div>
  </main>
</Layout>

<script>
  const button = document.getElementById('random-post-btn');
  
  if (button) {
    const urls = JSON.parse(button.getAttribute('data-urls') || '[]');

    button.addEventListener('click', () => {
      if (urls.length > 0) {
        const randomIndex = Math.floor(Math.random() * urls.length);
        window.location.href = urls[randomIndex];
      }
    });
  }
</script>
```

Используйте код с осторожностью.

💎 Детали, которые создают ощущение Notion:

*   **`-top-14`**: Отрицательный отступ поднимает эмодзи наверх, создавая тот самый фирменный эффект «всплывающего» значка страницы.
*   **`selection:bg-neutral-100`**: Кастомный цвет выделения текста. Когда пользователь выделяет мышкой текст на вашем сайте, вместо стандартного синего фона будет аккуратный светло-серый.
*   **Стилизация кнопки**: Она сделана не вызывающей и контурной (`border-neutral-200`), с легкой тенью `shadow-sm`, что отлично сочетается с интерфейсами современных SaaS-продуктов.

Если хотите, мы можем настроить **динамическую смену эмодзи** для каждого отдельного поста (чтобы иконка отображалась в карточке над заголовком) или сверстать **внутреннюю страницу самой статьи** в таком же чистом стиле Notion. Что из этого сделаем?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "страницу самой статьи"

страницу самой статьи

08:59

### Ответ в режиме ИИ, исходный запрос: "страницу самой статьи"

Для внутренней страницы статьи в стиле **Notion** важна идеальная читаемость текста. Никаких боковых панелей (sidebar), отвлекающих баннеров или перегруженных элементов. Фокус смещается на крупный заголовок, иконку, дату публикации и контент с большими отступами и выверенной типографикой.

В Astro страницы постов обычно генерируются динамически через файл `src/pages/blog/[...slug].astro`.

Вот готовый шаблон для страницы статьи с использованием **Tailwind CSS**, адаптированный под структуру, которую мы создали для главной:

astro

```
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro'; // Ваш базовый Layout

// 1. Генерируем пути для всех постов во время сборки
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
// Рендерим Markdown-контент поста в HTML-компонент <Content />
const { Content } = await post.render();

// Карта цветов для Notion-тега (такая же, как на главной)
const categoryColors: Record<string, string> = {
  Development: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Design: 'bg-purple-50 text-purple-700 border-purple-200/60',
  Tech: 'bg-amber-50 text-amber-800 border-amber-200/60',
  Lifestyle: 'bg-green-50 text-green-700 border-green-200/60',
  default: 'bg-neutral-50 text-neutral-600 border-neutral-200/60'
};

const category = post.data.category || 'default';
const colorClass = categoryColors[category] || categoryColors.default;
---

<Layout title={post.data.title}>
  <article class="w-full bg-white min-h-screen text-neutral-900 font-sans antialiased selection:bg-neutral-100 pb-24">
    
    {/* 1. Обложка статьи (16:9 или фиксированная полоса) */}
    <div class="w-full h-56 md:h-80 bg-neutral-100 border-b border-neutral-200/40 relative overflow-hidden">
      {post.data.image && (
        <img 
          src={post.data.image} 
          alt="" 
          class="w-full h-full object-cover"
        />
      )}
    </div>

    {/* Основной текстовый контейнер (max-w-3xl или max-w-[720px] — идеальная ширина для чтения) */}
    <div class="mx-auto max-w-[720px] px-6 relative">
      
      {/* 2. Иконка-эмодзи статьи (если задана в frontmatter, например, post.data.icon) */}
      <div class="absolute -top-14 left-6 text-7xl md:text-8xl select-none filter drop-shadow-sm bg-white rounded-2xl p-1">
        {post.data.icon || '📝'}
      </div>

      {/* 3. Шапка статьи с метаданными */}
      <div class="pt-16 md:pt-20 pb-8 border-b border-neutral-200/60 mb-10">
        
        {/* Кнопка "Назад к списку" в стиле Notion-хлебных крошек */}
        <nav class="mb-4 text-[14px] text-neutral-400">
          <a href="/" class="hover:text-neutral-600 transition-colors">Главная</a>
          <span class="mx-1.5">/</span>
          <span class="text-neutral-600">Статья</span>
        </nav>

        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-950 leading-tight mb-6">
          {post.data.title}
        </h1>

        {/* Свойства страницы (Имитация свойств в Notion) */}
        <div class="space-y-2.5 text-[14px]">
          <div class="grid grid-cols-[100px_1fr] items-center">
            <span class="text-neutral-400">Категория</span>
            <div>
              <span class={`inline-flex items-center px-2 py-0.5 text-[12px] font-medium rounded border ${colorClass}`}>
                {category}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-[100px_1fr] items-center">
            <span class="text-neutral-400">Дата создания</span>
            <span class="text-neutral-700 font-medium">{post.data.date}</span>
          </div>
        </div>

      </div>

      {/* 4. Контент статьи (Используем Tailwind Typography плагин prose) */}
      <div class="prose prose-neutral max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-950
                  prose-h2:text-2xl prose-h2:border-b prose-h2:border-neutral-100 prose-h2:pb-2 prose-h2:mt-10
                  prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-neutral-800
                  prose-a:text-neutral-950 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-neutral-600
                  prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 prose-blockquote:italic prose-blockquote:pl-4
                  prose-code:bg-neutral-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[14px] prose-code:font-mono
                  prose-pre:bg-neutral-950 prose-pre:text-neutral-50 prose-pre:rounded-lg">
        <Content />
      </div>

    </div>
  </article>
</Layout>
```

Используйте код с осторожностью.

🛠️ Что важно учесть для работы этого шаблона:

1.  **Плагин Tailwind Typography (`@tailwindcss/typography`)**:  
    Чтобы Markdown-текст из коллекции () автоматически получил красивые отступы, правильные размеры шрифтов для списков, цитат и заголовков, вам нужно установить официальный плагин, если он еще не установлен:
    
    bash
    
    ```
    npm install -D @tailwindcss/typography
    ```
    
    Используйте код с осторожностью.
    
    И добавить его в ваш файл `tailwind.config.mjs`:
    
    javascript
    
    ```
    plugins: [
      require('@tailwindcss/typography'),
    ],
    ```
    
    Используйте код с осторожностью.
    
    В коде за это отвечает класс `prose prose-neutral max-w-none`, свойства которого мы точечно переопределили ниже в кодовой структуре для идеального мэтча с Notion (например, добавили легкую линию под заголовками `h2` через `prose-h2:border-b`).
2.  **Frontmatter в ваших `.md` или `.mdx` файлах**:  
    Теперь вы можете добавлять кастомные эмодзи для каждой статьи. Структура файла статьи в папке `src/content/blog/` будет выглядеть так:
    
    markdown
    
    ```
    ---
    title: "Как я перешел на минимализм в интерфейсах"
    date: "24 Октября 2026"
    category: "Design"
    image: "/images/covers/minimalism.jpg"
    icon: "🎨" # Кастомная иконка для страницы Notion
    description: "Краткий разбор того, почему фокус на контенте побеждает тренды."
    ---
    Здесь идет ваш основной текст статьи...
    ```
    
    Используйте код с осторожностью.
    

С такой структурой ваш блог `pinux.vercel.app` будет выглядеть как единая, монолитная база знаний, развернутая прямо из вашего Notion, но при этом работающая со скоростью статического сайта Astro.

Нужно ли нам добавить внизу статьи **блок «Читать далее»** с двумя случайными или похожими постами, чтобы удержать читателя на сайте?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "да"

да

09:01

### Ответ в режиме ИИ, исходный запрос: "да"

Чтобы реализовать блок **«Читать далее»** в стиле Notion, мы выберем два других случайных поста из вашей коллекции. Для сохранения минималистичного дизайна мы отобразим их в виде лаконичных карточек с обложками 16:9, похожих на те, что используются на главной странице, но чуть меньшего размера.

Добавьте этот код в самый конец вашего файла `src/pages/blog/[...slug].astro` (сразу под закрывающим тегом , где выводится контент статьи ):

astro

```
      {/* 5. Блок "Читать далее" в стиле Notion */}
      <div class="mt-20 pt-10 border-t border-neutral-200/60">
        <h3 class="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-6">
          Читать далее
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(() => {
            // Фильтруем коллекцию: убираем текущий пост
            const otherPosts = allPosts.filter(p => p.slug !== post.slug);
            
            // Перемешиваем массив случайным образом
            const shuffled = [...otherPosts].sort(() => 0.5 - Math.random());
            
            // Берем первые 2 поста
            const recommendations = shuffled.slice(0, 2);

            return recommendations.map((recPost) => {
              const recCategory = recPost.data.category || 'default';
              const recColorClass = categoryColors[recCategory] || categoryColors.default;

              return (
                <article class="group flex flex-col">
                  <a href={`/blog/${recPost.slug}`} class="block no-underline text-current">
                    
                    {/* Мини-обложка 16:9 */}
                    <div class="w-full aspect-video overflow-hidden rounded-md bg-neutral-100 border border-neutral-200/60 mb-3">
                      <img 
                        src={recPost.data.image} 
                        alt="" 
                        loading="lazy" 
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>
                    
                    {/* Мета и Заголовок */}
                    <div class="space-y-1.5 px-0.5">
                      <div class="flex items-center gap-2">
                        <span class={`inline-flex items-center px-1.5 py-0.2 text-[10px] font-medium rounded border ${recColorClass}`}>
                          {recCategory}
                        </span>
                      </div>
                      
                      <h4 class="text-base font-semibold tracking-tight text-neutral-950 leading-snug group-hover:text-neutral-700 transition-colors line-clamp-2">
                        {recPost.data.title}
                      </h4>
                    </div>

                  </a>
                </article>
              );
            });
          })()}
        </div>
      </div>
```

Используйте код с осторожностью.

*Важное техническое уточнение:* Чтобы в коде выше работал вызов `allPosts`, не забудьте подняться в самый верх файла в секцию Frontmatter (между линиями `---`) и добавить получение всей коллекции прямо под `const { post } = Astro.props;`:

typescript

```
const { post } = Astro.props;
const { Content } = await post.render();

// Добавьте эту строчку, чтобы блок рекомендаций знал обо всех существующих статьях:
const allPosts = await getCollection('blog'); 
```

Используйте код с осторожностью.

⚡️ Как это работает:

1.  **Чистый JS прямо в шаблоне**: Мы используем самовызывающуюся функцию `(() => { ... })()`, чтобы прямо внутри верстки Astro отфильтровать текущую статью и случайным образом перемешать оставшиеся.
2.  **`line-clamp-2`**: Защищает мини-сетку от перекосов. Если у одной из рекомендуемых статей заголовок окажется слишком длинным, он аккуратно обрежется, сохранив ровную линию блоков.
3.  **Автоматическое обновление**: Так как это статическая генерация (SSG) на Vercel, состав пар рекомендуемых статей будет фиксироваться и перемешиваться заново **при каждой новой сборке (деплое)** вашего блога.

Теперь архитектура вашего минималистичного блога полностью готова. Если хотите, мы можем настроить **темную тему (Dark Mode)** в стиле темной раскладки Notion или добавить **кнопку «Поделиться в Telegram»** в конце статьи. Что из этого вам **интереснее добавить**?

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Вы сказали: "пока все, надо переписать и протестить"

пока все, надо переписать и протестить

09:03

### Ответ в режиме ИИ, исходный запрос: "пока все, надо переписать и протестить"

Отличный план! Пошаговое внедрение и тестирование — лучший способ собрать чистый проект без багов.

Сейчас у вас на руках есть полноценная архитектура для минималистичного блога на **Astro + Tailwind CSS** в духе Notion и Losko:

*   **Главная страница** с обложкой, иконкой и кнопкой случайного поста.
*   **Двухколоночная адаптивная сетка** с автоматической подгонкой обложек под формат 16:9 и Notion-тегами.
*   **Чистая страница статьи** с идеальной типографикой для чтения и умным блоком рекомендаций в подвале.
*   И главное — никакого лишнего кода, баз данных и тяжелых счетчиков. Весь фокус на контенте, а аудитория органично собирается в Telegram.

Удачи в разработке и успешного деплоя на `pinux.vercel.app`! 🚀

Когда вы все протестируете и запустите, возвращайтесь. Мы сможем:

*   Добавить **темную тему (Dark Mode)** в стиле Notion
*   Сделать **кнопку «Поделиться в Telegram»** под текстом статьи
*   Настроить автоматическую генерацию красивых **социальных превью (OG-images)** для ссылок в соцсетях

Напишите, как только будете **готовы двигаться дальше**!

Скопировано в буфер обменаНе удалось скопировать данные в буфер обмена. Повторите попытку позже.

## Общее

0 файлов

Показать все

## Общее

0 файлов