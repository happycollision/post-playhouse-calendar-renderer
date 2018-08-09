import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

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
    const mdays = [3,4,5,6,7,8,9];
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return mdays.map(function(mDay, i) {
      return {
        mDay,
        monthName: 'June',
        shows: shows[i],
        dayNameFull: dayNames[i],
      };
    })
  })
});
