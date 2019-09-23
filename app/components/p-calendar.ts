import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { ShowData, ShowingsData } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';
import { computed } from '@ember-decorators/object';
import { DateTime } from 'luxon';

type WeeksData = Array<{
  backPadding?: number;
  frontPadding?: number;
  showsByDay: Array<Array<ShowData>>;
  startingDate: string;
}>;

function weekForDate(date: DateTime | number | string) {
  let dateTime: DateTime;
  if (typeof date === 'number') {
    dateTime = DateTime.fromMillis(date);
  } else if (typeof date === 'string') {
    dateTime = DateTime.fromISO(date);
  } else {
    dateTime = date;
  }

  return dateTime.minus({ days: dateTime.weekday % 7 });
}

function timeForHour(hour: number) {
  switch (hour) {
    case 10:
      return '10a';
    case 14:
      return '2p';
    case 20:
      return '8p';
    default:
      throw new Error('Not enough known times to translate hour: ' + hour);
  }
}

@tagName('')
export default class PCalendar extends Component {
  showingsData!: ShowingsData;

  @computed('showingsData')
  get longTitles(): string[] {
    return this.showingsData.titles.full;
  }

  @computed('showingsData')
  get weeksData(): WeeksData {
    const agenda = this.showingsData.calendar.getDates();
    const firstDate = DateTime.fromISO(agenda[0].date);
    const frontPadding = firstDate.weekday % 7;
    const lastDate = DateTime.fromISO(agenda[agenda.length - 1].date);
    const backPadding = 6 - (lastDate.weekday % 7);
    //getting closer...
    return agenda
      .reduce<Array<Array<typeof agenda[0]>>>(
        (allWeeks, day) => {
          const weekForThisDay = weekForDate(day.date);
          const currentWeek = allWeeks[allWeeks.length - 1];
          const maybePreviousDay = currentWeek[currentWeek.length - 1];

          if (!maybePreviousDay) {
            currentWeek.push(day);
            return allWeeks;
          }
          const weekForPreviousDay = weekForDate(maybePreviousDay.date);

          if (weekForPreviousDay.hasSame(weekForThisDay, 'day')) {
            currentWeek.push(day);
          } else {
            allWeeks.push([day]);
          }

          return allWeeks;
        },
        [[]],
      )
      .map((week, i, allWeeks) => {
        return {
          frontPadding: i === 0 ? frontPadding : undefined,
          backPadding: i === allWeeks.length - 1 ? backPadding : undefined,
          showsByDay: week.map(day =>
            day.showings.map(showing => ({
              id: showing.productionId,
              time: timeForHour(showing.dateTime.hour),
              title: showing.title.short,
            })),
          ),
          startingDate: i === 0 ? week[0].date : weekForDate(week[0].date).toISODate(),
        };
      });
  }
}
