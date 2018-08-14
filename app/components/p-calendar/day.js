import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  displayMonthName: computed('monthName', function() {
    let monthName = this.get('monthName');
    switch (monthName) {
      case 'Jun': return 'June';
      case 'Jul': return 'July';
      default: return monthName;
    }
  }),

  isDark: computed('shows', function() {
    const length = this.get('shows.length');
    return (length === 0 || length === undefined)
  }),
});