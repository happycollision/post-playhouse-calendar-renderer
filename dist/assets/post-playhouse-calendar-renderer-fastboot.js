define("post-playhouse-calendar-renderer/components/edit-form", ["exports", "@ember-decorators/object", "post-playhouse-calendar-renderer/utils/showings-data-converters"], function (exports, _object, _showingsDataConverters) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    let EditForm = class EditForm extends Ember.Component.extend({
        // anything which *must* be merged to prototype here
    }) {
        // normal class body definition here
        get readableDates() {
            return (0, _showingsDataConverters.fullCodeStringToReadable)(this.showingsData.datesUrl);
        }
    };
    exports.default = EditForm;

    __decorate([(0, _object.computed)('showingsData')], EditForm.prototype, "readableDates", null);
});
define('post-playhouse-calendar-renderer/components/maybe-squish', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  let MaybeSquish = class MaybeSquish extends Ember.Component.extend({
    // anything which *must* be merged to prototype here
  }) {};
  exports.default = MaybeSquish;
});
define("post-playhouse-calendar-renderer/components/p-calendar", ["exports", "@ember-decorators/component", "@ember-decorators/object", "luxon"], function (exports, _component, _object, _luxon) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    function weekForDate(date) {
        let dateTime;
        if (typeof date === 'number') {
            dateTime = _luxon.DateTime.fromMillis(date);
        } else if (typeof date === 'string') {
            dateTime = _luxon.DateTime.fromISO(date);
        } else {
            dateTime = date;
        }
        return dateTime.minus({ days: dateTime.weekday % 7 });
    }
    function timeForHour(hour) {
        switch (hour) {
            case 10:
                return '10a';
            case 14:
                return '2p';
            case 20:
                return '8p';
            default:
                throw new Error('Not enough known times to translate hour: ' + hour);
        }
    }
    let PCalendar = class PCalendar extends Ember.Component {
        get longTitles() {
            return this.showingsData.titles.full;
        }
        get weeksData() {
            const agenda = this.showingsData.calendar.getDates();
            const firstDate = _luxon.DateTime.fromISO(agenda[0].date);
            const frontPadding = firstDate.weekday % 7;
            const lastDate = _luxon.DateTime.fromISO(agenda[agenda.length - 1].date);
            const backPadding = 6 - lastDate.weekday % 7;
            //getting closer...
            return agenda.reduce((allWeeks, day) => {
                const weekForThisDay = weekForDate(day.date);
                const currentWeek = allWeeks[allWeeks.length - 1];
                const maybePreviousDay = currentWeek[currentWeek.length - 1];
                if (!maybePreviousDay) {
                    currentWeek.push(day);
                    return allWeeks;
                }
                const weekForPreviousDay = weekForDate(maybePreviousDay.date);
                if (weekForPreviousDay.hasSame(weekForThisDay, 'day')) {
                    currentWeek.push(day);
                } else {
                    allWeeks.push([day]);
                }
                return allWeeks;
            }, [[]]).map((week, i, allWeeks) => {
                return {
                    frontPadding: i === 0 ? frontPadding : undefined,
                    backPadding: i === allWeeks.length - 1 ? backPadding : undefined,
                    showsByDay: week.map(day => day.showings.map(showing => ({
                        id: showing.productionId,
                        time: timeForHour(showing.dateTime.hour),
                        title: showing.title.short
                    }))),
                    startingDate: i === 0 ? week[0].date : weekForDate(week[0].date).toISODate()
                };
            });
        }
    };
    __decorate([(0, _object.computed)('showingsData')], PCalendar.prototype, "longTitles", null);
    __decorate([(0, _object.computed)('showingsData')], PCalendar.prototype, "weeksData", null);
    PCalendar = __decorate([(0, _component.tagName)('')], PCalendar);
    exports.default = PCalendar;
});
define("post-playhouse-calendar-renderer/components/show-counts", ["exports", "@ember-decorators/object", "@ember-decorators/component"], function (exports, _object, _component) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    let ShowCounts = class ShowCounts extends Ember.Component {
        init() {
            super.init();
            (true && !(!Ember.isEmpty(this.showingsData)) && Ember.assert('showingsData was passed in', !Ember.isEmpty(this.showingsData)));
        }
        get titles() {
            return this.showingsData.titles.short;
        }
        get allShowings() {
            return this.showingsData.agendasPerShow.map(showAgenda => showAgenda.reduce((a, day) => a + day.performances.length, 0));
        }
        get afternoonShowings() {
            return this.showingsData.agendasPerShow.map(showAgenda => showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '2pm').length, 0));
        }
        get morningShowings() {
            return this.showingsData.agendasPerShow.map(showAgenda => showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '10am').length, 0));
        }
        get eveningShowings() {
            return this.showingsData.agendasPerShow.map(showAgenda => showAgenda.reduce((a, day) => a + day.performances.filter(p => p.timeString === '8pm').length, 0));
        }
    };
    __decorate([(0, _object.computed)('showingsData')], ShowCounts.prototype, "titles", null);
    __decorate([(0, _object.computed)('showingsData')], ShowCounts.prototype, "allShowings", null);
    __decorate([(0, _object.computed)('showingsData')], ShowCounts.prototype, "afternoonShowings", null);
    __decorate([(0, _object.computed)('showingsData')], ShowCounts.prototype, "morningShowings", null);
    __decorate([(0, _object.computed)('showingsData')], ShowCounts.prototype, "eveningShowings", null);
    ShowCounts = __decorate([(0, _component.tagName)('')], ShowCounts);
    exports.default = ShowCounts;
});
define("post-playhouse-calendar-renderer/components/showing-list", ["exports", "@ember-decorators/object", "post-playhouse-calendar-renderer/utils/showings-data-converters"], function (exports, _object, _showingsDataConverters) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    let ShowingList = class ShowingList extends Ember.Component.extend({
        // anything which *must* be merged to prototype here
    }) {
        init() {
            super.init();
            (true && !(!Ember.isEmpty(this.showingsData)) && Ember.assert('showingsData must be provided to the component', !Ember.isEmpty(this.showingsData)));
        }
        get showAndDates() {
            const { titles, datesUrl } = this.showingsData;
            const pubDates = (0, _showingsDataConverters.fullCodeStringToPublishable)(datesUrl).map(str => str.split('\n').map(str => prepend('  ', str)).join('\n'));
            return titles.full.map((title, i) => ({ title, showDateList: pubDates[i] }));
        }
        get datedShowings() {
            const { titles, datesUrl } = this.showingsData;
            const agenda = (0, _showingsDataConverters.urlDataToShowingsAgenda)(titles.full.join(','), datesUrl);
            agenda.forEach(day => day.performances.forEach(perf => perf.timeString = leftPad(perf.timeString, 4)));
            return agenda;
        }
        get showings() {
            return this.showingsData.calendar.getDates().map(date => date.showings).reduce((a, c) => a.concat(c), []) // flatten
            .reduce((a, c) => {
                const productionGroup = a[c.productionId - 1];
                if (!productionGroup) {
                    a[c.productionId - 1] = { title: c.title.full, showings: [c] };
                } else {
                    productionGroup.showings.push(c);
                }
                return a;
            }, []).map(production => ({
                title: production.title,
                months: production.showings.map(showing => showing.dateTime).reduce((a, c) => {
                    let thisMonth = a[a.length - 1];
                    const incomingMonthName = c.monthLong;
                    if (!thisMonth || thisMonth.month !== incomingMonthName) {
                        thisMonth = { month: incomingMonthName, weekendShowings: [], weekdayShowings: [] };
                        a.push(thisMonth);
                    }
                    if (c.weekday > 4) {
                        thisMonth.weekendShowings.push(c);
                    } else {
                        thisMonth.weekdayShowings.push(c);
                    }
                    return a;
                }, [])
            }));
        }
    };
    exports.default = ShowingList;

    __decorate([(0, _object.computed)('showingsData')], ShowingList.prototype, "showAndDates", null);
    __decorate([(0, _object.computed)('showingsData')], ShowingList.prototype, "datedShowings", null);
    __decorate([(0, _object.computed)('showingsData')], ShowingList.prototype, "showings", null);
    function leftPad(str, padding) {
        return padString(str, padding, append);
    }
    // function rightPad(str: string, padding: number): string {
    //   return padString(str, padding, prepend);
    // }
    function padString(str, padding, method) {
        const diff = padding - str.length;
        if (diff > 0) times(diff, () => str = method(' ', str));
        return str;
    }
    function append(toAppend, originalString) {
        return originalString + toAppend;
    }
    function prepend(toPrepend, originalString) {
        return toPrepend + originalString;
    }
    function times(num, fn) {
        return Array.from(new Array(num)).map(fn);
    }
});
define("post-playhouse-calendar-renderer/controllers/index", ["exports", "@ember-decorators/service", "@ember-decorators/object", "luxon", "post-playhouse-calendar-renderer/utils/showings-data-converters"], function (exports, _service, _object, _luxon, _showingsDataConverters) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    const DEFAULT_TITLES = 'Yankees,Gilligan,Sound,Ladies,Rotten';
    const DEFAULT_LONG_TITLES = 'Damn Yankees,Gilligan‘s Island,The Sound of Music,Church Basement Ladies,Something Rotten';
    const DEFAULT_DATES = '2022-05-27' + '[1]A3B3C2E30g3o3s2C30g3i3m3q2u3w2A2D30d3j3m3' + '[2]0c3d3e2h3n3q3v3B30f3i2m2o3p1v3A3D20b3f3g2l2' + '[3]0j3k3l2p3r3u30e3h3i1p2s3w1x2C2E20e2i3m2' + '[4]0x3y3z20b2f2j2n3t2w3C3D10c3e3f1j2l3' + '[5]00a3b3c2h2l3o2p3t3v2z3B30c2f2k3n2';
    let IndexController = class IndexController extends Ember.Controller.extend({
        queryParams: {
            shortTitles: { replace: true },
            longTitles: { replace: true },
            dates: { replace: true },
            editing: { replace: true }
        }
    }) {
        constructor() {
            super(...arguments);
            this.shortTitles = DEFAULT_TITLES;
            this.longTitles = DEFAULT_LONG_TITLES;
            this.dates = DEFAULT_DATES;
            this.editing = false;
        }
        get showingsData() {
            const { dates, longTitles, shortTitles } = this.getProperties(['dates', 'longTitles', 'shortTitles']);
            return new _showingsDataConverters.ShowingsData(shortTitles, longTitles, dates);
        }
        get url() {
            if (this.get('fastboot').isFastBoot) {
                return '';
            }
            let hash = document.location.search + document.location.hash;
            const beforeHash = document.location.origin + document.location.pathname;
            // hash = hash.split('&').map(part => decodeURIComponent(part).replace(/ /g, '+').replace(/&/g, encodeURIComponent('&'))).join('&')
            hash = hash.replace(/%5B|%5D|%20|%2C|%27/g, match => {
                switch (match) {
                    case '%5B':
                        return '[';
                    case '%5D':
                        return ']';
                    case '%20':
                        return '+';
                    case '%2C':
                        return ',';
                    case '%27':
                        return "'";
                    default:
                        return match;
                }
            });
            return beforeHash + hash;
        }
        _changeTitle(index, newTitle, shortOrLong) {
            const shortOrLongKey = `${shortOrLong}Titles`;
            const oldTitles = Ember.get(this, shortOrLongKey).split(',');
            const newTitles = oldTitles.concat([]);
            newTitles[index] = newTitle;
            this.set(shortOrLongKey, newTitles.join(','));
        }
        _shiftDates(incrementType, numIncrements) {
            const data = Object.assign({}, (0, _showingsDataConverters.urlToShorthand)(this.dates));
            const { startingDate } = data;
            const incrementor = {};
            incrementor[incrementType] = numIncrements;
            const newStartingDate = _luxon.DateTime.fromISO(startingDate).plus(incrementor).toFormat('yyyy-MM-dd');
            data.startingDate = newStartingDate;
            this.set('dates', (0, _showingsDataConverters.shorthandToUrl)(data));
        }
        changeLongTitle(index, ev) {
            ev.preventDefault();
            this._changeTitle(index, ev.target.value, 'long');
        }
        changeShortTitle(index, ev) {
            ev.preventDefault();
            this._changeTitle(index, ev.target.value, 'short');
        }
        changeReadableDates(index, ev) {
            const newVal = ev.target.value;
            const newObj = (0, _showingsDataConverters.fullCodeStringToReadable)(this.dates).concat([]);
            newObj[index] = newVal;
            this.set('dates', (0, _showingsDataConverters.readablesToUrl)(newObj));
        }
        shiftDays(numDays, ev) {
            ev.preventDefault();
            this._shiftDates('days', numDays);
        }
        addShow(ev) {
            ev.preventDefault();
            this.set('shortTitles', this.shortTitles + ',');
            this.set('longTitles', this.longTitles + ',');
            this.set('dates', this.dates + `[${this.showingsData.titles.full.length}]`);
        }
        removeShow(index, ev) {
            ev.preventDefault();
            const shortTitles = this.shortTitles.split(',');
            const longTitles = this.longTitles.split(',');
            shortTitles.splice(index, 1);
            longTitles.splice(index, 1);
            this.set('shortTitles', shortTitles.join(','));
            this.set('longTitles', longTitles.join(','));
            let count = -1;
            this.set('dates', this.dates.replace(/\[\d*\][^&\[]*/g, matched => {
                return ++count === index ? '' : matched;
            }));
        }
    };
    exports.default = IndexController;

    __decorate([(0, _service.service)('fastboot')], IndexController.prototype, "fastboot", void 0);
    __decorate([(0, _object.computed)('dates', 'longTitles', 'shortTitles')], IndexController.prototype, "showingsData", null);
    __decorate([(0, _object.computed)('dates', 'longTitles', 'shortTitles')], IndexController.prototype, "url", null);
    __decorate([_object.action], IndexController.prototype, "changeLongTitle", null);
    __decorate([_object.action], IndexController.prototype, "changeShortTitle", null);
    __decorate([_object.action], IndexController.prototype, "changeReadableDates", null);
    __decorate([_object.action], IndexController.prototype, "shiftDays", null);
    __decorate([_object.action], IndexController.prototype, "addShow", null);
    __decorate([_object.action], IndexController.prototype, "removeShow", null);
});
define('post-playhouse-calendar-renderer/helpers/fallback', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.fallback = fallback;
    function fallback(params) {
        for (const param of params) {
            if (param != null) return param;
        }
        return null;
    }
    exports.default = Ember.Helper.helper(fallback);
});
define('post-playhouse-calendar-renderer/initializers/ajax', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const { get } = Ember; /* globals najax */


  var nodeAjax = function (options) {
    let httpRegex = /^https?:\/\//;
    let protocolRelativeRegex = /^\/\//;
    let protocol = get(this, 'fastboot.request.protocol');

    if (protocolRelativeRegex.test(options.url)) {
      options.url = protocol + options.url;
    } else if (!httpRegex.test(options.url)) {
      try {
        options.url = protocol + '//' + get(this, 'fastboot.request.host') + options.url;
      } catch (fbError) {
        throw new Error('You are using Ember Data with no host defined in your adapter. This will attempt to use the host of the FastBoot request, which is not configured for the current host of this request. Please set the hostWhitelist property for in your environment.js. FastBoot Error: ' + fbError.message);
      }
    }

    if (najax) {
      najax(options);
    } else {
      throw new Error('najax does not seem to be defined in your app. Did you override it via `addOrOverrideSandboxGlobals` in the fastboot server?');
    }
  };

  exports.default = {
    name: 'ajax-service',

    initialize: function (application) {
      application.register('ajax:node', nodeAjax, { instantiate: false });
      application.inject('adapter', '_ajaxRequest', 'ajax:node');
      application.inject('adapter', 'fastboot', 'service:fastboot');
    }
  };
});
define('post-playhouse-calendar-renderer/initializers/error-handler', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'error-handler',

    initialize: function (application) {
      if (!Ember.onerror) {
        // if no onerror handler is defined, define one for fastboot environments
        Ember.onerror = function (err) {
          let errorMessage = `There was an error running your app in fastboot. More info about the error: \n ${err.stack || err}`;
          Ember.Logger.error(errorMessage);
        };
      }
    }
  };
});
define("post-playhouse-calendar-renderer/utils/showings-data-converters", ["exports", "luxon", "@ember-decorators/object"], function (exports, _luxon, _object) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ShowingsData = exports.Showing = exports.ShowData = undefined;
    exports.shorthandToUrl = shorthandToUrl;
    exports._idTokenToShowingToken = _idTokenToShowingToken;
    exports.fullCodeStringToReadable = fullCodeStringToReadable;
    exports.fullCodeStringToPublishable = fullCodeStringToPublishable;
    exports._dateCodeStringToTokens = _dateCodeStringToTokens;
    exports._urlCodeParts = _urlCodeParts;
    exports._urlToShorthandPerShow = _urlToShorthandPerShow;
    exports.urlToShorthand = urlToShorthand;
    exports.readablesToUrl = readablesToUrl;
    exports._urlDataToShowingsLists = _urlDataToShowingsLists;
    exports.urlDataToShowingsAgenda = urlDataToShowingsAgenda;
    var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    let ShowData = exports.ShowData = class ShowData {
        constructor(id, time, idLookup = {}) {
            this.id = id;
            this.time = time;
            this.title = idLookup[id] || 'NO TITLE';
        }
    };

    const monthDayCodeArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E'];
    const monthDayLookup = {};
    monthDayCodeArray.forEach((s, i) => {
        monthDayLookup[s] = i + 1;
        monthDayLookup[i + 1] = s;
    });
    const reverseLookupMonthDay = key => monthDayLookup[key];
    // type DatedConstructor = {title: string, date: DateTime, showingCode: 'm'|'a'|'e'}
    let Showing = exports.Showing = class Showing {
        get weekday() {
            return !this.weekend;
        }
        constructor(x) {
            this.dateTime = x.exactTime;
            this.monthDayCode = reverseLookupMonthDay(this.dateTime.day);
            this.title = x.idLookup(x.productionId);
            this.weekend = this.dateTime.weekday > 4;
            this.productionId = +x.productionId;
        }
    };

    const makeShowingsWithLookup = idLookup => x => new Showing(Object.assign({}, x, { idLookup }));
    /**
     * These are helpers for the calendar class
     */
    const c = {
        getReadableDate(dateTime) {
            return dateTime.toISODate();
        },
        sortShowings(date) {
            date.sort((a, b) => a.dateTime.toMillis() > b.dateTime.toMillis() ? 1 : a.dateTime.toMillis() === b.dateTime.toMillis() ? 0 : -1);
        },
        guaranteedDateTime(date) {
            return typeof date === 'string' ? _luxon.DateTime.fromISO(date) : date;
        }
    };
    let Calendar = class Calendar {
        constructor() {
            /**
             * ISO date string keys
             */
            this.dates = {};
            /**
             * returns array of ISO date strings
             */
        }
        addEvent(showing) {
            const date = this.getWritableDate(showing.dateTime);
            date.push(showing);
            c.sortShowings(date);
        }
        getShowingsForDate(date) {
            return [...this.getWritableDate(c.guaranteedDateTime(date))];
        }
        getWritableDate(dateTime) {
            const readableDate = c.getReadableDate(dateTime);
            if (this.dates[readableDate]) {
                return this.dates[readableDate];
            } else {
                return this.dates[readableDate] = [];
            }
        }
        getDates() {
            this.cleanDates();
            return Object.keys(this.dates).map(isoDate => ({ date: isoDate, showings: this.getShowingsForDate(isoDate) })).sortBy('date');
        }
        cleanDates() {
            this.trimDates();
            this.addMissingDates();
        }
        addMissingDates() {
            findMissingDates(Object.keys(this.dates)).forEach(d => this.dates[d] = []);
        }
        trimDates() {
            const dateKeys = Object.keys(this.dates).sort();
            if (dateKeys.length === 0) {
                return;
            }
            // trim front
            for (let i = 0; i < dateKeys.length; i++) {
                const date = dateKeys[i];
                if (this.getShowingsForDate(date).length === 0) {
                    delete this.dates[date];
                } else {
                    continue;
                }
            }
            // trim back
            for (let i = dateKeys.length - 1; i >= 0; i--) {
                const date = dateKeys[i];
                if (this.getShowingsForDate(date).length === 0) {
                    delete this.dates[date];
                } else {
                    continue;
                }
            }
        }
    };

    function findMissingDates(isoDates) {
        const dateKeys = isoDates.sort();
        if (!dateKeys.length) {
            return [];
        }
        const startDate = _luxon.DateTime.fromISO(dateKeys.slice(0, 1)[0]);
        const endDate = _luxon.DateTime.fromISO(dateKeys.slice(-1)[0]);
        if (startDate.toISODate() === endDate.toISODate()) {
            return [];
        }
        let daysRemaining = endDate.diff(startDate, 'days').days;
        let alldays = [];
        while (daysRemaining > 0) {
            alldays.unshift(startDate.plus({ days: daysRemaining }).toISODate());
            --daysRemaining;
        }
        return alldays.filter(d => !dateKeys.includes(d));
    }
    const MATCH_SHOWING_CODE = /\d{1,2}[mae]{1,3}/;
    const SPLIT_SHOWING_CODE = /(\d{1,2}|[mae]{1,3})/g;
    const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    function getDaysFromDateId(dateId) {
        return 'abcdefghijklmnopqrstuvwxyzABCDE'.indexOf(dateId) + 1;
    }
    function getDateIdFromDay(day) {
        day = typeof day === 'string' ? parseInt(day, 10) : day;
        return 'abcdefghijklmnopqrstuvwxyzABCDE'[day - 1];
    }
    function notEnoughMonths(value, monthsFromStart) {
        if (value === undefined) throw new Error('no value given for comparing to months');
        return (value.match(/0/g) || []).length < monthsFromStart;
    }
    function shorthandToUrl(shorthandObj) {
        const { startingDate, showData } = shorthandObj;
        const startingDay = _luxon.DateTime.fromISO(startingDate).startOf('day');
        const dataString = showData.reduce((acc, cur, i) => {
            const today = startingDay.plus({ days: i });
            const yearsFromStart = today.year - startingDay.year;
            const monthsFromStart = Math.abs(today.month - startingDay.month) + yearsFromStart * 12;
            const { m, a, e } = cur;
            const showsToday = []; // the string will be 'm', 'a', 'e', 'ma', 'me', 'ae' etc.
            if (m) {
                m.forEach(showId => showsToday[showId] = 'm');
            }
            if (a) {
                a.forEach(showId => showsToday[showId] = showsToday[showId] ? showsToday[showId] + 'a' : 'a');
            }
            if (e) {
                e.forEach(showId => showsToday[showId] = showsToday[showId] ? showsToday[showId] + 'e' : 'e');
            }
            showsToday.forEach((showingGroup, i) => {
                if (!acc[i]) acc[i] = '';
                while (notEnoughMonths(acc[i], monthsFromStart)) {
                    acc[i] += '0';
                }
                acc[i] += getDateIdFromDay(today.day) + getShowingIdFromGroup(showingGroup);
            });
            return acc;
        }, []).reduce((a, c, i) => {
            return a + `[${i}]` + c;
        }, '');
        return `${startingDate}${dataString}`;
    }
    function isMonthName(str) {
        return MONTHS.includes(str.toLowerCase());
    }
    function _idTokenToShowingToken(token) {
        const [dateId, slotId] = token;
        return `${getDaysFromDateId(dateId)}${getSlotShorthandFromSlotsId(slotId)}`;
    }
    function dayOfMonthAndShowingsFromToken(token) {
        const [dateId, slotsId] = token;
        const dayOfMonth = getDaysFromDateId(dateId);
        let props = getSlotShorthandFromSlotsId(slotsId);
        const showings = [];
        Array.from(props).forEach(letter => {
            switch (letter) {
                case 'm':
                    showings.push({ timeString: '10am', hourOfDay: 10 });
                    break;
                case 'a':
                    showings.push({ timeString: '2pm', hourOfDay: 14 });
                    break;
                case 'e':
                    showings.push({ timeString: '8pm', hourOfDay: 20 });
                    break;
            }
        });
        return { dayOfMonth, showings };
    }
    let ShowingsData = exports.ShowingsData = class ShowingsData extends Ember.Object {
        constructor(shortTitlesUrl, fullTitlesUrl, datesUrl) {
            super();
            this.shortTitlesUrl = shortTitlesUrl;
            this.fullTitlesUrl = fullTitlesUrl;
            this.datesUrl = datesUrl;
        }
        get titles() {
            return {
                short: this.shortTitlesUrl.split(','),
                full: this.fullTitlesUrl.split(',')
            };
        }
        set titles(input) {
            this.set('shortTitlesUrl', input.short.join(','));
            this.set('fullTitlesUrl', input.full.join(','));
        }
        get agendaForAllShows() {
            return mergeStrictAgendaDates(this.agendasPerShow.reduce((a, b) => a.concat(b)));
        }
        get agendaForAllShowsWithDarkDays() {
            return padMissingAgendaDates(mergeStrictAgendaDates(this.agendasPerShow.reduce((a, b) => a.concat(b))));
        }
        get agendasPerShow() {
            return this.dataConversion;
        }
        get calendar() {
            this.dataConversion;
            return this._calendar;
        }
        get dataConversion() {
            this._calendar = new Calendar(); // SIDE EFFECT
            const { startingDateString, showsDates } = _urlCodeParts(this.datesUrl);
            const startingDate = _luxon.DateTime.fromISO(startingDateString);
            const makeShowing = makeShowingsWithLookup(id => ({
                full: this.titles.full[+id - 1],
                short: this.titles.short[+id - 1]
            }));
            return showsDates.map((dateCodes, i) => {
                let runningMonth = startingDate.startOf('month');
                return _dateCodeStringToTokens(dateCodes).reduce((acc, token) => {
                    if (token === '0') {
                        runningMonth = runningMonth.plus({ months: 1 });
                        return acc;
                    }
                    const { dayOfMonth, showings } = dayOfMonthAndShowingsFromToken(token);
                    const theDate = runningMonth.plus({ days: dayOfMonth - 1 });
                    // SIDE EFFECT
                    showings.forEach(showing => {
                        this._calendar.addEvent(makeShowing({ productionId: i + 1, exactTime: theDate.plus({ hours: showing.hourOfDay }) }));
                    });
                    // END SIDE EFFECT
                    return acc.concat([{
                        timestamp: theDate.toMillis(),
                        dateString: theDate.toFormat('LLLL d'),
                        performances: showings.map(s => Object.assign({}, s, { shortTitle: this.titles.short[i], fullTitle: this.titles.full[i] }))
                    }]);
                }, []);
            });
        }
    };

    __decorate([(0, _object.computed)('shortTitlesUrl', 'fullTitlesUrl')], ShowingsData.prototype, "titles", null);
    __decorate([(0, _object.computed)('agendasPerShow')], ShowingsData.prototype, "agendaForAllShows", null);
    __decorate([(0, _object.computed)('agendaForAllShows')], ShowingsData.prototype, "agendaForAllShowsWithDarkDays", null);
    __decorate([(0, _object.computed)('dataConversion')], ShowingsData.prototype, "agendasPerShow", null);
    __decorate([(0, _object.computed)('dataConversion')], ShowingsData.prototype, "calendar", null);
    __decorate([(0, _object.computed)('shortTitlesUrl', 'fullTitlesUrl', 'datesUrl')], ShowingsData.prototype, "dataConversion", null);
    function fullCodeStringToReadable(str) {
        const { startingDateString, showsDates } = _urlCodeParts(str);
        const startingDate = _luxon.DateTime.fromISO(startingDateString);
        let year = startingDate.toFormat('yyyy');
        return showsDates.map(dateCodes => {
            let output = year;
            let runningMonth = startingDate.startOf('month');
            _dateCodeStringToTokens(dateCodes).map(token => {
                if (token === '0') {
                    runningMonth = runningMonth.plus({ months: 1 });
                    return runningMonth.toFormat('LLLL');
                }
                return _idTokenToShowingToken(token);
            }).reduce((acc, token, i, _init) => {
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
                return; // should be nothing left
            });
            return output;
        });
    }
    function fullCodeStringToPublishable(str) {
        return fullCodeStringToReadable(str).map(readableString => {
            return readableString.replace(/\d{4}\s+/g, '').replace(/(\d{1,2})([mae]{1,3})/g, (_fullMatch, p1, p2) => {
                const values = { m: 1, a: 2, e: 3 };
                const date = p1;
                const times = p2.split('');
                times.sort((a, b) => {
                    const val1 = values[a];
                    const val2 = values[b];
                    return val1 - val2;
                });
                return times.map(t => `${date}${t}`).join(', ');
            }).replace(/(\d{1,2})([mae])/g, (_full, p1, p2) => {
                const replacements = { m: '‡', a: '*', e: '' };
                return `${p1}${replacements[p2]}`;
            }).replace(/,$/gm, '');
        });
    }
    function _dateCodeStringToTokens(str) {
        return str.match(/(0|.{2})/g) || [];
    }
    function getSlotShorthandFromSlotsId(slotsId) {
        switch (slotsId) {
            case '1':
                return 'm';
            case '2':
                return 'a';
            case '3':
                return 'e';
            case '4':
                return 'ma';
            case '5':
                return 'me';
            case '6':
                return 'ae';
            case '7':
                return 'mae';
            default:
                throw new Error('unknown slotId of ' + slotsId);
        }
    }
    function getShorthandObj(slotsId, showId) {
        let props = getSlotShorthandFromSlotsId(slotsId);
        const output = {};
        Array.from(props).forEach(letter => output[letter] = [showId]);
        return output;
    }
    function _urlCodeParts(urlCode) {
        const [startingDateString, ...showsDates] = urlCode.split(/\[\d*\]/g);
        return { startingDateString, showsDates };
    }
    function _urlToShorthandPerShow(urlCode) {
        const { startingDateString, showsDates } = _urlCodeParts(urlCode);
        return showsDates.map((c, showIndex) => {
            const showId = showIndex + 1;
            const dates = [];
            let startingDate = _luxon.DateTime.fromISO(startingDateString);
            let addedMonths = 0;
            _dateCodeStringToTokens(c).forEach(input => {
                if (input === '0') {
                    addedMonths++;
                    return;
                }
                const [dateId, slotsId] = input.split('');
                const addedDays = getDaysFromDateId(dateId) - 1;
                const daysFromStart = startingDate.startOf('month').plus({ months: addedMonths, days: addedDays }).diff(startingDate, 'days').toObject().days || 0;
                dates[daysFromStart] = getShorthandObj(slotsId, showId);
            });
            const a = [];
            for (let index = 0; index < dates.length; index++) {
                a[index] = Object.assign({}, dates[index] || {});
            }
            return a;
        });
    }
    function urlToShorthand(urlCode) {
        const { startingDateString: startingDate } = _urlCodeParts(urlCode);
        const showData = _urlToShorthandPerShow(urlCode).reduce((a, perfsForCurrentShow) => {
            const longestLength = Math.max(a.length, perfsForCurrentShow.length);
            for (let index = 0; index < longestLength; index++) {
                a[index] = a[index] || {};
                Object.keys(perfsForCurrentShow[index] || {}).forEach(showingKey => {
                    const arrayOfNumbers = a[index][showingKey] || [];
                    a[index][showingKey] = arrayOfNumbers.concat(perfsForCurrentShow[index][showingKey] || []);
                });
            }
            return a;
        }, []);
        return { startingDate, showData };
    }
    function getShowingIdFromGroup(group) {
        switch (group) {
            case 'm':
                return 1;
            case 'a':
                return 2;
            case 'e':
                return 3;
            case 'ma':
                return 4;
            case 'me':
                return 5;
            case 'ae':
                return 6;
            case 'mae':
                return 7;
            default:
                throw new Error('unrecognized grouping: ' + group);
        }
    }
    function isShowingCode(str) {
        return MATCH_SHOWING_CODE.test(str);
    }
    function getUrlTokenFromReadableToken(token) {
        const [day, showing] = token.match(SPLIT_SHOWING_CODE) || [];
        return `${getDateIdFromDay(day)}${getShowingIdFromGroup(showing)}`;
    }
    function findEarliestStartDate(readables) {
        let earliestStartingDate = _luxon.DateTime.local().plus({ years: 5 });
        readables.forEach(text => {
            const tokens = (text.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g) || []).map(t => t.replace(/,/g, '').trim());
            let runningDate = _luxon.DateTime.local().startOf('year');
            let confirmedDate = false;
            tokens.forEach(token => {
                if (confirmedDate) return;
                if (/\d{1,2}[mae]{1,3}/.test(token)) {
                    confirmedDate = true;
                    runningDate = runningDate.set({ day: parseInt(token) });
                    if (runningDate < earliestStartingDate) earliestStartingDate = runningDate;
                } else if (/\d{4}/.test(token)) {
                    const newYear = _luxon.DateTime.fromISO(`${token}-01-01`);
                    runningDate = newYear;
                } else {
                    const month = MONTHS.indexOf(token.toLowerCase()) + 1;
                    let newMonth = runningDate.set({ month });
                    if (newMonth < runningDate) {
                        newMonth = newMonth.plus({ years: 1 });
                    }
                    runningDate = newMonth;
                }
            });
        });
        return earliestStartingDate;
    }
    function monthsDiffFromDays(first, second) {
        const yearsDiff = second.year - first.year;
        const monthsDiff = second.month - first.month;
        return yearsDiff * 12 + monthsDiff;
    }
    function readablesToUrl(readables) {
        let earliestStartingDate = findEarliestStartDate(readables);
        const showsDates = readables.map((text, i) => {
            let runningDate = earliestStartingDate;
            let lastConfirmedDate = earliestStartingDate;
            let output = `[${i + 1}]`;
            const tokens = (text.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g) || []).map(t => t.replace(/,/g, '').trim());
            tokens.forEach(token => {
                if (/\d{1,2}[mae]{1,3}/.test(token)) {
                    output += getUrlTokenFromReadableToken(token);
                    runningDate = runningDate.set({ day: parseInt(token) });
                    lastConfirmedDate = runningDate;
                } else if (/\d{4}/.test(token)) {
                    const newYear = _luxon.DateTime.fromISO(`${token}-01-01`);
                    if (newYear > runningDate) runningDate = newYear;
                } else {
                    const month = MONTHS.indexOf(token.toLowerCase()) + 1;
                    let newMonth = runningDate.set({ month });
                    if (newMonth < runningDate) {
                        newMonth = newMonth.plus({ years: 1 });
                    }
                    runningDate = newMonth;
                    if (lastConfirmedDate) {
                        const monthsDiff = monthsDiffFromDays(lastConfirmedDate, newMonth);
                        Array.from(new Array(monthsDiff)).forEach(() => output += '0');
                    }
                }
            });
            return output;
        });
        return earliestStartingDate.toFormat('yyyy-MM-dd') + showsDates.join('');
    }
    function _urlDataToShowingsLists(commaSeparatedTitles, urlDatesCode) {
        const titles = commaSeparatedTitles.split(',');
        const datesList = fullCodeStringToPublishable(urlDatesCode);
        return titles.map((title, i) => ({ title, dates: datesList[i] }));
    }
    function urlDataToShowingsAgenda(commaSeparatedTitles, urlDatesCode) {
        const showingsList = _urlDataToShowingsLists(commaSeparatedTitles, urlDatesCode);
        return showingsList.map(sl => monthAndDayListFromDatesString(sl.dates, sl.title)).reduce((a, b) => a.concat(b)).reduce(reduceAgendaDates, []).sort(sortAgendaDays).map(sortAgendaDayPerformances).map(({ dateString, performances }) => ({ dateString, performances }));
    }
    function monthAndDayListFromDatesString(datesPreprendedWithMonth, title) {
        return datesPreprendedWithMonth.split('\n').map(monthAndDays => {
            const month = monthAndDays.match(/^\w+ /)[0].trim();
            const daysAndTimes = monthAndDays.match(/\d{1,2}\S?/g);
            return daysAndTimes.map(dt => {
                const [_full, day, timeSymbol] = dt.match(/(\d{1,2})(.?)/);
                const timeString = timeSymbol === '*' ? '2pm' : timeSymbol === '‡' ? '10am' : '8pm';
                return {
                    dateString: `${month} ${day}`,
                    inaccurateDate: _luxon.DateTime.fromFormat(`${month} ${day}, 2000`, 'LLLL d, yyyy'),
                    performances: [{ timeString, title }]
                };
            });
        }).reduce((a, b) => a.concat(b)).reduce(reduceAgendaDates, []);
    }
    function reduceAgendaDates(acc, current) {
        for (let i = 0; i < acc.length; i++) {
            const day = acc[i];
            if (day.dateString === current.dateString) {
                day.performances = day.performances.concat(current.performances);
                return acc;
            }
        }
        acc.push(current);
        return acc;
    }
    function mergeStrictAgendaDates(agenda) {
        const keptAgenda = [];
        const daysHash = {};
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
        return keptAgenda.sortBy('timestamp');
    }
    function padMissingAgendaDates(agenda) {
        const missingDates = findMissingDates(agenda.map(a => _luxon.DateTime.fromMillis(a.timestamp).toISODate()));
        return agenda.concat(missingDates.map(isoDate => {
            const dt = _luxon.DateTime.fromISO(isoDate);
            return {
                timestamp: dt.toMillis(),
                dateString: dt.toFormat('LLLL d'),
                performances: []
            };
        })).sortBy('timestamp');
    }
    function sortAgendaDays(a, b) {
        const diff = a.inaccurateDate.diff(b.inaccurateDate).as('seconds');
        return diff < 0 ? -1 : diff === 0 ? 0 : 1;
    }
    function sortAgendaDayPerformances(agendaDay) {
        agendaDay.performances.sort((a, b) => {
            let time1 = parseInt(a.timeString, 10);
            time1 = time1 === 10 ? 1 : time1;
            let time2 = parseInt(b.timeString, 10);
            time2 = time2 === 10 ? 1 : time2;
            return time1 - time2;
        });
        return agendaDay;
    }
});//# sourceMappingURL=post-playhouse-calendar-renderer-fastboot.map
