
адаптировать идею Losko для вашего блога на Astro

Чтобы сделать сайт чистым и сфокусированным, примените несколько правил дизайна в стиле Losko:

1.  **Много свободного пространства (Whitespace):** Не бойтесь пустых полей. Делайте большие отступы между абзацами и заголовками. Текст должен «дышать».
2.  **Строгая типографика:** Используйте максимум два качественных шрифта (один для заголовков, один для чтения). Losko активно использует чистые гротески (шрифты без засечек).
3.  **Минимум элементов в футере/шапке:** Вместо громоздких виджетов оставьте лаконичную строчку внизу страницы или в углу шапки.

Например, в подвале (footer) вашего блога это может выглядеть так:



```astro   

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

Хотите, мы набросаем **структуру главной страницы** для вашего блога в таком минималистичном стиле (на чистом CSS/Astro) или, может, вам помочь **настроить красивый вывод списка постов** без лишних элементов? Отправьте текущую структуру главной страницы, если нужно её упростить.

## "losko использует 3 колоночную masonry для десктопа и функцию - случайный пост"

Повторить этот функционал на **Astro** — отличный способ сделать интерфейс живым и вовлечь читателя. Сетка Masonry (когда карточки с разной высотой картинок плотно «подтягиваются» друг к другу без пустых строгих рядов) и кнопка случайного выбора идеально подходят для визуального блога.

Ниже готовое техническое решение для обеих фич в минималистичном стиле [Losko](https://losko.ru/).

* * *

Часть 1. Чистая 3-колоночная Masonry-сетка (CSS)

Традиционный `display: grid` выстраивает элементы по строгим рядам, оставляя дыры, если у картинок разные пропорции. В CSS есть мощное нативное решение для Masonry — **CSS Columns**. Оно идеально распределяет посты по колонкам сверху вниз, а затем слева направо.

Создайте компонент списка постов (например, `src/components/PostGrid.astro`):


```astro   

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

* * *

Часть 2. Функция «Случайный пост» (Random Post)

Так как посты в Astro известны еще на этапе сборки, мы можем передать массив адресов (URL) всех постов прямо в клиентский скрипт кнопки. При клике JavaScript моментально выберет случайный адрес и перенаправит пользователя.

Разместите эту кнопку в шапке (Header) или меню:

```astro   

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

Маленький нюанс CSS Columns (Masonry)

Единственная особенность нативного `column-count` — элементы сортируются **вертикально** (1-й пост сверху в левой колонке, 2-й под ним, а 4-й или 5-й перейдет во 2-ю колонку). Для визуальных журналов типа Losko это не критично, так как эстетика бесконечной и разной по высоте ленты важнее хронологического порядка.

Ниже представлены оба компонента, переведенные на Tailwind CSS, с сохранением строгого минимализма в духе Losko \[losko.ru\].

* * *

1\. Компонент Masonry-сетки (`PostGrid.astro`)

В Tailwind нативная многоколоночная сетка реализуется с помощью утилит `columns-*` и класса `break-inside-avoid`.


```astro   

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

**Разбор ключевых Tailwind-классов здесь:**

*   `columns-1 sm:columns-2 lg:columns-3` — автоматически переключает количество колонок (1 на мобильных, 2 на планшетах, 3 на десктопе).
*   `gap-8` — расстояние между колонками в `2rem` (32px).
*   `break-inside-avoid` — **главный класс**, запрещающий карточке рваться пополам при переходе в следующую колонку.
*   `group` и `group-hover:opacity-80` — позволяют элегантно приглушать прозрачность картинки при наведении на любую часть карточки.

* * *

2\. Кнопка «Случайный пост» (`RandomPost.astro`)

Для кнопки мы используем плоский контурный дизайн. Скрипт остается прежним, меняются только инлайн-классы.


```astro   

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

Двухколоночная структурированная сетка в духе **Notion** — прекрасная альтернатива хаотичному Masonry. 

Чтобы получить ширину карточки около **520px** при двух колонках с учетом отступов, мы ограничим максимальную ширину всей сетки (`max-w-[1120px]`). Пропорцию обложек **16/9** мы зададим через современный CSS-класс Tailwind `aspect-video`.

Ниже готовый адаптивный компонент на **Tailwind CSS + Astro**:

```astro   

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

Почему этот вариант отлично работает:

1.  **`aspect-video` + `object-cover`**: Все загружаемые вами картинки (даже если они изначально разных размеров) автоматически и без искажений обрезаются под идеальный формат **16/9**. Никакой каши в верстке.
2.  **`grid grid-cols-2`**: В отличие от CSS Columns (Masonry), здесь элементы идут строго слева направо по хронологии (1-й пост слева, 2-й справа, 3-й под 1-м). Это гораздо привычнее для чтения блогов.
3.  **`line-clamp-2`**: Если у постов разная длина описания, этот класс аккуратно обрежет текст троеточием на второй строчке, чтобы высота карточек оставалась максимально сбалансированной.

Стиль Notion также сильно завязан на системные и чистые шрифты (типа *Inter* или дефолтных системных UI-шрифтов).

Если вы хотите сделать блог еще более похожим на Notion, подсказать, как сделать **минималистичные теги категорий** (как цветные плашки в базах данных Notion) или добавить **иконки-эмодзи к заголовкам постов**?

### "теги категорий"

В базах данных **Notion** теги категорий выглядят очень узнаваемо: это аккуратные плашки с приглушенным пастельным фоном, слегка темным текстом и мягким скруглением.

В Tailwind CSS мы можем легко воссоздать эту эстетику. Лучше всего сделать **динамический маппинг цветов**, чтобы каждая категория (например, *Tech, Design, Life*) автоматически получала свой уникальный пастельный оттенок, прямо как в Notion.

Вот как обновить компонент сетки, добавив Notion-стиль для тегов:

```astro   

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

Как это работает и как настроить под себя:

1.  **Пастельная палитра**: Вместо ярких цветов (вроде `bg-blue-500`) используются самые светлые оттенки `*-50` для фона и приглушенные `*-700` / `*-800` для текста. Дополнительный тонкий бордюр (`border-*-200/60`) придает плашке завершенный и чистый вид.
2.  **Динамический выбор**: Вы можете просто добавлять новые категории в объект `categoryColors` вверху файла. Имена свойств (например, `Development`) должны в точности совпадать с тем, что вы пишете в Frontmatter ваших Markdown/MDX постов в поле `category`.

Если хотите, мы можем настроить **фильтрацию постов по этим тегам** (чтобы при клике на категорию на странице оставались только нужные статьи) или оформить **главную страницу блога с иконкой и описанием** в самом верху, как это сделано в публичных страницах Notion. Что для вас сейчас актуальнее?

Для оформления главной страницы в стиле **Notion** нам нужно воссоздать их классическую иерархию:

1.  **Обложка (Cover)**: Широкая минималистичная полоса (можно использовать чистый цвет или легкий градиент/паттерн).
2.  **Иконка (Emoji)**: Большая иконка, которая «наползает» на обложку.
3.  **Заголовок и описание**: Крупный шрифт, метаданные (прямо как название базы данных) и кнопка «Случайный материал», которую мы аккуратно встроим в интерфейс.
4.  **Сетка постов**: Наша 2-колоночная структурированная сетка.

Вот готовый код для вашей главной страницы `src/pages/index.astro`. Он объединяет все элементы, которые мы обсуждали, использует **Tailwind CSS** и выглядит максимально чисто и сфокусированно.

```astro   

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

💎 Детали, которые создают ощущение Notion:

*   **`-top-14`**: Отрицательный отступ поднимает эмодзи наверх, создавая тот самый фирменный эффект «всплывающего» значка страницы.
*   **`selection:bg-neutral-100`**: Кастомный цвет выделения текста. Когда пользователь выделяет мышкой текст на вашем сайте, вместо стандартного синего фона будет аккуратный светло-серый.
*   **Стилизация кнопки**: Она сделана не вызывающей и контурной (`border-neutral-200`), с легкой тенью `shadow-sm`, что отлично сочетается с интерфейсами современных SaaS-продуктов.

Для внутренней страницы статьи в стиле **Notion** важна идеальная читаемость текста. Никаких боковых панелей (sidebar), отвлекающих баннеров или перегруженных элементов. Фокус смещается на крупный заголовок, иконку, дату публикации и контент с большими отступами и выверенной типографикой.

В Astro страницы постов обычно генерируются динамически через файл `src/pages/blog/[...slug].astro`.

Вот готовый шаблон для страницы статьи с использованием **Tailwind CSS**, адаптированный под структуру, которую мы создали для главной:


```astro
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

🛠️ Что важно учесть для работы этого шаблона:

1.  **Плагин Tailwind Typography (`@tailwindcss/typography`)**:  
    
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
    
 такой структурой ваш блог `pinux.vercel.app` будет выглядеть как единая, монолитная база знаний, развернутая прямо из вашего Notion, но при этом работающая со скоростью статического сайта Astro.

Нужно ли нам добавить внизу статьи **блок «Читать далее»** с двумя случайными или похожими постами, чтобы удержать читателя на сайте?

Чтобы реализовать блок **«Читать далее»** в стиле Notion, мы выберем два других случайных поста из вашей коллекции. Для сохранения минималистичного дизайна мы отобразим их в виде лаконичных карточек с обложками 16:9, похожих на те, что используются на главной странице, но чуть меньшего размера.

Добавьте этот код в самый конец вашего файла `src/pages/blog/[...slug].astro` (сразу под закрывающим тегом , где выводится контент статьи ):


```astro   

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
*Важное техническое уточнение:* Чтобы в коде выше работал вызов `allPosts`, не забудьте подняться в самый верх файла в секцию Frontmatter (между линиями `---`) и добавить получение всей коллекции прямо под `const { post } = Astro.props;`:

```typescript   

const { post } = Astro.props;
const { Content } = await post.render();

// Добавьте эту строчку, чтобы блок рекомендаций знал обо всех существующих статьях:
const allPosts = await getCollection('blog'); 
```

⚡️ Как это работает:

1.  **Чистый JS прямо в шаблоне**: Мы используем самовызывающуюся функцию `(() => { ... })()`, чтобы прямо внутри верстки Astro отфильтровать текущую статью и случайным образом перемешать оставшиеся.
2.  **`line-clamp-2`**: Защищает мини-сетку от перекосов. Если у одной из рекомендуемых статей заголовок окажется слишком длинным, он аккуратно обрежется, сохранив ровную линию блоков.
3.  **Автоматическое обновление**: Так как это статическая генерация (SSG) на Vercel, состав пар рекомендуемых статей будет фиксироваться и перемешиваться заново **при каждой новой сборке (деплое)** вашего блога.


