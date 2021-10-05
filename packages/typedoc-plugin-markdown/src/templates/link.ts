import * as path from 'path';
import { URL_PREFIX } from '../constants';
import { useSettings } from '../context';
import { link } from '../tools/elements';
import { escapeChars } from '../tools/utils';

export function linkTemplate(label: string, to = '', escapeLabel = true) {
  label = escapeLabel ? escapeChars(label) : label;
  return link(label, getUrl(to));
}

function getUrl(to: string) {
  const { activeUrl, publicPath } = useSettings();

  if (URL_PREFIX.test(to)) {
    return to;
  } else {
    return publicPath
      ? getPublicUrl(publicPath, to)
      : getRelativeUrl(activeUrl, to);
  }
}

function getPublicUrl(publicPath: string, url: string) {
  return publicPath + url;
}

function getRelativeUrl(from: string, to: string) {
  const relative = path.relative(path.dirname(from), path.dirname(to));
  return path.join(relative, path.basename(to)).replace(/\\/g, '/');
}
