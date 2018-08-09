import Component from '@ember/component';
import { computed } from '@ember/object';
import { DateTime } from 'luxon';

class DayInfo {
  constructor(dateTime) {
    const formattedString = dateTime.toFormat('cccc,d,LLLL');
    const [dayName, mDay, monthName] = formattedString.split(',');
    Object.assign(this, {dayName, mDay, monthName});
  }
}

export default Component.extend({
  tagName: '',

  dateInfo: computed('startingDate', function () {
    const date = DateTime.fromISO(this.get('startingDate'));
    return [
      new DayInfo(date),
      new DayInfo(date.plus({day: 1})),
      new DayInfo(date.plus({day: 2})),
      new DayInfo(date.plus({day: 3})),
      new DayInfo(date.plus({day: 4})),
      new DayInfo(date.plus({day: 5})),
      new DayInfo(date.plus({day: 6})),
    ]
  }),

  days: computed( function() {
    const shows = [
      [
        {title: 'Mermaid', time: '2p', id: 1},
      ],
      [ ],
      [
        {title: 'Mermaid', time: '8p', id: 1},
      ],
      [ ],
      [ ],
      [
        {title: 'Footloose', time: '8p', id: 2},
      ],
      [
        {title: 'Footloose', time: '8p', id: 2},
      ],
    ]
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
