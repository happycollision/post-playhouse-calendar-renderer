import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
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

  fastboot: service(),

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

  url: computed('dates', 'titles', function() {
    if (this.get('fastboot.isFastBoot')) { return '' }
    let hash = document.location.search + document.location.hash;
    const beforeHash = document.location.origin + document.location.pathname;
    // hash = hash.split('&').map(part => decodeURIComponent(part).replace(/ /g, '+').replace(/&/g, encodeURIComponent('&'))).join('&')
    hash = hash.replace(/%5B|%5D|%20|%2C|%27/g, (match) => {
      switch (match) {
        case '%5B': return '[';
        case '%5D': return ']';
        case '%20': return '+';
        case '%2C': return ',';
        case '%27': return '\'';
        default: return match;
      }
    })
    return (beforeHash + hash);
  }), 

  _changeTitle(index: number, newTitle: string, shortOrLong: 'short' | 'long') {
    const oldTitles: string[] = get(get(this, 'titles'), shortOrLong);
    const newTitles = oldTitles.concat([]);
    newTitles[index] = newTitle;
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
    changeLongTitle(index: number, ev: InputEvent) {
      ev.preventDefault();
      this._changeTitle(index, ev.target.value, 'long');
    },

    changeShortTitle(index: number, ev: InputEvent) {
      ev.preventDefault();
      this._changeTitle(index, ev.target.value, 'short');
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
    },

    addShow(ev: InputEvent) {
      ev.preventDefault();
      this.set('shortTitles', this.shortTitles + ',');
      this.set('longTitles', this.longTitles + ',');
      this.set('dates', this.dates + `[${this.get('titles').short.length}]`);
    },

    removeShow(index: number, ev: InputEvent) {
      ev.preventDefault();
      const shortTitles = this.shortTitles.split(',');
      const longTitles = this.longTitles.split(',');
      shortTitles.splice(index, 1);
      longTitles.splice(index, 1);
      this.set('shortTitles', shortTitles.join(','));
      this.set('longTitles', longTitles.join(','));
      let count = -1;
      this.set('dates', this.dates.replace(/\[\d*\][^&\[]*/g, (matched) => {
        return ++count === index ? '' : matched;
      }));
    }
  }

});
