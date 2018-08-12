import Component from '@ember/component';
import { computed } from '@ember/object';
import { DateTime } from 'luxon';

class DayInfo {
  constructor(dateTime) {
    const formattedString = dateTime.toFormat('cccc,d,LLL');
    const [dayName, mDay, monthName] = formattedString.split(',');
    Object.assign(this, {dayName, mDay, monthName});
  }
}

export default Component.extend({
  tagName: '',

  dateInfo: computed('startingDate', function () {
    const date = DateTime.fromISO(this.get('startingDate'));
    const times = 7 - (date.weekday === 7 ? 0 : date.weekday);
    const backPadding = this.get('backPadding') | 0;

    return Array.from(new Array(times - backPadding)).map(function(_, i) {
      return new DayInfo(date.plus({day: i}))
    })
  }),

  days: computed( function() {
    const shows = this.get('showsByDay');
    const dateInfo = this.get('dateInfo');
    return dateInfo.map(function(day, i) {
      return {
        mDay: day.mDay,
        monthName: day.monthName,
        shows: shows[i],
        dayNameFull: day.dayName,
      };
    })
  })
});
