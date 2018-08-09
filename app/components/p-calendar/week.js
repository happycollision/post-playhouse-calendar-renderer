import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  dateInfo: computed('startingDate', function () {
    return [
      {dayName: 'Sunday', mDay: 3, monthName: 'June'},
      {dayName: 'Monday', mDay: 4, monthName: 'June'},
      {dayName: 'Tuesday', mDay: 5, monthName: 'June'},
      {dayName: 'Wednesday', mDay: 6, monthName: 'June'},
      {dayName: 'Thursday', mDay: 7, monthName: 'June'},
      {dayName: 'Friday', mDay: 8, monthName: 'June'},
      {dayName: 'Saturday', mDay: 9, monthName: 'June'},
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
