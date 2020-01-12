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

const DEFAULT_TITLES = 'Cats,Yankees,Ladies,Annie,Catch,Lead: CBL,Lead: DY';
const DEFAULT_LONG_TITLES =
  'Cats,Damn Yankees,Church Basement Ladies,Annie,Catch Me If You Can,Lead: Church Basement Ladies,Lead: Damn Yankees';
const DEFAULT_DATES =
  '2020-05-29' +
  '[1]C3D3E20b3i3r3u2w30d2j3l2n3r3y1C2E20b2f2g3k3m2p2' +
  '[2]0e3f3g2p3s3D30h3j2r2s2x3E30e3g2i2m3' +
  '[3]0l3m3n2q3t30a3i3k2q2x2D30a2h3n2o3' +
  '[4]0z3A3B20g3i2k1r1u3y2z2B3C30a1d3h1l2o2' +
  '[5]00c3d3e2k3q3y30a3f3h2l3n3' +
  '[6]00o3p3' +
  '[7]00w3v3';

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
