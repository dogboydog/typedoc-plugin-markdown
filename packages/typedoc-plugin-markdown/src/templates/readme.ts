import { PageEvent, ProjectReflection } from 'typedoc';
import { useSettings } from '../context';
import { MarkdownBuilder } from '../tools/builder';

import { breadcrumbsTemplate } from './breadcrumbs';
import { commentTemplate } from './comment';

export function readmeTemplate(page: PageEvent<ProjectReflection>) {
  const { hideBreadcrumbs } = useSettings();

  const md = new MarkdownBuilder();

  if (!hideBreadcrumbs) {
    md.add(breadcrumbsTemplate(page));
  }

  if (page.model.readme) {
    md.add(commentTemplate(page.model.readme));
  }

  return md.print();
}
