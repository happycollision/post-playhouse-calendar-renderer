import Component from '@ember/component';
import { computed } from '@ember/object';

class ShowData {
  constructor(id, time) {
    this.id = id;
    this.time = time;
    switch (id) {
      case 1: this.title = 'Mermaid'; break;
      case 2: this.title = 'Footloose'; break;
      case 3: this.title = 'Chitty'; break;
      case 4: this.title = 'Urinetown'; break;
      case 5: this.title = '42nd St'; break;
    }
  }
}

export default Component.extend({
  shorthandShowData: computed(function() {
    return [
      {
        startingDate: '2018-06-03',
        showData: [
          {a:1},
          {},
          {e:1},
          {},
          {},
          {e:2},
          {e:2},
        ]
      },
      {
        startingDate: '2018-06-10',
        showData: [
          {a:2},
          {},
          {e:1},
          {e:2},
          {},
          {e:3},
          {e:3},
        ]
      },
      {
        startingDate: '2018-06-17',
        showData: [
          {a:3},
          {},
          {e:2},
          {e:1},
          {e:3},
          {e:1},
          {e:2},
        ]
      },
      {
        startingDate: '2018-06-24',
        showData: [
          {a:1},
          {},
          {e:3},
          {e:2},
          {},
          {e:4},
          {e:4},
        ]
      },
      {
        startingDate: '2018-07-01',
        showData: [
          {a:4},
          {},
          {e:3},
          {e:1},
          {},
          {e:5},
          {a:2, e:5},
        ]
      },
      {
        startingDate: '2018-07-08',
        showData: [
          {a:5},
          {},
          {e:5},
          {a:3, e:4},
          {e:2},
          {a:3, e:4},
          {a:5, e:1},
        ]
      },
      {
        startingDate: '2018-07-15',
        showData: [
          {a:3},
          {},
          {e:2},
          {a:5, e:1},
          {e:4},
          {e:2},
          {m:1, a:3, e:5},
        ]
      },
      {
        startingDate: '2018-07-22',
        showData: [
          {a:1},
          {},
          {e:3},
          {a:1, e:5},
          {e:2},
          {e:4},
          {m:3, a:1, e:5},
        ]
      },
      {
        startingDate: '2018-07-29',
        showData: [
          {a:2},
          {},
          {e:1},
          {a:5, e:3},
          {e:2},
          {e:4},
          {m:1, a:3, e:2},
        ]
      },
      {
        startingDate: '2018-08-05',
        showData: [
          {a:5},
          {},
          {e:3},
          {a:1, e:4},
          {e:3},
          {e:2},
          {m:1, a:4, e:3},
        ]
      },
      {
        startingDate: '2018-08-12',
        showData: [
          {a:1},
          {},
          {e:4},
          {a:2, e:5},
          {e:1},
          {e:3},
          {a:1, e:4},
        ]
      },
      {
        startingDate: '2018-08-19',
        showData: [
          {a:3},
        ]
      },
    ]
  }),

  weeksData: computed('shorthandShowData', function() {
    return this.get('shorthandShowData').map(function(data) {
      const {showData, startingDate} = data;
      const showsByDay = showData.map(function(shorthand) {
        const output = [];
        const {m, a, e} = shorthand;
        if (m) { output.push(new ShowData(m, '10a'))}
        if (a) { output.push(new ShowData(a, '2p'))}
        if (e) { output.push(new ShowData(e, '8p'))}
        return output;
      });
      return {startingDate, showsByDay};
    })
  })
});
