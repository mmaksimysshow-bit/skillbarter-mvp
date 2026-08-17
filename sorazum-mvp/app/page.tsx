"use client";

import { useMemo, useState } from "react";

type Mission = {
  id: number;
  sector: string;
  title: string;
  description: string;
  prize: string;
  people: number;
  days: number;
  skills: string[];
  featured?: boolean;
};

const missions: Mission[] = [
  {
    id: 1,
    sector: "ГОРОДСКАЯ СРЕДА",
    title: "Сократить пробки у школ в часы пик",
    description: "Нужно предложить решение, которое повысит безопасность детей и уменьшит заторы без масштабной перестройки улиц.",
    prize: "600 000 ₽",
    people: 84,
    days: 12,
    skills: ["Урбанистика", "Аналитика", "Дизайн"],
    featured: true,
  },
  {
    id: 2,
    sector: "МЕДИЦИНА",
    title: "Уменьшить ожидание записи к врачу",
    description: "Найдите способ перераспределить поток пациентов и освободить время врачей без снижения качества помощи.",
    prize: "450 000 ₽",
    people: 56,
    days: 18,
    skills: ["Медицина", "Data Science", "Продукт"],
  },
  {
    id: 3,
    sector: "ПРОМЫШЛЕННОСТЬ",
    title: "Снизить потери энергии на производстве",
    description: "Предложите проверяемую систему обнаружения лишнего расхода энергии на действующем предприятии.",
    prize: "900 000 ₽",
    people: 71,
    days: 21,
    skills: ["Инженерия", "IoT", "Экономика"],
  },
];

export default function Home() {
  const [filter, setFilter] = useState("Все миссии");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [joinStep, setJoinStep] = useState<"details" | "profile" | "team">("details");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBudget, setDraftBudget] = useState("");
  const [customMissions, setCustomMissions] = useState<Mission[]>([]);
  const [toast, setToast] = useState("");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [synthesisRunning, setSynthesisRunning] = useState(false);
  const [synthesisReady, setSynthesisReady] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState(["Анна: Я добавила результаты интервью с родителями.", "Тимур: Проверяю данные по пиковым 30 минутам."]);
  const allMissions = useMemo(() => [...customMissions, ...missions], [customMissions]);
  const visible = useMemo(
    () => filter === "Все миссии" ? allMissions : allMissions.filter((mission) => mission.sector.includes(filter.toUpperCase())),
    [filter, allMissions],
  );
  const scrollToMissions = () => document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
  const closeMission = () => { setSelectedMission(null); setJoinStep("details"); setIsAnalyzing(false); };
  const buildTeam = () => {
    if (!name.trim() || !skills.trim()) return;
    setIsAnalyzing(true);
    window.setTimeout(() => { setIsAnalyzing(false); setJoinStep("team"); }, 1450);
  };
  const publishMission = () => {
    if (!draftTitle.trim() || !draftBudget.trim()) return;
    const normalizedBudget = draftBudget.replace(/[^0-9]/g, "") || "500000";
    setCustomMissions([{ id: Date.now(), sector: "НОВАЯ МИССИЯ", title: draftTitle, description: "Задача опубликована заказчиком и открыта для формирования первых команд.", prize: `${Number(normalizedBudget).toLocaleString("ru-RU")} ₽`, people: 0, days: 30, skills: ["Аналитика", "Исследования", "Продукт"], featured: true }, ...customMissions]);
    setCustomerOpen(false); setDraftTitle(""); setDraftBudget(""); setFilter("Все миссии");
    setToast("Миссия опубликована и появилась в каталоге"); scrollToMissions();
    window.setTimeout(() => setToast(""), 3200);
  };
  const runSynthesis = () => {
    setSynthesisRunning(true);
    window.setTimeout(() => { setSynthesisRunning(false); setSynthesisReady(true); }, 1800);
  };
  const sendChat = () => {
    if (!chatText.trim()) return;
    setChatMessages([...chatMessages, `${name || "Максим"}: ${chatText.trim()}`]); setChatText("");
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SORAZUM — на главную"><span className="brand-mark">S</span><span>SORAZUM</span></a>
        <nav aria-label="Главная навигация"><a href="#missions">Миссии</a><a href="#how">Как работает</a><a href="#ai">SORAZUM AI</a></nav>
        <button className="header-button" onClick={() => setCustomerOpen(true)}>Разместить задачу</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> ПЛАТФОРМА КОЛЛЕКТИВНОГО РАЗУМА</div>
          <h1>Одна реальная проблема.<br /><em>Сотни сильных умов.</em></h1>
          <p>Компании и государство размещают оплачиваемые задачи. Люди сами присоединяются, а ИИ собирает из них сильные команды и объединяет лучшие части решений в один результат.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={scrollToMissions}>Найти миссию <span>↗</span></button>
            <button className="text-link text-button" onClick={() => setCustomerOpen(true)}>Разместить задачу <span>→</span></button>
          </div>
          <div className="hero-proof">
            <div><strong>3</strong><span>активные миссии</span></div>
            <div><strong>211</strong><span>участников</span></div>
            <div><strong>1,95 млн ₽</strong><span>общий призовой фонд</span></div>
          </div>
        </div>

        <div className="intelligence-card" aria-label="Демонстрация работы коллективного интеллекта">
          <div className="card-topline"><span>SORAZUM / LIVE</span><span className="live"><i /> ИИ анализирует</span></div>
          <div className="core-visual">
            <div className="orbit orbit-one"><span className="node n1">UX</span><span className="node n2">DATA</span></div>
            <div className="orbit orbit-two"><span className="node n3">ГОРОД</span><span className="node n4">ECO</span></div>
            <div className="core"><small>СИНТЕЗ</small><b>87%</b></div>
          </div>
          <div className="synthesis-result"><span>УСИЛЕННОЕ РЕШЕНИЕ</span><strong>4 команды → 1 итог</strong><div className="meter"><i /></div><p>Лучшие совместимые идеи найдены и объединены</p></div>
        </div>
      </section>

      <section className="mission-section" id="missions">
        <div className="section-heading">
          <div><div className="eyebrow"><span /> ОТКРЫТЫЕ ЗАДАЧИ</div><h2>Выберите проблему,<br />которую хотите решить</h2></div>
          <p>Не нужно проходить вступительные задания. Покажите навыки в реальной работе и получите оплату за принятый вклад.</p>
        </div>
        <div className="filters" role="group" aria-label="Фильтр миссий">
          {["Все миссии", "Медицина", "Промышленность", "Городская среда"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div className="mission-grid">
          {visible.map((mission) => (
            <article className={`mission-card ${mission.featured ? "featured" : ""}`} key={mission.id}>
              <div className="mission-meta"><span>{mission.sector}</span><b>{mission.days} дней</b></div>
              <h3>{mission.title}</h3><p>{mission.description}</p>
              <div className="tags">{mission.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="mission-bottom"><div><small>ПРИЗОВОЙ ФОНД</small><strong>{mission.prize}</strong></div><div className="people"><span>+{mission.people}</span><small>участников</small></div><button onClick={() => setSelectedMission(mission)} aria-label={`Открыть миссию: ${mission.title}`}>→</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="eyebrow"><span /> МЕХАНИКА ПЛАТФОРМЫ</div><h2>Не конкурс идей.<br /><em>Система создания результата.</em></h2>
        <div className="steps">
          {[
            ["01", "Заказчик ставит задачу", "Фиксирует критерии результата, срок и реальный призовой фонд."],
            ["02", "Люди вступают сами", "Участник выбирает интересную миссию и показывает свои сильные стороны."],
            ["03", "ИИ собирает команды", "SORAZUM распределяет роли и формирует несколько сбалансированных команд."],
            ["04", "Лучшее становится одним", "ИИ сравнивает результаты, соединяет совместимые части и фиксирует вклад каждого."],
          ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="ai-section" id="ai">
        <div className="section-heading">
          <div><div className="eyebrow"><span /> SORAZUM AI</div><h2>ИИ не решает за людей.<br /><em>Он делает команду сильнее.</em></h2></div>
          <p>Платформа понимает навыки участников, собирает несколько разных команд и показывает, какие части решений можно безопасно соединить.</p>
        </div>
        <div className="ai-workspace">
          <div className="workspace-sidebar">
            <div className="workspace-title"><span className="brand-mark">S</span><div><b>Миссия #001</b><small>Пробки у школ</small></div></div>
            <div className="side-step done"><i>✓</i><span><b>84 профиля изучено</b><small>навыки и опыт</small></span></div>
            <div className="side-step active"><i>02</i><span><b>Команды собраны</b><small>4 разных подхода</small></span></div>
            <div className="side-step"><i>03</i><span><b>Синтез решений</b><small>после сдачи работ</small></span></div>
          </div>
          <div className="workspace-main">
            <div className="workspace-head"><div><small>ИИ-СБОРКА</small><h3>Четыре команды без одинакового мышления</h3></div><span className="ai-status"><i /> ГОТОВО</span></div>
            <div className="team-row highlight"><div className="team-number">A</div><div className="avatars"><span>АК</span><span>ТС</span><span>МР</span><span>+3</span></div><div><b>Системное решение</b><small>урбанист · аналитик · инженер · педагог</small></div><strong>94%</strong></div>
            <div className="team-row"><div className="team-number">B</div><div className="avatars"><span>ЕВ</span><span>ОД</span><span>НК</span><span>+2</span></div><div><b>Поведенческий подход</b><small>психолог · дизайнер · социолог</small></div><strong>91%</strong></div>
            <div className="team-row"><div className="team-number">C</div><div className="avatars"><span>ДМ</span><span>РХ</span><span>ИЛ</span><span>+3</span></div><div><b>Технологический подход</b><small>data scientist · IoT · транспорт</small></div><strong>89%</strong></div>
            <div className="workspace-note"><b>Почему не одна команда?</b><span>Несколько независимых подходов уменьшают риск ошибки. В финале SORAZUM соединит их лучшие совместимые части.</span></div>
          </div>
        </div>
      </section>

      <footer><div className="brand"><span className="brand-mark">S</span><span>SORAZUM</span></div><p>Умные люди уже есть по всему миру. Мы даём им одну реальную задачу.</p><button className="primary-button" onClick={scrollToMissions}>Открыть миссии <span>↗</span></button></footer>

      {selectedMission && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && closeMission()}>
          <section className="mission-modal" role="dialog" aria-modal="true" aria-label="Вступление в миссию">
            <button className="modal-close" onClick={closeMission} aria-label="Закрыть">×</button>
            {joinStep === "details" && <>
              <div className="modal-kicker">{selectedMission.sector} · {selectedMission.days} ДНЕЙ</div>
              <h2>{selectedMission.title}</h2><p className="modal-lead">{selectedMission.description}</p>
              <div className="modal-facts"><div><small>ПРИЗОВОЙ ФОНД</small><strong>{selectedMission.prize}</strong></div><div><small>УЖЕ УЧАСТВУЮТ</small><strong>{selectedMission.people} человек</strong></div><div><small>ФОРМАТ</small><strong>Несколько команд</strong></div></div>
              <div className="mission-brief"><b>Что получит заказчик</b><p>Несколько независимых решений, прозрачный вклад каждого участника и один усиленный итог после ИИ-синтеза.</p></div>
              <button className="primary-button wide" onClick={() => setJoinStep("profile")}>Вступить без отбора <span>→</span></button>
            </>}
            {joinStep === "profile" && <>
              <div className="modal-kicker">ШАГ 1 ИЗ 2 · ПРОФИЛЬ ДЛЯ КОМАНДЫ</div><h2>Расскажите, в чём вы сильны</h2><p className="modal-lead">Это не отбор. ИИ использует информацию только для подбора роли и людей, которые дополнят ваши навыки.</p>
              <label className="field"><span>Ваше имя</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Максим" autoFocus /></label>
              <label className="field"><span>Навыки и опыт</span><textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Например: анализ данных, городские проекты, презентации" /></label>
              <button className="primary-button wide" disabled={!name.trim() || !skills.trim() || isAnalyzing} onClick={buildTeam}>{isAnalyzing ? "ИИ собирает команду…" : "Собрать мою команду"}<span>{isAnalyzing ? "•••" : "→"}</span></button>
            </>}
            {joinStep === "team" && <>
              <div className="success-mark">✓</div><div className="modal-kicker">КОМАНДА НАЙДЕНА · СОВМЕСТИМОСТЬ 93%</div><h2>{name}, вы в команде №4</h2><p className="modal-lead">Ваши навыки дополняют четыре участника. У команды нет повторяющихся ролей и есть всё для первого решения.</p>
              <div className="matched-team"><div><span>{name.slice(0,2).toUpperCase()}</span><b>{name}</b><small>ваша сильная сторона</small></div><div><span>АС</span><b>Анна</b><small>исследование</small></div><div><span>ТК</span><b>Тимур</b><small>аналитика</small></div><div><span>МВ</span><b>Мария</b><small>дизайн</small></div><div><span>ДР</span><b>Денис</b><small>внедрение</small></div></div>
              <button className="primary-button wide" onClick={() => { closeMission(); setWorkspaceOpen(true); }}>Открыть рабочее пространство <span>↗</span></button>
            </>}
          </section>
        </div>
      )}

      {workspaceOpen && (
        <section className="product-overlay" role="dialog" aria-modal="true" aria-label="Рабочее пространство команды">
          <header className="product-header"><div className="brand"><span className="brand-mark">S</span><span>SORAZUM</span></div><div className="product-mission"><small>МИССИЯ #001</small><b>Безопасная дорога к школе</b></div><div className="product-actions"><span className="online-dot">4 онлайн</span><span className="profile-chip">{(name || "Максим").slice(0,2).toUpperCase()}</span><button onClick={() => setWorkspaceOpen(false)} aria-label="Закрыть рабочее пространство">×</button></div></header>
          <div className="product-body">
            <aside className="product-nav">
              <button className="active"><span>⌂</span>Обзор</button><button><span>□</span>Задачи</button><button><span>◌</span>Команда</button><button><span>✦</span>AI-синтез</button><button><span>↗</span>Материалы</button>
              <div className="mission-progress"><small>ПРОГРЕСС МИССИИ</small><div><i /></div><b>42%</b><span>12 дней до результата</span></div>
            </aside>
            <main className="product-main">
              <div className="product-welcome"><div><small>КОМАНДА №4 · СИСТЕМНЫЙ ПОДХОД</small><h2>Добрый день, {name || "Максим"}</h2><p>Сегодня нужно закончить анализ проблемы и выбрать две идеи для проверки.</p></div><button onClick={runSynthesis} disabled={synthesisRunning}>{synthesisRunning ? "ИИ сравнивает материалы…" : synthesisReady ? "Синтез обновлён ✓" : "Запустить ИИ-синтез ✦"}</button></div>
              <div className="product-grid">
                <section className="board-card"><div className="card-heading"><b>Задачи команды</b><span>5 задач</span></div>
                  <div className="task-columns"><div><small>НУЖНО СДЕЛАТЬ · 2</small><article><span className="task-tag research">ИССЛЕДОВАНИЕ</span><b>Проверить причины пробок</b><p>Сравнить наблюдения у трёх школ</p><div><i>ТС</i><time>сегодня</time></div></article><article><span className="task-tag">ИДЕЯ</span><b>Схема безопасной высадки</b><p>Черновик сценария движения</p><div><i>МВ</i><time>завтра</time></div></article></div><div><small>В РАБОТЕ · 2</small><article><span className="task-tag data">ДАННЫЕ</span><b>Карта пиковых потоков</b><p>84% данных уже обработано</p><div className="mini-progress"><i /></div><div><i>ТК</i><time>84%</time></div></article><article><span className="task-tag research">ИНТЕРВЬЮ</span><b>Родители и учителя</b><p>12 из 15 разговоров готовы</p><div><i>АС</i><time>12/15</time></div></article></div></div>
                </section>
                <aside className="ai-panel"><div className="card-heading"><b>SORAZUM AI</b><span className="ai-status"><i /> LIVE</span></div>
                  {!synthesisReady ? <><div className="ai-orb">✦</div><h3>Материалы готовы к первому синтезу</h3><p>ИИ сравнит данные, интервью и идеи команды. Он не заменит ваше решение — только покажет совпадения, противоречия и пробелы.</p><button onClick={runSynthesis} disabled={synthesisRunning}>{synthesisRunning ? "Анализирую…" : "Начать анализ"}</button></> : <div className="synthesis-output"><div className="success-mark">✓</div><h3>Найден общий сильный ход</h3><p>Данные Тимура подтверждают наблюдение Анны: 68% затора создаётся в последние 12 минут до звонка.</p><div><small>РЕКОМЕНДАЦИЯ</small><b>Проверить разнесённые окна высадки + безопасный маршрут последних 200 метров.</b></div><span>Совместимость материалов: 92%</span></div>}
                </aside>
              </div>
            </main>
            <aside className="chat-panel"><div className="card-heading"><b>Команда</b><span>4 онлайн</span></div><div className="team-mini"><span>АС</span><span>ТК</span><span>МВ</span><span>ДР</span></div><div className="chat-stream">{chatMessages.map((message, index) => <p key={`${message}-${index}`}>{message}</p>)}</div><div className="chat-input"><input value={chatText} onChange={(e) => setChatText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Написать команде…"/><button onClick={sendChat}>↑</button></div></aside>
          </div>
        </section>
      )}

      {customerOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setCustomerOpen(false)}>
          <section className="mission-modal customer-modal" role="dialog" aria-modal="true" aria-label="Размещение задачи">
            <button className="modal-close" onClick={() => setCustomerOpen(false)} aria-label="Закрыть">×</button>
            <div className="modal-kicker">КАБИНЕТ ЗАКАЗЧИКА · НОВАЯ МИССИЯ</div><h2>Какую проблему нужно решить?</h2><p className="modal-lead">Опишите результат обычными словами. После публикации люди смогут сами вступить, а ИИ соберёт первые команды.</p>
            <label className="field"><span>Название задачи</span><textarea value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Например: как сократить очередь в городской поликлинике" autoFocus /></label>
            <label className="field"><span>Призовой фонд, ₽</span><input value={draftBudget} onChange={(e) => setDraftBudget(e.target.value)} inputMode="numeric" placeholder="500 000" /></label>
            <div className="publish-summary"><span>Комиссия платформы 15%</span><b>Оплата участникам привязана к принятому вкладу</b></div>
            <button className="primary-button wide" disabled={!draftTitle.trim() || !draftBudget.trim()} onClick={publishMission}>Опубликовать миссию <span>↗</span></button>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status"><i>✓</i>{toast}</div>}
    </main>
  );
}
