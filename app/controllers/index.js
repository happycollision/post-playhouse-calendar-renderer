import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { DateTime } from 'luxon';

const DEFAULT_TITLES = 'Mermaid,Footloose,Chitty,Urinetown,42nd St';
const DEFAULT_LONG_TITLES = 'Disney\'s The Little Mermaid,Footloose,Chitty Chitty Bang Bang,Urinetown,42nd Street';
const DEFAULT_DATES = '2018-06-01' +
  '[1]a3b3c2e3l3t3v3x20d3n3r3u1v2y2B2E30d1h2k1l2p3r2' +
  '[2]h3i3j2m3s3w3A30g2l3q3t3z3C20b3d3j3o2' +
  '[3]o3p3q2u3z30c3k2m2o2u2x3B10a3d2g3i3k3q3s2' +
  '[4]C3D30a2k3m3s3A30c3h3k2n3r3' +
  '[5]0f3g3h2j3n2r2u3y3B30a2e2o3';

class ShowData {
  constructor(id, time, idLookup = {}) {
    this.id = id;
    this.time = time;
    this.title = idLookup[id] || 'NO TITLE';
  }
}

function getPaddingFor(startingDate) {
  const dateTime = DateTime.fromISO(startingDate);
  return dateTime.weekday === 7 ? undefined : dateTime.weekday;
}

function getDaysFromDateId(dateId) {
  return 'abcdefghijklmnopqrstuvwxyzABCDE'.indexOf(dateId)
}

function getDateIdFromDay(day) {
  return 'abcdefghijklmnopqrstuvwxyzABCDE'[day]
}

function getShorthandObj(slotsId, showId) {
  let props = '';
  switch (slotsId) {
    case '1': props = 'm'; break;
    case '2': props = 'a'; break;
    case '3': props = 'e'; break;
    case '4': props = 'ma'; break;
    case '5': props = 'me'; break;
    case '6': props = 'ae'; break;
    case '7': props = 'mae'; break;
    default: throw new Error('unknown slotId of ' + slotsId);
  }
  const output = {};
  Array.from(props).forEach(letter => output[letter] = showId);
  return output;
}

function urlCodeParts(urlCode) {
  const [startingDateString, ...showsDates] = urlCode.split(/\[\d*\]/g);
  return {startingDateString, showsDates};
}

function urlToShorthandPerShow(urlCode) {
  const {startingDateString, showsDates} =  urlCodeParts(urlCode);
  return showsDates.map((c, showIndex) => {
    const showId = showIndex + 1;
    const dates = [];
    let startingDate = DateTime.fromISO(startingDateString);
    let addedMonths = 0;
    (c.match(/(0|.{2})/g) || []).forEach((input) => {
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

function urlToShorthand(urlCode) {
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

function notEnoughMonths(value, monthsFromStart) {
  if (value === undefined) throw new Error('no value given for comparing to months');
  return (value.match(/0/g) || []).length < monthsFromStart;
}

function getShowingIdFromGroup(group) {
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

function shorthandToUrl(shorthandObj) {
  const {startingDate, showData} = shorthandObj;
  const startingDay = DateTime.fromISO(startingDate).startOf('day');
  const dataString = showData.reduce((acc,cur,i) => {
    const today = startingDay.plus({days: i})
    const monthsFromStart = Math.floor(startingDay.plus({days: i}).diff(startingDay, 'months').toObject().months) || 0;
    const dateId = getDateIdFromDay(today.day - 1);
    const {m,a,e} = cur;
    const showsToday = [];
    if (m) showsToday[m] = 'm';
    if (a) showsToday[a] = (showsToday[a] || '') + 'a';
    if (e) showsToday[e] = (showsToday[e] || '') + 'e';

    showsToday.forEach((showingGroup, i) => {
      if (!acc[i]) acc[i] = '';
      while(notEnoughMonths(acc[i], monthsFromStart)) { acc[i] += '0'; }
      acc[i] += dateId + getShowingIdFromGroup(showingGroup);
    })

    return acc
  }, []).reduce((a, c, i) => {
    return a + `[${i}]` + c
  }, '')
  return `${startingDate}${dataString}`;
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
    return urlToShorthand(this.get('dates'));
  }),

  readableDates: computed('dates', function() {
    return [];
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

  weeksData: computed('xweeksData', 'titles', function() {
    const xweeksData = this.get('xweeksData');
    const titles = this.get('titles');
    const idLookup = titles.short.reduce((a,c, i) => {
      a[i+1] = c;
      return a;
    }, {})

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
      return {startingDate, showsByDay, frontPadding, backPadding};
    })
  }),

  titles: computed('shortTitles', 'longTitles', function() {
    const {shortTitles, longTitles} = this.getProperties('shortTitles', 'longTitles');
    return {
      short: shortTitles.split(','),
      long: longTitles.split(','),
    };
  }),

  _changeTitle(originalTitle, ev, shortOrLong) {
    ev.preventDefault();
    const newVal = ev.target.value;
    const oldTitles = this.get(`titles.${shortOrLong}`);
    const newTitles = oldTitles.map(t => {
      if (t !== originalTitle) return t;
      return newVal;
    });
    this.set(`${shortOrLong}Titles`, newTitles.join(','))
  },

  actions: {
    changeLongTitle(originalTitle, ev) {
      this._changeTitle(originalTitle, ev, 'long');
    },

    changeShortTitle(originalTitle, ev) {
      this._changeTitle(originalTitle, ev, 'short');
    }
  }

});
