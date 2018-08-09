import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  showData: computed(function() {
    return [
      {
        startingDate: '2018-06-03',
        showsByDay: [
          [{title: 'Mermaid', time: '2p', id: 1}],
          [],
          [{title: 'Mermaid', time: '8p', id: 1}],
          [],
          [],
          [{title: 'Footloose', time: '8p', id: 2}],
          [{title: 'Footloose', time: '8p', id: 2}],
        ]
      }
    ]
  })
});
