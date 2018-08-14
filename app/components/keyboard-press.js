import Component from '@ember/component';
import { EKMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, {
  key: '',
  onDown() {},

  didInsertElement() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
    const {key, onDown} = this;
    this.on(keyDown(key), onDown);
  },
});
