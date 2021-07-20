import { PageEvent } from 'typedoc/dist/lib/output/events';

import settings from '../settings';
import { MarkdownBuilder } from '../tools/builder';
import { breadcrumbsTemplate } from './breadcrumbs';
import { comment } from './comments';

export function readmeTemplate(page: PageEvent) {
  const md = new MarkdownBuilder();

  const { hideBreadcrumbs } = settings.options;

  if (!hideBreadcrumbs) {
    md.add(breadcrumbsTemplate(page));
  }

  if (page.project.readme) {
    md.add(comment(page.project.readme));
  }

  return md.print();
}
