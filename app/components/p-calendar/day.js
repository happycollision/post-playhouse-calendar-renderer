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
});
