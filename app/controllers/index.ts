import Controller from '@ember/controller';
import { get } from '@ember/object';
import { service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';
import { DateTime } from 'luxon';
import {
  urlToShorthand,
  fullCodeStringToReadable,
  IShorthandObject,
  shorthandToUrl,
  readablesToUrl,
  ShowingsData,
} from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

type InputEvent = Event & { target: HTMLInputElement };

const DEFAULT_TITLES = 'Yankees,Annie,Ladies,Oklahoma,Desperate';
const DEFAULT_LONG_TITLES = 'Damn Yankees,Annie,Church Basement Ladies,Oklahoma!,Desperate Measures';
const DEFAULT_DATES =
  '2021-05-28' +
  '[1]B3C3D20a3h3p3t2D30h3k2q3w2E20f2h2k3n3' +
  '[2]0d3e3f2o3r3w3C30g3j1o3q1r2u2x1B2E10e3g1m2o2' +
  '[3]0k3l3m2q3s3v30f3j2n2q2y2C3E30d2f3j3l3' +
  '[4]0y3z3A20c2g2i2m3p3t3v3x3B3D30a2d3g3k2m3' +
  '[5]00b3c3d2i3j3n3p2u3w3x2A3D20c3g2n2';

export default class IndexController extends Controller.extend({
  queryParams: {
    shortTitles: { replace: true },
    longTitles: { replace: true },
    dates: { replace: true },
    editing: { replace: true },
  },
}) {
  shortTitles = DEFAULT_TITLES;
  longTitles = DEFAULT_LONG_TITLES;
  dates = DEFAULT_DATES;
  editing = false;

  @service('fastboot') fastboot!: any;

  @computed('dates', 'longTitles', 'shortTitles')
  get showingsData(): ShowingsData {
    const { dates, longTitles, shortTitles } = this.getProperties(['dates', 'longTitles', 'shortTitles']);
    return new ShowingsData(shortTitles, longTitles, dates);
  }

  @computed('dates', 'longTitles', 'shortTitles')
  get url(): string {
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

  _changeTitle(index: number, newTitle: string, shortOrLong: 'short' | 'long') {
    const shortOrLongKey = `${shortOrLong}Titles` as 'shortTitles' | 'longTitles';
    const oldTitles: string[] = get(this, shortOrLongKey).split(',');
    const newTitles = oldTitles.concat([]);
    newTitles[index] = newTitle;
    this.set(shortOrLongKey, newTitles.join(','));
  }

  _shiftDates(incrementType: string, numIncrements: number) {
    const data: IShorthandObject = Object.assign({}, urlToShorthand(this.dates) as any);
    const { startingDate } = data;
    const incrementor: { [s: string]: any } = {};
    incrementor[incrementType] = numIncrements;
    const newStartingDate = DateTime.fromISO(startingDate)
      .plus(incrementor)
      .toFormat('yyyy-MM-dd');
    data.startingDate = newStartingDate;
    this.set('dates', shorthandToUrl(data));
  }

  @action
  changeLongTitle(index: number, ev: InputEvent) {
    ev.preventDefault();
    this._changeTitle(index, ev.target.value, 'long');
  }

  @action
  changeShortTitle(index: number, ev: InputEvent) {
    ev.preventDefault();
    this._changeTitle(index, ev.target.value, 'short');
  }

  @action
  changeReadableDates(index: number, ev: InputEvent) {
    const newVal = ev.target.value;
    const newObj: string[] = ((fullCodeStringToReadable(this.dates) as any) as string[]).concat([]);
    newObj[index] = newVal;
    this.set('dates', readablesToUrl(newObj));
  }

  @action
  shiftDays(numDays: number, ev: InputEvent) {
    ev.preventDefault();
    this._shiftDates('days', numDays);
  }

  @action
  addShow(ev: InputEvent) {
    ev.preventDefault();
    this.set('shortTitles', this.shortTitles + ',');
    this.set('longTitles', this.longTitles + ',');
    this.set('dates', this.dates + `[${this.showingsData.titles.full.length}]`);
  }

  @action
  removeShow(index: number, ev: InputEvent) {
    ev.preventDefault();
    const shortTitles = this.shortTitles.split(',');
    const longTitles = this.longTitles.split(',');
    shortTitles.splice(index, 1);
    longTitles.splice(index, 1);
    this.set('shortTitles', shortTitles.join(','));
    this.set('longTitles', longTitles.join(','));
    let count = -1;
    this.set(
      'dates',
      this.dates.replace(/\[\d*\][^&\[]*/g, matched => {
        return ++count === index ? '' : matched;
      }),
    );
  }
}
