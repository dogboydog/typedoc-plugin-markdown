import { PageEvent, ProjectReflection } from 'typedoc';

import { MarkdownBuilder } from '../tools/builder';

import { commentsTemplate } from './comments';

import { reflectionPathTemplate } from './reflection-path';
import { tocTemplate } from './toc';
import { groupsTemplate } from './groups';
import { useSettings } from '../context';
import { breadcrumbsTemplate } from './breadcrumbs';

export function projectTemplate(page: PageEvent<ProjectReflection>) {
  const { hideBreadcrumbs } = useSettings();

  const md = new MarkdownBuilder();

  if (!hideBreadcrumbs) {
    md.add(breadcrumbsTemplate(page));
  }

  md.add(reflectionPathTemplate(page.model));

  if (page.model.comment) {
    md.add(commentsTemplate(page.model.comment));
  }

  md.add(tocTemplate(page.model));

  if (page.model.groups) {
    md.add(groupsTemplate(page.model.groups));
  }

  return md.print();
}
