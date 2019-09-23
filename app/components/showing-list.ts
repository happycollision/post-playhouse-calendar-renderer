import Component from '@ember/component';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember-decorators/object';
import {
  fullCodeStringToPublishable,
  urlDataToShowingsAgenda,
  ShowingsData,
} from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

export default class ShowingList extends Component.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  showingsData!: ShowingsData;

  init() {
    super.init();
    assert('showingsData must be provided to the component', !isEmpty(this.showingsData));
  }

  @computed('showingsData')
  get showAndDates() {
    const { titles, datesUrl } = this.showingsData;
    const pubDates = fullCodeStringToPublishable(datesUrl).map(str =>
      str
        .split('\n')
        .map(str => prepend('  ', str))
        .join('\n'),
    );
    return titles.full.map((title, i) => ({ title, showDateList: pubDates[i] }));
  }

  @computed('showingsData')
  get datedShowings() {
    const { titles, datesUrl } = this.showingsData;
    const agenda = urlDataToShowingsAgenda(titles.full.join(','), datesUrl);
    agenda.forEach(day => day.performances.forEach(perf => (perf.timeString = rightPad(perf.timeString, 4))));
    return agenda;
  }
}

function rightPad(str: string, padding: number): string {
  return padString(str, padding, append);
}

function leftPad(str: string, padding: number): string {
  return padString(str, padding, prepend);
}

function padString(str: string, padding: number, method: (newPart: string, oldPart: string) => string): string {
  const diff = padding - str.length;
  if (diff > 0) times(diff, () => (str = method(' ', str)));
  return str;
}

function append(toAppend: string | number, originalString: string) {
  return originalString + toAppend;
}

function prepend(toPrepend: string | number, originalString: string) {
  return toPrepend + originalString;
}

function times(num: number, fn: (...args: any[]) => any) {
  return Array.from(new Array(num)).map(fn);
}
