import   styles      from '@/styles/calendar.module.scss';
import   React       from 'react';
import   Selecto     from 'react-selecto';
import { LocalDate } from '@js-joda/core';
import { useState  } from 'react';

const Calendar = () => {

  const today: LocalDate = LocalDate.now();

  const [ currentMonth, setCurrentMonth   ] = useState<LocalDate>(today.withDayOfMonth(1));
  const [ selectedDates, setSelectedDates ] = useState<LocalDate[]>([]);

  const daysInMonth   : number = currentMonth.lengthOfMonth();
  const startDayOfWeek: number = currentMonth.dayOfWeek().value() % 7;

  const handlePrevMonth = () => {

    setCurrentMonth(currentMonth.minusMonths(1));
  };

  const handleNextMonth = () => {

    setCurrentMonth(currentMonth.plusMonths(1));
  };

  const handleToday = () => {

    setCurrentMonth(today.withDayOfMonth(1));
  };

  const handleSelect = (e) => {

    console.log({added: e.added, removed: e.removed, startAdded: e.startAdded, startRemoved: e.startRemoved, startSelected: e.startSelected});

    if (e.added.length > 0 && e.removed.length < 1) {
      setSelectedDates([...e.startAdded.map(el => LocalDate.parse(el.id)), ...e.startSelected.map(el => LocalDate.parse(el.id))]);
    }

    if (e.removed.length > 0 && e.added.length < 1) {
      const removeDates: LocalDate[] = e.startRemoved.map(el => LocalDate.parse(el.id));

      setSelectedDates(prevState => prevState.filter((selectedDate: LocalDate) => !removeDates.some((removeDate: LocalDate) => selectedDate.equals(removeDate))));
    }
  };

  const renderDays = () => {

    const days     : React.JSX.Element[] = [];
    const prevMonth: LocalDate           = currentMonth.minusMonths(1);
    const nextMonth: LocalDate           = currentMonth.plusMonths(1);

    // 이전 달의 날짜 추가
    const prevMonthDaysToShow: number = startDayOfWeek;
    const prevMonthDays      : number = prevMonth.lengthOfMonth();

    for (let day: number = prevMonthDays - prevMonthDaysToShow + 1; day <= prevMonthDays; day++) {

      const date      : LocalDate = prevMonth.withDayOfMonth(day);
      const isSelected: boolean   = selectedDates.some((selectedDate: LocalDate) => selectedDate.equals(date));

      days.push(
        <div key={`prev-${day}`}
             id={date.toString()}
             className={`${styles.day} ${isSelected ? styles.selected : ''} ${date.dayOfWeek().value() === 6 ? styles.blue : ''} ${date.dayOfWeek().value() === 7 ? styles.red : ''}`}>
          {day}
        </div>
      );
    }

    // 현재 달의 날짜 추가
    for (let day: number = 1; day <= daysInMonth; day++) {

      const date      : LocalDate = currentMonth.withDayOfMonth(day);
      const isSelected: boolean   = selectedDates.some((selectedDate: LocalDate) => selectedDate.equals(date));

      days.push(
        <div key={day}
             id={date.toString()}
             className={`${styles.day} ${isSelected ? styles.selected : ''} ${date.dayOfWeek().value() === 6 ? styles.blue : ''} ${date.dayOfWeek().value() === 7 ? styles.red : ''}`}>
          {prevMonthDaysToShow > 0 && day === 1 ? `${currentMonth.monthValue()}/${day}` : day}
        </div>
      );
    }

    // 5주 또는 6주 노출 결정
    const totalDaysToShow    : number = prevMonthDaysToShow + daysInMonth;
    const weeksToShow        : number = totalDaysToShow > 35 ? 6 : 5;
    const nextMonthDaysToShow: number = weeksToShow * 7 - totalDaysToShow;

    // 다음 달의 날짜 추가
    for (let day: number = 1; day <= nextMonthDaysToShow; day++) {

      const date      : LocalDate = nextMonth.withDayOfMonth(day);
      const isSelected: boolean   = selectedDates.some((selectedDate: LocalDate) => selectedDate.equals(date));

      days.push(
        <div key={`next-${day}`}
             id={date.toString()}
             className={`${styles.day} ${isSelected ? styles.selected : ''} ${date.dayOfWeek().value() === 6 ? styles.blue : ''} ${date.dayOfWeek().value() === 7 ? styles.red : ''}`}>
          {nextMonthDaysToShow > 0 && day === 1 ? `${nextMonth.monthValue()}/${day}` : day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.Calendar}>
      <div className={styles.header}>
        <div>
          {`${currentMonth.year()}.${currentMonth.monthValue()}`}
        </div>

        <div className={styles.buttonWrap}>
          <button onClick={handlePrevMonth}>Prev</button>
          <button onClick={handleToday}>오늘</button>
          <button onClick={handleNextMonth}>Next</button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className={`${styles.weekday} ${day === '일' ? styles.red : ''} ${day === '토' ? styles.blue : ''}`}>
            {day}
          </div>
        ))}
      </div>

      <Selecto dragContainer={`.${styles.days}`}
               selectableTargets={[`.${styles.day}`]}
               onSelect={handleSelect}
               hitRate={0}
               selectByClick={true}
               selectFromInside={true}
               continueSelect={true}
               continueSelectWithoutDeselect={false}
               ratio={0} />
      <div className={styles.days}>
        {renderDays()}
      </div>

      <div>
        {selectedDates.length}
      </div>
      <div>
        {selectedDates.map((selectedDate: LocalDate) => `${selectedDate.monthValue()}.${selectedDate.dayOfMonth()}, `)}
      </div>
    </div>
  );
};

export default Calendar;
