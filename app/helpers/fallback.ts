import { helper } from '@ember/component/helper';

export function fallback(params: any) {
  for (const param of params) {
    if (param != null) return param;
  }
  return null;
}

export default helper(fallback);
