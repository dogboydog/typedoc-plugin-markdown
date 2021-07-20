import * as path from 'path';

import settings from '../settings';
import { link } from '../tools/elements';
import { escapeChars } from '../tools/utils';

export function linkTemplate(label: string, to = '', escapeLabel = true) {
  label = escapeLabel ? escapeChars(label) : label;
  return link(label, getUrl(to));
}

function getUrl(to: string) {
  const { options, activeUrl } = settings;

  const urlPrefix = /^(http|ftp)s?:\/\//;
  if (urlPrefix.test(to)) {
    return to;
  } else {
    return options.publicPath
      ? getPublicUrl(options.publicPath, to)
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
