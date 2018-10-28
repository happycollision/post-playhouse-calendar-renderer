import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['day'],
  classNameBindings: ['isDark:dark', 'whichDay', 'whichWeekday', 'isError:error'],
  whichWeekday: computed('dayNameFull', function() { return `${this.dayNameFull.toLowerCase()}`;}),
  whichDay: computed('mDay', function() { return `day-${this.mDay}`;}),

  displayMonthName: computed('monthName', function() {
    let monthName = this.monthName;
    switch (monthName) {
      // case 'Jun': return 'June';
      // case 'Jul': return 'July';
      default: return monthName;
    }
  }),

  dayNameShort: computed('dayNameFull', function() {
    return this.dayNameFull.substring(0, 3)
  }),

  isDark: computed('shows', function() {
    const length = this.get('shows.length');
    return (length === 0 || length === undefined)
  }),

  isError: computed('shows', 'dayNameFull', function() {
    const {shows, dayNameFull, isEditing} = this.getProperties('shows', 'dayNameFull', 'isEditing')
    if (!isEditing) return false;
    if (shows.length === 0) return false;
    
    // Sunday time other than 2pm
    if (dayNameFull === 'Sunday') {
      if (shows.length > 1) return true;
      if (shows[0].time !== '2p') return true;
    }

    // 10am is on a non Saturday
    if (dayNameFull !== 'Saturday') {
      if (shows.some(s => s.time === '10a')) return true;
    }

    // multiple showings
    const counts = {m: 0, a: 0, e: 0};
    shows.forEach(show => {
      switch (show.time) {
        case '10a': counts.m = counts.m + 1; return;
        case '2p': counts.a = counts.a + 1; return;
        case '8p': counts.e = counts.e + 1; return;
      }
    })
    for (const prop in counts) {
      if (counts[prop] > 1) return true;
    }

    // all clear!
    return false;
  }),
});
