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

const DEFAULT_TITLES = 'Yankees,Gilligan,Sound,Ladies,Rotten';
const DEFAULT_LONG_TITLES = 'Damn Yankees,Gilligan‘s Island,The Sound of Music,Church Basement Ladies,Something Rotten';
const DEFAULT_DATES =
  '2022-05-27' +
  '[1]A3B3C2E30g3o3s2C30g3i3m3q2u3w2A2D30d3j3m3' +
  '[2]0c3d3e2h3n3q3v3B30f3i2m2o3p1v3A3D20b3f3g2l2' +
  '[3]0j3k3l2p3r3u30e3h3i1p2s3w1x2C2E20e2i3m2' +
  '[4]0x3y3z20b2f2j2n3t2w3C3D10c3e3f1j2l3' +
  '[5]00a3b3c2h2l3o2p3t3v2z3B30c2f2k3n2';

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
