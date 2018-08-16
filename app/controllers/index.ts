import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { DateTime } from 'luxon';

type InputEvent = Event & {target: HTMLInputElement};

const DEFAULT_TITLES = 'Mermaid,Footloose,Chitty,Urinetown,42nd St';
const DEFAULT_LONG_TITLES = 'Disney\'s The Little Mermaid,Footloose,Chitty Chitty Bang Bang,Urinetown,42nd Street';
const DEFAULT_DATES = '2018-06-01' +
  '[1]a3b3c2e3l3t3v3x20d3n3r3u1v2y2B2E30d1h2k1l2p3r2' +
  '[2]h3i3j2m3s3w3A30g2l3q3t3z3C20b3d3j3o2' +
  '[3]o3p3q2u3z30c3k2m2o2u2x3B10a3d2g3i3k3q3s2' +
  '[4]C3D30a2k3m3s3A30c3h3k2n3r3' +
  '[5]0f3g3h2j3n2r2u3y3B30a2e2o3';

interface IIdLookup {
  [x: number]: any;
}

interface IDayShowings {
  m?: number;
  a?: number;
  e?: number;
}

interface IShorthandObject {
  startingDate: string;
  showData: IDayShowings[];
}

type TShowingCode = 'm' | 'a' | 'e' | 'ma' | 'me' | 'ae' | 'mae';

class ShowData {
  title: string;
  constructor(public id: number, public time: string, idLookup: IIdLookup = {}) {
    this.title = idLookup[id] || 'NO TITLE';
  }
}

function getPaddingFor(startingDate: string): number {
  const dateTime = DateTime.fromISO(startingDate);
  return dateTime.weekday === 7 ? 0 : dateTime.weekday;
}

function getDaysFromDateId(dateId: string) {
  return 'abcdefghijklmnopqrstuvwxyzABCDE'.indexOf(dateId)
}

function getDateIdFromDay(day: string | number) {
  day = typeof day === 'string' ? parseInt(day, 10) : day;
  return 'abcdefghijklmnopqrstuvwxyzABCDE'[day - 1]
}

function notEnoughMonths(value: string, monthsFromStart: number) { 
  if (value === undefined) throw new Error('no value given for comparing to months'); 
  return (value.match(/0/g) || []).length < monthsFromStart; 
} 

function shorthandToUrl(shorthandObj: IShorthandObject) { 
  const {startingDate, showData} = shorthandObj; 
  const startingDay = DateTime.fromISO(startingDate).startOf('day'); 
  const dataString = showData.reduce((acc: string[],cur,i) => { 
    const today = startingDay.plus({days: i})
    const yearsFromStart = today.year - startingDay.year;
    const monthsFromStart = Math.abs(today.month - startingDay.month) + yearsFromStart * 12;
    const {m,a,e} = cur; 
    const showsToday = []; 
    if (m) showsToday[m] = 'm'; 
    if (a) showsToday[a] = (showsToday[a] || '') + 'a'; 
    if (e) showsToday[e] = (showsToday[e] || '') + 'e'; 
    showsToday.forEach((showingGroup: TShowingCode, i) => { 
      if (!acc[i]) acc[i] = ''; 
      while(notEnoughMonths(acc[i], monthsFromStart)) { acc[i] += '0'; } 
      acc[i] += getDateIdFromDay(today.day) + getShowingIdFromGroup(showingGroup); 
    }) 
 
    return acc 
  }, []).reduce((a, c, i) => { 
    return a + `[${i}]` + c 
  }, '') 
  return `${startingDate}${dataString}`; 
}

function fullCodeStringToReadable(str: string) {
  const {startingDateString, showsDates} = urlCodeParts(str);
  const startingDate = DateTime.fromISO(startingDateString);
  let year = startingDate.toFormat('yyyy');

  return showsDates.map(dateCodes => {
    let output = year + '\n';
    let runningMonth = startingDate.startOf('month');
    output += `${runningMonth.toFormat('LLLL')} `
    dateCodeStringToTokens(dateCodes).forEach((token) => {
      if (token === '0') {
        runningMonth = runningMonth.plus({months: 1});
        output += `\n${runningMonth.toFormat('LLLL')} `
        return;
      }
      const [dateId, slotId] = token;
      output += `${getDaysFromDateId(dateId) + 1}${getSlotShorthandFromSlotsId(slotId)}, `
    })
    return output;
  });
}

function dateCodeStringToTokens(str: string) {
  return str.match(/(0|.{2})/g) || []
}

function getSlotShorthandFromSlotsId(slotsId: string) {
  switch (slotsId) {
    case '1': return 'm';
    case '2': return 'a';
    case '3': return 'e';
    case '4': return 'ma';
    case '5': return 'me';
    case '6': return 'ae';
    case '7': return 'mae';
    default: throw new Error('unknown slotId of ' + slotsId);
  }
}

function getShorthandObj(slotsId: string, showId: number): IDayShowings {
  let props = getSlotShorthandFromSlotsId(slotsId);
  const output: any = {};
  Array.from(props).forEach(letter => output[letter] = showId);
  return output;
}

function urlCodeParts(urlCode: string) {
  const [startingDateString, ...showsDates] = urlCode.split(/\[\d*\]/g);
  return {startingDateString, showsDates};
}

function urlToShorthandPerShow(urlCode: string) {
  const {startingDateString, showsDates} =  urlCodeParts(urlCode);
  return showsDates.map((c, showIndex) => {
    const showId = showIndex + 1;
    const dates: IDayShowings[] = [];
    let startingDate = DateTime.fromISO(startingDateString);
    let addedMonths = 0;
    dateCodeStringToTokens(c).forEach((input) => {
      if (input === '0') {
        addedMonths++;
        return;
      }
      const [dateId, slotsId] = input.split('');
      const days = getDaysFromDateId(dateId);
      const daysFromStart = startingDate.startOf('month').plus({months: addedMonths, days}).diff(startingDate, 'days').toObject().days || 0;
      dates[daysFromStart] = getShorthandObj(slotsId, showId)
    })
    const a = [];
    for (let index = 0; index < dates.length; index++) {
      a[index] = Object.assign({}, dates[index] || {});
    }
    return a;
  });
}

function urlToShorthand(urlCode: string): IShorthandObject {
  const {startingDateString: startingDate} =  urlCodeParts(urlCode);
  const showData = urlToShorthandPerShow(urlCode).reduce((a, perfsForCurrentShow) => {
    const longestLength = Math.max(a.length, perfsForCurrentShow.length);
    for (let index = 0; index < longestLength; index++) {
      a[index] = Object.assign(a[index] || {}, perfsForCurrentShow[index] || {});
    }
    return a
  }, [])
  return {startingDate, showData}
}

function getShowingIdFromGroup(group: TShowingCode) {
  switch(group) {
    case 'm': return 1;
    case 'a': return 2;
    case 'e': return 3;
    case 'ma': return 4;
    case 'me': return 5;
    case 'ae': return 6;
    case 'mae': return 7;
    default: throw new Error('unrecognized grouping: ' + group);
  }
}

function getUrlTokenFromReadableToken(token: string) {
  const [day, showing] = (token.match(/(\d{1,2}|[mae]{1,3})/g) || []) as [string, TShowingCode];
  return `${getDateIdFromDay(day)}${getShowingIdFromGroup(showing)}`;
}

function findEarliestStartDate(readables: string[]) {
  let earliestStartingDate = DateTime.local().plus({years: 5});
  readables.forEach((text) => {
    const tokens = (text.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g)||[]).map(t => t.replace(/,/g, '').trim())
    let runningDate = DateTime.local().startOf('year');
    let confirmedDate = false;
    tokens.forEach((token) => {
      if (confirmedDate) return;
      if (/\d{1,2}[mae]{1,3}/.test(token)) {
        confirmedDate = true;
        runningDate = runningDate.set({day: parseInt(token)})
        if (runningDate < earliestStartingDate) earliestStartingDate = runningDate;
      } else if (/\d{4}/.test(token)) {
        const newYear = DateTime.fromISO(`${token}-01-01`);
        runningDate = newYear;
      } else {
        const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(token.toLowerCase()) + 1
        let newMonth = runningDate.set({month})
        if (newMonth < runningDate) {
          newMonth = newMonth.plus({years: 1});
        }
        runningDate = newMonth;
      }
    })
  });
  return earliestStartingDate;
}

function monthsDiffFromDays(first: DateTime, second: DateTime): number {
  const yearsDiff = second.year - first.year;
  const monthsDiff = second.month - first.month;
  return yearsDiff * 12 + monthsDiff;
}

function readablesToUrl(readables: string[]) {
  let earliestStartingDate = findEarliestStartDate(readables)
  const showsDates = readables.map((text, i) => {
    let runningDate = earliestStartingDate
    let lastConfirmedDate = earliestStartingDate;
    let output = `[${i+1}]`;
    const tokens = (text.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g) || []).map(t => t.replace(/,/g, '').trim())
    tokens.forEach((token) => {
      if (/\d{1,2}[mae]{1,3}/.test(token)) {
        output += getUrlTokenFromReadableToken(token)
        runningDate = runningDate.set({day: parseInt(token)})
        lastConfirmedDate = runningDate; 
      } else if (/\d{4}/.test(token)) {
        const newYear = DateTime.fromISO(`${token}-01-01`);
        runningDate = newYear;
      } else {
        const month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].indexOf(token.toLowerCase()) + 1
        let newMonth = runningDate.set({month})
        if (newMonth < runningDate) {
          newMonth = newMonth.plus({years: 1});
        }
        runningDate = newMonth;
        if (lastConfirmedDate) {
          const monthsDiff = monthsDiffFromDays(lastConfirmedDate, newMonth);
          Array.from(new Array(monthsDiff)).forEach(() => output += '0')
        }
      }
    })
    return output;
  });
  return earliestStartingDate.toFormat('yyyy-MM-dd') + showsDates.join('');
}

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
