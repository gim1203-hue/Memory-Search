import { useState } from 'react';
import MemoryItem from '../components/MemoryItem';

function Calendar({
  memories,
  toggleFavorite,
}) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
  });

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  function makeDateKey(date) {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function goToPreviousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  function goToToday() {
    const now = new Date();

    setCurrentDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

    setSelectedDate(now);
  }

  function handleDayClick(day) {
    setSelectedDate(
      new Date(year, month, day)
    );
  }

  function isSelectedDay(day) {
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  }

  function isToday(day) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  function getMemoriesForDay(day) {
    const date = new Date(
      year,
      month,
      day
    );

    const dateKey = makeDateKey(date);

    return memories.filter(
      (memory) => memory.date === dateKey
    );
  }

  const selectedDateKey =
    makeDateKey(selectedDate);

  const selectedMemories =
    memories.filter(
      (memory) =>
        memory.date === selectedDateKey
    );

  const calendarDays = [];

  for (
    let i = 0;
    i < firstDayOfMonth;
    i++
  ) {
    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="calendar-day empty-day"
      />
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const dayMemories =
      getMemoriesForDay(day);

    const selected =
      isSelectedDay(day);

    const todayClass =
      isToday(day);

    calendarDays.push(
      <button
        key={day}
        type="button"
        className={`calendar-day ${
          selected
            ? 'selected-day'
            : ''
        } ${
          todayClass
            ? 'today-day'
            : ''
        }`}
        onClick={() =>
          handleDayClick(day)
        }
      >
        <span>{day}</span>

        {dayMemories.length > 0 && (
          <div className="memory-dots">
            {dayMemories
              .slice(0, 3)
              .map((memory) => (
                <span key={memory.id} />
              ))}
          </div>
        )}
      </button>
    );
  }

  const formattedSelectedDate =
    selectedDate.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    );

  return (
    <section className="page-container">
      <p className="section-label">
        CALENDAR
      </p>

      <h2>Memory Calendar</h2>

      <p className="page-description">
        Select a day to see the notes,
        photos, videos, voice memos,
        and events saved for that date.
      </p>

      <div className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-header">
            <div>
              <p className="section-label">
                MONTH
              </p>

              <h3>
                {monthName} {year}
              </h3>
            </div>

            <div className="calendar-controls">
              <button
                type="button"
                className="secondary-button"
                onClick={goToPreviousMonth}
              >
                ←
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={goToToday}
              >
                Today
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={goToNextMonth}
              >
                →
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="calendar-grid">
            {calendarDays}
          </div>
        </div>

        <div className="panel selected-day-panel">
          <p className="section-label">
            SELECTED DAY
          </p>

          <h3>
            {formattedSelectedDate}
          </h3>

          <p className="selected-day-text">
            {selectedMemories.length === 0
              ? 'No memories saved for this date.'
              : `${selectedMemories.length} ${
                  selectedMemories.length === 1
                    ? 'memory'
                    : 'memories'
                } saved for this date.`}
          </p>

          {selectedMemories.length === 0 ? (
            <div className="page-placeholder">
              <div className="placeholder-icon">
                📅
              </div>

              <h3>No Memories</h3>

              <p>
                There are no memories saved
                for this day yet.
              </p>
            </div>
          ) : (
            <div className="memory-list">
              {selectedMemories.map((memory) => (
  <MemoryItem
    key={memory.id}
    id={memory.id}
    time={memory.time}
    icon={memory.icon}
    title={memory.title}
    description={memory.description}
    category={memory.category}
    favorite={memory.favorite}
    toggleFavorite={toggleFavorite}
    mediaType={memory.mediaType}
    mediaUrl={memory.mediaUrl}
  />
))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Calendar;