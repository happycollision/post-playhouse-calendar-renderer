import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  firstOfMonthIdentifier: computed('monthName', 'mDay', function() {
    const {monthName, mDay} = this.getProperties('monthName', 'mDay');
    if (mDay === 1 || mDay === '1') {
      return monthName.toLowerCase()
    }
    return '';
  }),

  sanitizedMonthName: computed('monthName', function() {
    const monthName = this.get('monthName');
    return monthName === 'August' ? 'Aug' : monthName;
  }),

  isDark: computed('shows', function() {
    const length = this.get('shows.length');
    return (length === 0 || length === undefined)
  }),
});
