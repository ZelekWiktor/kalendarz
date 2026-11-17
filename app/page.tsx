'use client';

import React, { useState } from 'react';

type User = 'Ja' | 'Kolega';
type EventStatus = 'pending' | 'ok' | 'no';

interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  author: User;
  status: EventStatus;
}

interface Task {
  id: number;
  text: string;
  done: boolean;
}

const MONTHS_FULL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];
const DAYS_SHORT = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

export default function Home() {
  const [user, setUser] = useState<User>('Ja');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Stan aktualnie przeglądanego miesiąca i wybranego dnia (domyślnie Listopad 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-22');

  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'Siłownia', date: '2026-11-20', time: '18:00', author: 'Kolega', status: 'pending' },
    { id: 2, title: 'Kino — nowy film', date: '2026-11-22', time: '20:30', author: 'Ja', status: 'ok' },
    { id: 3, title: 'Mecz na orliku', date: '2026-11-26', time: '19:00', author: 'Kolega', status: 'ok' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Kupić bilety online', done: false },
    { id: 2, text: 'Zarezerwować stolik na piątek', done: true },
  ]);

  const [form, setForm] = useState({ title: '', date: '2026-11-25', time: '18:00' });
  const [newTask, setNewTask] = useState<string>('');

  const addEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setEvents([...events, { ...form, id: Date.now(), author: user, status: 'pending' }]);
    setForm({ title: '', date: form.date, time: '' });
  };

  const setStatus = (id: number, status: EventStatus) => {
    setEvents(events.map(ev => (ev.id === id ? { ...ev, status } : ev)));
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Filtrowanie: oczekujące propozycje vs zaakceptowane w kalendarzu
  const pendingEvents = events.filter(ev => ev.status === 'pending');
  const confirmedEvents = events.filter(ev => ev.status === 'ok');

  // Logika siatki kalendarza (Apple Calendar style)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Poniedziałek = 0

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    const today = new Date(2026, 10, 17);
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate('2026-11-17');
  };

  const formatDateStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const selectedDayEvents = confirmedEvents
    .filter(ev => ev.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Style zależne od trybu nocnego (Apple UI palette)
  const bgPage = darkMode ? 'bg-black text-zinc-100' : 'bg-[#f5f5f7] text-zinc-900';
  const bgCard = darkMode ? 'bg-[#1c1c1e] border-zinc-800' : 'bg-white border-zinc-200/80';
  const bgInput = darkMode
    ? 'bg-[#2c2c2e] border-zinc-700 text-white placeholder-zinc-400'
    : 'bg-[#f5f5f7] border-zinc-200 text-zinc-900 placeholder-zinc-400';
  const textMuted = darkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`min-h-screen transition-colors duration-200 py-8 px-4 ${bgPage}`}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Górny pasek (Apple Header) */}
        <header className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm ${bgCard}`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-rose-500">📅</span> Wspólny Kalendarz
            </h1>
            <p className={`text-xs mt-0.5 ${textMuted}`}>
              Zaakceptowane propozycje trafiają automatycznie do kalendarza
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Przełącznik trybu nocnego */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Włącz tryb dzienny' : 'Włącz tryb nocny'}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition cursor-pointer ${
                darkMode
                  ? 'bg-[#2c2c2e] border-zinc-700 text-amber-400 hover:bg-zinc-700'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Segmented Control (Ja / Kolega) */}
            <div className={`flex items-center p-1 rounded-xl ${darkMode ? 'bg-[#2c2c2e]' : 'bg-zinc-100'}`}>
              {(['Ja', 'Kolega'] as User[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUser(role)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    user === role
                      ? darkMode
                        ? 'bg-[#3a3a3c] text-white shadow'
                        : 'bg-white text-zinc-900 shadow-sm'
                      : `${textMuted} hover:opacity-80`
                  }`}
                >
                  {role === 'Ja' ? '👤 Ja' : '🤝 Kolega'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Formularz nowej propozycji */}
        <section className={`p-5 rounded-2xl border shadow-sm ${bgCard}`}>
          <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${textMuted}`}>
            Zaproponuj termin
          </h2>
          <form onSubmit={addEvent} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <input
              type="text"
              placeholder="Nazwa wydarzenia (np. Kolacja, Trening)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={`sm:col-span-5 px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${bgInput}`}
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className={`sm:col-span-3 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${bgInput}`}
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className={`sm:col-span-2 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${bgInput}`}
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm py-2 px-4 rounded-xl transition cursor-pointer"
            >
              Wyślij
            </button>
          </form>
        </section>

        {/* Skrzynka propozycji do akceptacji */}
        {pendingEvents.length > 0 && (
          <section className={`p-5 rounded-2xl border shadow-sm ${bgCard}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Oczekujące na akceptację ({pendingEvents.length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {pendingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border ${
                    darkMode ? 'bg-[#2c2c2e]/70 border-zinc-700/80' : 'bg-amber-50/50 border-amber-200/70'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{ev.title}</div>
                    <div className={`text-xs mt-0.5 ${textMuted}`}>
                      🗓️ {ev.date} {ev.time && `• 🕒 ${ev.time}`} • Zaproponował:{' '}
                      <span className="font-semibold text-rose-500">{ev.author}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.author !== user ? (
                      <>
                        <button
                          onClick={() => setStatus(ev.id, 'ok')}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                        >
                          ✓ Akceptuj i zapisz
                        </button>
                        <button
                          onClick={() => setStatus(ev.id, 'no')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                            darkMode
                              ? 'bg-zinc-700 text-rose-400 hover:bg-zinc-600'
                              : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                          }`}
                        >
                          ✕ Odrzuć
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs italic ${textMuted}`}>Czeka na drugą osobę...</span>
                    )}
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className={`p-1.5 rounded-lg text-xs ${textMuted} hover:text-rose-500 cursor-pointer`}
                      title="Usuń propozycję"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KALENDARZ W STYLU APPLE */}
        <section className={`rounded-2xl border shadow-sm overflow-hidden ${bgCard}`}>
          {/* Pasek nawigacji miesiąca */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-zinc-800' : 'border-zinc-200/80'}`}>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold tracking-tight">{MONTHS_FULL[month]}</h2>
              <span className={`text-xl font-light ${textMuted}`}>{year}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium border transition cursor-pointer ${
                  darkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                ‹
              </button>
              <button
                onClick={goToday}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  darkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                Dziś
              </button>
              <button
                onClick={nextMonth}
                className={`px-2.5 py-1 rounded-lg text-sm font-medium border transition cursor-pointer ${
                  darkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                ›
              </button>
            </div>
          </div>

          {/* Nagłówki dni tygodnia */}
          <div className={`grid grid-cols-7 text-center py-2 text-[11px] font-semibold uppercase tracking-wider border-b ${
            darkMode ? 'border-zinc-800 text-zinc-500' : 'border-zinc-100 text-zinc-400'
          }`}>
            {DAYS_SHORT.map((d, idx) => (
              <div key={d} className={idx >= 5 ? 'text-rose-500/80' : ''}>{d}</div>
            ))}
          </div>

          {/* Siatka dni miesiąca */}
          <div className={`grid grid-cols-7 divide-x divide-y ${darkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
            {/* Puste komórki przed 1. dniem miesiąca */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className={`h-24 p-1.5 ${darkMode ? 'bg-zinc-900/40' : 'bg-zinc-50/50'}`} />
            ))}

            {/* Dni miesiąca */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = formatDateStr(dayNum);
              const dayEvents = confirmedEvents.filter(ev => ev.date === dateStr);
              const isToday = dateStr === '2026-11-17';
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-24 p-1.5 flex flex-col cursor-pointer transition relative ${
                    isSelected
                      ? darkMode
                        ? 'bg-zinc-800/90'
                        : 'bg-rose-50/60'
                      : darkMode
                      ? 'hover:bg-zinc-800/40'
                      : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex justify-end">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                        isToday
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? darkMode
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 text-white'
                          : ''
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  {/* Paski wydarzeń w stylu Apple Calendar */}
                  <div className="mt-1 space-y-1 overflow-y-auto no-scrollbar">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[10px] leading-tight px-1.5 py-0.5 rounded font-medium truncate border-l-2 ${
                          ev.author === 'Ja'
                            ? darkMode
                              ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                              : 'bg-sky-100 text-sky-800 border-sky-500'
                            : darkMode
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-500'
                        }`}
                      >
                        {ev.time && <span className="opacity-75 mr-1">{ev.time}</span>}
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dolny panel szczegółów wybranego dnia */}
          <div className={`p-4 border-t ${darkMode ? 'bg-[#161618] border-zinc-800' : 'bg-zinc-50/80 border-zinc-200/80'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                Wybrany dzień: {selectedDate}
              </span>
              <span className={`text-xs ${textMuted}`}>
                {selectedDayEvents.length === 0 ? 'Brak wydarzeń' : `${selectedDayEvents.length} wydarzenie/a`}
              </span>
            </div>

            {selectedDayEvents.length > 0 && (
              <div className="space-y-2 mt-2">
                {selectedDayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${bgCard}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          ev.author === 'Ja' ? 'bg-sky-500' : 'bg-emerald-500'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-semibold">{ev.title}</div>
                        <div className={`text-xs ${textMuted}`}>
                          🕒 {ev.time || 'Cały dzień'} • Zaproponował: {ev.author}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      title="Usuń z kalendarza"
                      className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${textMuted} hover:text-rose-500`}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Wspólne ustalenia z usuwaniem */}
        <section className={`p-5 rounded-2xl border shadow-sm ${bgCard}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold">📝 Wspólne ustalenia</h2>
            <span className={`text-xs ${textMuted}`}>
              {tasks.filter((t) => t.done).length}/{tasks.length} gotowe
            </span>
          </div>

          <form onSubmit={addTask} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Dodaj rzecz do ogarnięcia..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className={`flex-1 px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${bgInput}`}
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                darkMode
                  ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              Dodaj
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className={`text-center py-4 text-xs ${textMuted}`}>Brak ustaleń na liście.</p>
          ) : (
            <ul className={`divide-y ${darkMode ? 'divide-zinc-800' : 'divide-zinc-100'}`}>
              {tasks.map((t) => (
                <li key={t.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div
                    onClick={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                    className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition ${
                        t.done
                          ? 'bg-rose-500 border-rose-500 text-white'
                          : darkMode
                          ? 'border-zinc-600'
                          : 'border-zinc-300'
                      }`}
                    >
                      {t.done && <span className="text-[11px]">✓</span>}
                    </div>
                    <span className={`text-sm truncate ${t.done ? 'line-through opacity-50' : ''}`}>
                      {t.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(t.id)}
                    title="Usuń ustalenie"
                    className={`px-2 py-1 rounded-lg text-xs transition cursor-pointer ${textMuted} hover:text-rose-500`}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
}