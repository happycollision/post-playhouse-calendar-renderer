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

const DEFAULT_TITLES = 'Mary,Frog & T,Little Shop,Music M,Sister Act,TBA,Crawford';
const DEFAULT_LONG_TITLES =
  "Disney's Mary Poppins,A Year With Frog & Toad,Little Shop of Horrors,The Music Man,Sister Act,TBA,Songs Around a Piano - A Cabaret at the Old Crawford Firehall";
const DEFAULT_DATES =
  '2019-05-31' +
  '[1]E30a3b2d3k3s3w20c3k3m3q3s2u2x2A2D30c2g2j1k2n3p2' +
  '[2]0B3C3D20i3m1p3t1y3z2E20c1i3m3' +
  '[3]00e3f3g2k2m2q2t3w3z30c3i2n2q2' +
  '[4]0n3o3p2t3v3y30b3j3l2n2r3t2x3A1E30b3d2g3j2o3q3' +
  '[5]0g3h3i2l3r3u3z30f2j2l3r2s3y2A3B20a3b2f3h3j3p3r2' +
  '[6]000a2h2o2' +
  '[7]00B3';

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
