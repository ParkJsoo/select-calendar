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

  const toggleDateSelection = (date: LocalDate) => {

    if (selectedDates.some((selectedDate: LocalDate) => selectedDate.equals(date))) {
      setSelectedDates(selectedDates.filter(selectedDate => !selectedDate.equals(date)));
    } else {
      setSelectedDates([...selectedDates, date]);
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
             className={`day ${isSelected ? 'selected' : ''} ${date.dayOfWeek().value() === 6 ? 'blue' : ''} ${date.dayOfWeek().value() === 7 ? 'red' : ''}`}>
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
             className={`day ${isSelected ? 'selected' : ''} ${date.dayOfWeek().value() === 6 ? 'blue' : ''} ${date.dayOfWeek().value() === 7 ? 'red' : ''}`}>
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
             className={`day ${isSelected ? 'selected' : ''} ${date.dayOfWeek().value() === 6 ? 'blue' : ''} ${date.dayOfWeek().value() === 7 ? 'red' : ''}`}>
          {nextMonthDaysToShow > 0 && day === 1 ? `${nextMonth.monthValue()}/${day}` : day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={'Calendar'}>
      <div className={'header'}>
        <div>
          {`${currentMonth.year()}.${currentMonth.monthValue()}`}
        </div>

        <button onClick={handlePrevMonth}>Prev</button>
        <button onClick={handleToday}>오늘</button>
        <button onClick={handleNextMonth}>Next</button>
      </div>

      <div className={'weekdays'}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day}
               className={`'weekday ${day === '일' ? 'red' : ''} ${day === '토' ? 'blue' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      <Selecto
        dragContainer={'.days'}
        selectableTargets={['.day']}
        onSelect={e => {
          console.log(e);

          e.added.forEach(el => {
            el.classList.add('selected');
          });
          e.removed.forEach(el => {
            el.classList.remove('selected');
          });
        }}
        hitRate={0}
        selectByClick={true}
        selectFromInside={true}
        continueSelect={true}
        continueSelectWithoutDeselect={false}
        ratio={0}
      ></Selecto>
      <div className={'days'}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;