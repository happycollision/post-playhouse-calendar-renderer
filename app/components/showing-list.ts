import Component from '@ember/component';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember-decorators/object';
import { fullCodeStringToPublishable, urlDataToShowingsAgenda } from 'post-playhouse-calendar-renderer/utils/showings-data-converters';

export default class ShowingList extends Component.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  datesCode!: string;
  titles!: string[];

  init() {
    super.init();
    assert('Dates must be provided to the component', !isEmpty(this.datesCode));
    assert('Titles must be provided to the component', !isEmpty(this.titles));
  }

  @computed('titles', 'datesCode')
  get showAndDates() {
    const {titles, datesCode}: {titles: string[], datesCode: string} = this.getProperties('titles', 'datesCode');
    const pubDates = fullCodeStringToPublishable(datesCode)
      .map(str => str.split('\n').map(str => prepend('  ', str)).join('\n'));
    return titles.map((title, i) => ({title, showDateList: pubDates[i]}));
  }

  @computed('titles', 'datesCode')
  get datedShowings() {
    const {titles, datesCode}: {titles: string[], datesCode: string} = this.getProperties('titles', 'datesCode');
    const agenda = urlDataToShowingsAgenda(titles.join(','), datesCode)
    agenda.forEach(day => day.performances.forEach(perf => perf.timeString = rightPad(perf.timeString, 4)));
    return agenda;

  }
};

function rightPad(str: string, padding: number): string {
  return padString(str, padding, append);
}

function leftPad(str: string, padding: number): string {
  return padString(str, padding, prepend);
}

function padString(str: string, padding: number, method: (newPart: string, oldPart: string) => string): string {
  const diff = padding - str.length;
  if (diff > 0) times(diff, () => str = method(' ', str));
  return str;
}

function append(toAppend: string | number, originalString: string) {
  return originalString + toAppend;
}

function prepend(toPrepend: string | number, originalString: string) {
  return toPrepend + originalString;
}

function times(num: number, fn: (...args: any) => any) {
  return Array.from(new Array(num)).map(fn);
}