import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { DateTime } from 'luxon';

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

function getPaddingFor(startingDate) {
  const dateTime = DateTime.fromISO(startingDate);
  return dateTime.weekday === 7 ? undefined : dateTime.weekday;
}


export default Controller.extend({
  shorthandShowData: computed(function() {
    return {
        startingDate: '2018-06-01',
        showData: [
          {e:1},
          {e:1},
          {a:1},
          {},
          {e:1},
          {},
          {},
          {e:2},
          {e:2},
          {a:2},
          {},
          {e:1},
          {e:2},
          {},
          {e:3},
          {e:3},
          {a:3},
          {},
          {e:2},
          {e:1},
          {e:3},
          {e:1},
          {e:2},
          {a:1},
          {},
          {e:3},
          {e:2},
          {},
          {e:4},
          {e:4},
          {a:4},
          {},
          {e:3},
          {e:1},
          {},
          {e:5},
          {a:2, e:5},
          {a:5},
          {},
          {e:5},
          {a:3, e:4},
          {e:2},
          {a:3, e:4},
          {a:5, e:1},
          {a:3},
          {},
          {e:2},
          {a:5, e:1},
          {e:4},
          {e:2},
          {m:1, a:3, e:5},
          {a:1},
          {},
          {e:3},
          {a:1, e:5},
          {e:2},
          {e:4},
          {m:3, a:1, e:5},
          {a:2},
          {},
          {e:1},
          {a:5, e:3},
          {e:2},
          {e:4},
          {m:1, a:3, e:2},
          {a:5},
          {},
          {e:3},
          {a:1, e:4},
          {e:3},
          {e:2},
          {m:1, a:4, e:3},
          {a:1},
          {},
          {e:4},
          {a:2, e:5},
          {e:1},
          {e:3},
          {a:1, e:4},
          {a:3},
        ]
      };
  }),


  xweeksData: computed('shorthandShowData', function() {
    const cd = this.get('shorthandShowData');
    const oldData = [].concat(cd.showData);
    const firstWeekLength = 7 - getPaddingFor(cd.startingDate);
    const showData = [oldData.splice(0, firstWeekLength)];
    while(oldData.length) {
      showData.push(oldData.splice(0, 7));
    }

    return showData.map((showData, i) => {
      const result = {
        startingDate: DateTime.fromISO(cd.startingDate).plus({days: i === 0 ? 0 : firstWeekLength + ((i - 1) * 7)}).toFormat('yyyy-MM-dd'),
        showData,
      }
      return result;
    })
  }),

  weeksData: computed('xweeksData', function() {
    const xweeksData = this.get('xweeksData');
    return xweeksData.map(function(data, i) {
      const {showData, startingDate} = data;
      const frontPadding = getPaddingFor(startingDate);
      const showsByDay = showData.map(function(shorthand) {
        const output = [];
        const {m, a, e} = shorthand;
        if (m) { output.push(new ShowData(m, '10a'))}
        if (a) { output.push(new ShowData(a, '2p'))}
        if (e) { output.push(new ShowData(e, '8p'))}
        return output;
      });
      const backPadding = i === xweeksData.length - 1
        ? 7 - showsByDay.length
          : undefined;
      return {startingDate, showsByDay, frontPadding, backPadding};
    })
  })

});
