import { DateTime } from 'luxon';
import EmberObject from '@ember/object';
import { computed } from '@ember-decorators/object';

export const DEFAULT_TITLES = 'Mermaid,Footloose,Chitty,Urinetown,42nd St';
export const DEFAULT_LONG_TITLES = 'Disney\'s The Little Mermaid,Footloose,Chitty Chitty Bang Bang,Urinetown,42nd Street';
export const DEFAULT_DATES = '2018-06-01' +
  '[1]a3b3c2e3l3t3v3x20d3n3r3u1v2y2B2E30d1h2k1l2p3r2' +
  '[2]h3i3j2m3s3w3A30g2l3q3t3z3C20b3d3j3o2' +
  '[3]o3p3q2u3z30c3k2m2o2u2x3B10a3d2g3i3k3q3s2' +
  '[4]C3D30a2k3m3s3A30c3h3k2n3r3' +
  '[5]0f3g3h2j3n2r2u3y3B30a2e2o3';

export interface IIdLookup {
  [x: number]: any;
}

export interface IDayShowings {
  m?: number[];
  a?: number[];
  e?: number[];
}

export interface IShorthandObject {
  startingDate: string;
  showData: IDayShowings[];
}

type TShowingCode = 'm' | 'a' | 'e' | 'ma' | 'me' | 'ae' | 'mae';

export class ShowData {
  title: string;
  constructor(public id: number, public time: string, idLookup: IIdLookup = {}) {
    this.title = idLookup[id] || 'NO TITLE';
  }
}

const MATCH_SHOWING_CODE = /\d{1,2}[mae]{1,3}/;
const SPLIT_SHOWING_CODE = /(\d{1,2}|[mae]{1,3})/g;
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function getPaddingFor(startingDate: string): number {
  const dateTime = DateTime.fromISO(startingDate);
  return dateTime.weekday === 7 ? 0 : dateTime.weekday;
}

function getDaysFromDateId(dateId: string) {
  return 'abcdefghijklmnopqrstuvwxyzABCDE'.indexOf(dateId) + 1
}

function getDateIdFromDay(day: string | number) {
  day = typeof day === 'string' ? parseInt(day, 10) : day;
  return 'abcdefghijklmnopqrstuvwxyzABCDE'[day - 1]
}

function notEnoughMonths(value: string, monthsFromStart: number) { 
  if (value === undefined) throw new Error('no value given for comparing to months'); 
  return (value.match(/0/g) || []).length < monthsFromStart; 
} 

export function shorthandToUrl(shorthandObj: IShorthandObject) { 
  const {startingDate, showData} = shorthandObj; 
  const startingDay = DateTime.fromISO(startingDate).startOf('day'); 
  const dataString = showData.reduce((acc: string[],cur,i) => { 
    const today = startingDay.plus({days: i})
    const yearsFromStart = today.year - startingDay.year;
    const monthsFromStart = Math.abs(today.month - startingDay.month) + yearsFromStart * 12;
    const {m,a,e} = cur; 
    const showsToday: string[] = []; // the string will be 'm', 'a', 'e', 'ma', 'me', 'ae' etc.
    if (m) {
      m.forEach(showId => showsToday[showId] = 'm')
    }
    if (a) {
      a.forEach(showId => showsToday[showId] = showsToday[showId] ? showsToday[showId] + 'a': 'a');
    }
    if (e) {
      e.forEach(showId => showsToday[showId] = showsToday[showId] ? showsToday[showId] + 'e' : 'e');
    }
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

function isMonthName(str: string): boolean {
  return MONTHS.includes(str.toLowerCase());
}

export function idTokenToShowingToken(token: string): string {
  const [dateId, slotId] = token;
  return `${getDaysFromDateId(dateId)}${getSlotShorthandFromSlotsId(slotId)}`;
}

function dayOfMonthAndShowingsFromToken(token: string) {
  const [dateId, slotsId] = token;
  const dayOfMonth = getDaysFromDateId(dateId);
  let props = getSlotShorthandFromSlotsId(slotsId);
  const showings: {timeString: string}[] = [];
  Array.from(props).forEach((letter: 'm'|'a'|'e') => {
    switch (letter) {
      case 'm': showings.push({timeString: '10am'}); break;
      case 'a': showings.push({timeString: '2pm'}); break;
      case 'e': showings.push({timeString: '8pm'}); break;
    }
  });

  return {dayOfMonth, showings}
}

export function urlPartsToData(shortTitlesUrl: string, longTitlesUrl: string, datesUrl: string) {
  const titles = {
    short: shortTitlesUrl.split(','),
    long: longTitlesUrl.split(','),
  };
  const {startingDateString, showsDates} = urlCodeParts(datesUrl);
  const startingDate = DateTime.fromISO(startingDateString);

  const agenda = showsDates.map((dateCodes, i) => {
    let runningMonth = startingDate.startOf('month');
    
    return dateCodeStringToTokens(dateCodes).reduce((acc, token) => {
      if (token === '0') {
        runningMonth = runningMonth.plus({months: 1});
        return acc;
      }
      const {dayOfMonth, showings} = dayOfMonthAndShowingsFromToken(token);
      const theDate = runningMonth.plus({days: dayOfMonth - 1});
      return acc.concat([{
        timestamp: theDate.toMillis(),
        dateString: theDate.toFormat('LLLL d'),
        performances: showings.map(s => ({...s, shortTitle: titles.short[i], fullTitle: titles.long[i]}))
      }]);
    }, [] as AgendaDayData[])
  }).reduce((a, b) => a.concat(b));
  return mergeStrictAgendaDates(agenda);
}

export class ShowingsData extends EmberObject {
  constructor(
    public shortTitlesUrl: string,
    public fullTitlesUrl: string,
    public datesUrl: string
  ) {
    super();
  }
  
  @computed('shortTitlesUrl', 'fullTitlesUrl')
  get titles(): {short: string[], full: string[]} {
    return {
      short: this.shortTitlesUrl.split(','),
      full: this.fullTitlesUrl.split(','),  
    }
  }
  set titles(input: {short: string[], full: string[]}) {
    this.set('shortTitlesUrl', input.short.join(','));
    this.set('fullTitlesUrl', input.full.join(','));
  }
  
  @computed('agendasPerShow')
  get agendaForAllShows(): DataAgenda {
    return mergeStrictAgendaDates(this.agendasPerShow.reduce((a, b) => a.concat(b)));
  }

  @computed('shortTitlesUrl', 'fullTitlesUrl', 'datesUrl')
  get agendasPerShow(): DataAgenda[] {
    return this.dataConversion(this.datesUrl);
  }

  private dataConversion(datesUrl: string) {
    const {startingDateString, showsDates} = urlCodeParts(datesUrl);
    const startingDate = DateTime.fromISO(startingDateString);
  
    return showsDates.map((dateCodes, i) => {
      let runningMonth = startingDate.startOf('month');
      
      return dateCodeStringToTokens(dateCodes).reduce((acc, token) => {
        if (token === '0') {
          runningMonth = runningMonth.plus({months: 1});
          return acc;
        }
        const {dayOfMonth, showings} = dayOfMonthAndShowingsFromToken(token);
        const theDate = runningMonth.plus({days: dayOfMonth - 1});
        return acc.concat([{
          timestamp: theDate.toMillis(),
          dateString: theDate.toFormat('LLLL d'),
          performances: showings.map(s => ({...s, shortTitle: this.titles.short[i], fullTitle: this.titles.full[i]}))
        }]);
      }, [] as AgendaDayData[])
    });
  }
}

export function fullCodeStringToReadable(str: string) {
  const {startingDateString, showsDates} = urlCodeParts(str);
  const startingDate = DateTime.fromISO(startingDateString);
  let year = startingDate.toFormat('yyyy');

  return showsDates.map(dateCodes => {
    let output = year;
    let runningMonth = startingDate.startOf('month');
    
    dateCodeStringToTokens(dateCodes).map((token) => {
      if (token === '0') {
        runningMonth = runningMonth.plus({months: 1});
        return runningMonth.toFormat('LLLL');
      }
      return idTokenToShowingToken(token);
    }).reduce((acc: string[], token, i, _init) => {
      // if (token === 'May' || token === 'June') debugger
      if (i === 0 && isShowingCode(token)) {
        acc.push(startingDate.toFormat('LLLL'));
      }
      const lastToken = acc[acc.length - 1];
      if (isMonthName(token) && lastToken) {
        if (isMonthName(lastToken)) {
          acc[acc.length - 1] = token;
          return acc;
        }
      }
      acc.push(token);
      return acc;
    }, []).forEach(token => {
      if (isMonthName(token)) return output += `\n${token}`;
      if (isShowingCode(token)) return output += ` ${token},`;
      return // should be nothing left
    })
    return output;
  });
}

export function fullCodeStringToPublishable(str: string) {
  return fullCodeStringToReadable(str)
  .map(readableString => {
    return readableString
      .replace(/\d{4}\s+/g, '')
      .replace(/(\d{1,2})([mae]{1,3})/g, (_fullMatch, p1, p2) => {
        const values = {m: 1, a: 2, e: 3};
        const date: string = p1;
        const times: string[] = p2.split('');
        times.sort((a: 'm'|'a'|'e', b: 'm'|'a'|'e') => {
          const val1 = values[a];
          const val2 = values[b];
          return val1 - val2;
        })
        return times.map(t => `${date}${t}`).join(', ')
      })
      .replace(/(\d{1,2})([mae])/g, (_full, p1, p2: 'm'|'a'|'e') => {
        const replacements = { m: '‡', a: '*', e: '' };
        return `${p1}${replacements[p2]}`;
      })
      .replace(/,$/mg, '');
  });
}

export function dateCodeStringToTokens(str: string) {
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
  const output: IDayShowings = {};
  Array.from(props).forEach((letter: 'm'|'a'|'e') => output[letter] = [showId]);
  return output;
}

export function urlCodeParts(urlCode: string) {
  const [startingDateString, ...showsDates] = urlCode.split(/\[\d*\]/g);
  return {startingDateString, showsDates};
}

export function urlToShorthandPerShow(urlCode: string) {
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
      const addedDays = getDaysFromDateId(dateId) - 1;
      const daysFromStart = startingDate.startOf('month').plus({months: addedMonths, days: addedDays}).diff(startingDate, 'days').toObject().days || 0;
      dates[daysFromStart] = getShorthandObj(slotsId, showId)
    })
    const a = [];
    for (let index = 0; index < dates.length; index++) {
      a[index] = Object.assign({}, dates[index] || {});
    }
    return a;
  });
}

export function urlToShorthand(urlCode: string): IShorthandObject {
  const {startingDateString: startingDate} =  urlCodeParts(urlCode);
  const showData = urlToShorthandPerShow(urlCode).reduce((a, perfsForCurrentShow) => {
    const longestLength = Math.max(a.length, perfsForCurrentShow.length);
    for (let index = 0; index < longestLength; index++) {
      a[index] = a[index] || {};
      Object.keys((perfsForCurrentShow[index] || {})).forEach((showingKey: 'm'|'a'|'e') => {
        const arrayOfNumbers = a[index][showingKey] || [];
        a[index][showingKey] = arrayOfNumbers.concat(perfsForCurrentShow[index][showingKey] || []);
      })
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


function isShowingCode(str: string): boolean {
  return MATCH_SHOWING_CODE.test(str)
}

function getUrlTokenFromReadableToken(token: string) {
  const [day, showing] = (token.match(SPLIT_SHOWING_CODE) || []) as [string, TShowingCode];
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
        const month = MONTHS.indexOf(token.toLowerCase()) + 1
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

export function readablesToUrl(readables: string[]) {
  let earliestStartingDate = findEarliestStartDate(readables)
  const showsDates = readables.map((text, i) => {
    let runningDate = earliestStartingDate;
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
        if (newYear > runningDate) runningDate = newYear;
      } else {
        const month = MONTHS.indexOf(token.toLowerCase()) + 1
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

export function urlDataToShowingsLists(commaSeparatedTitles: string, urlDatesCode: string): {title: string, dates: string}[] {
  const titles = commaSeparatedTitles.split(',');
  const datesList = fullCodeStringToPublishable(urlDatesCode);
  return titles.map((title, i) => ({title, dates: datesList[i]}));
}

export function urlDataToShowingsAgenda(commaSeparatedTitles: string, urlDatesCode: string): Agenda {
  const showingsList = urlDataToShowingsLists(commaSeparatedTitles, urlDatesCode);
  return showingsList
    .map(sl => monthAndDayListFromDatesString(sl.dates, sl.title))
    .reduce((a,b) => a.concat(b))
    .reduce(reduceAgendaDates, [])
    .sort(sortAgendaDays)
    .map(sortAgendaDayPerformances)
    .map(({dateString, performances}) => ({dateString, performances}))
}

type Agenda = AgendaDay[];
interface AgendaDay<T = string> {
  dateString: string;
  inaccurateDate?: DateTime; // The year will be wrong. Just good for sorting adjacent days within the same year. Will fail from December into January. See Implemenation below.
  performances: Array<{
    timeString: string;
    title: T;
  }>
}

type DataAgenda = AgendaDayData[];
interface AgendaDayData {
  timestamp: number;
  dateString: string;
  performances: Array<{
    timeString: string;
    shortTitle: string;
    fullTitle: string;
  }>
}

function monthAndDayListFromDatesString(datesPreprendedWithMonth: string, title: string): Agenda {
  return datesPreprendedWithMonth.split('\n')
    .map(monthAndDays => {
      const month = monthAndDays.match(/^\w+ /)![0].trim();
      const daysAndTimes = monthAndDays.match(/\d{1,2}\S?/g);
      return daysAndTimes!.map((dt): AgendaDay => {
        const [_full, day, timeSymbol] = dt.match(/(\d{1,2})(.?)/)!;
        const timeString = timeSymbol === '*' ? '2pm'
                         : timeSymbol === '‡' ? '10am'
                         : '8pm'; 
        return {
          dateString: `${month} ${day}`,
          inaccurateDate: DateTime.fromFormat(`${month} ${day}, 2000`, 'LLLL d, yyyy'),
          performances: [
            {timeString, title}
          ]
        };
      })
    })
    .reduce((a,b) => a.concat(b))
    .reduce(reduceAgendaDates, [] as Agenda)
}

function reduceAgendaDates(acc: Agenda, current: AgendaDay): Agenda {
  for (let i = 0; i < acc.length; i++) {
    const day = acc[i];
    if (day.dateString === current.dateString) {
      day.performances = day.performances.concat(current.performances)
      return acc;
    };
  }
  acc.push(current);
  return acc;
}

function mergeStrictAgendaDates(agenda: DataAgenda): DataAgenda {
  const keptAgenda: DataAgenda = []
  const daysHash: {[x: number]: AgendaDayData} = {};
  for (let i = 0; i < agenda.length; i++) {
    const day = agenda[i];
    const dupeDay = daysHash[day.timestamp];
    if (dupeDay) {
      dupeDay.performances.push(...day.performances);
    } else {
      keptAgenda.push(day);
      daysHash[day.timestamp] = day;
    }
  }
  return keptAgenda;
}

function sortAgendaDays(a: AgendaDay, b: AgendaDay): 0 | -1 | 1 {
  const diff = a.inaccurateDate!.diff(b.inaccurateDate!).as('seconds');
  return diff < 0 ? -1
       : diff === 0 ? 0
       : 1;         
}

function sortAgendaDayPerformances(agendaDay: AgendaDay): AgendaDay {
  agendaDay.performances.sort((a, b) => {
    let time1 = parseInt(a.timeString, 10);
    time1 = time1 === 10 ? 1 : time1;
    let time2 = parseInt(b.timeString, 10);
    time2 = time2 === 10 ? 1 : time2;
    return time1 - time2;
  })
  return agendaDay;
}