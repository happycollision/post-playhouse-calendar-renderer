import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { DateTime } from 'luxon';
import {
  DEFAULT_TITLES,
  DEFAULT_DATES,
  DEFAULT_LONG_TITLES,
  urlToShorthand,
  fullCodeStringToReadable,
  IShorthandObject,
  IDayShowings,
  getPaddingFor,
  IIdLookup,
  ShowData,
  shorthandToUrl,
  readablesToUrl,
} from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

type InputEvent = Event & {target: HTMLInputElement};



export default Controller.extend({
  queryParams: {
    shortTitles: { replace: true },
    longTitles: { replace: true },
    dates: { replace: true },
    editing: { replace: true },
  },
  shortTitles: DEFAULT_TITLES,
  longTitles: DEFAULT_LONG_TITLES,
  dates: DEFAULT_DATES,
  editing: false,

  shorthandShowData: computed('dates', function() {
    return urlToShorthand(this.dates);
  }),

  readableDates: computed('dates', function() {
    return fullCodeStringToReadable(this.dates);
  }),

  xweeksData: computed('shorthandShowData', function(): IShorthandObject[] {
    const cd: IShorthandObject = this.shorthandShowData;
    const oldData: IDayShowings[] = [...cd.showData];
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

  weeksData: computed('xweeksData', 'titles', function() {
    const xweeksData: IShorthandObject[] = this.xweeksData;
    const titles: {short: string[], long: string[]} = this.titles;
    const idLookup = titles.short.reduce((a,c, i) => {
      a[i+1] = c;
      return a;
    }, {} as IIdLookup)

    return xweeksData.map(function(data, i) {
      const {showData, startingDate} = data;
      const frontPadding = getPaddingFor(startingDate);
      const showsByDay = showData.map(function(shorthand) {
        const output = [];
        const {m, a, e} = shorthand;
        if (m) { output.push(new ShowData(m, '10a', idLookup))}
        if (a) { output.push(new ShowData(a, '2p', idLookup))}
        if (e) { output.push(new ShowData(e, '8p', idLookup))}
        return output;
      });
      const backPadding = i === xweeksData.length - 1
        ? 7 - showsByDay.length
          : undefined;
      return {startingDate, showsByDay, frontPadding: frontPadding === 0 ? undefined : frontPadding, backPadding};
    })
  }),

  titles: computed('shortTitles', 'longTitles', function() {
    const {shortTitles, longTitles} = this;
    return {
      short: shortTitles.split(','),
      long: longTitles.split(','),
    };
  }),

  _changeTitle(originalTitle: string, ev: InputEvent, shortOrLong: 'short' | 'long') {
    ev.preventDefault();
    const newVal = ev.target.value;
    const oldTitles: string[] = get(get(this, 'titles'), shortOrLong);
    const newTitles = oldTitles.map(t => {
      if (t !== originalTitle) return t;
      return newVal;
    });
    const theProp = `${shortOrLong}Titles` as 'shortTitles' | 'longTitles';
    this.set(theProp, newTitles.join(','))
  },

  _shiftDates(incrementType: string, numIncrements: number) {
    const data: IShorthandObject = Object.assign({}, this.shorthandShowData as any);
    const {startingDate} = data;
    const incrementor: {[s: string]: any} = {}
    incrementor[incrementType] = numIncrements;
    const newStartingDate = DateTime.fromISO(startingDate).plus(incrementor).toFormat('yyyy-MM-dd');
    data.startingDate = newStartingDate;
    this.set('dates', shorthandToUrl(data));
  },

  actions: {
    changeLongTitle(originalTitle: string, ev: InputEvent) {
      this._changeTitle(originalTitle, ev, 'long');
    },

    changeShortTitle(originalTitle: string, ev: InputEvent) {
      this._changeTitle(originalTitle, ev, 'short');
    },

    changeReadableDates(index: number, ev: InputEvent) {
      const newVal = ev.target.value;
      const newObj: string[] = ((this.readableDates as any) as string[]).concat([]);
      newObj[index] = newVal;
      this.set('dates', readablesToUrl(newObj));
    },

    shiftDays(numDays: number, ev: InputEvent) {
      ev.preventDefault();
      this._shiftDates('days', numDays);
    }
  }

});
