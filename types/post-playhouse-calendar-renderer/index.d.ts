
import Ember from 'ember';

declare global {
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}
}

declare module '@ember/service' {
  interface Registry {
    'fastboot': any;
  }
}

export {};
