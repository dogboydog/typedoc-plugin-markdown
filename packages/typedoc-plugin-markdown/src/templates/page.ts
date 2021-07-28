import { DeclarationReflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { getContext } from '../context';
import { MarkdownBuilder } from '../tools/builder';
import { heading } from '../tools/elements';
import { breadcrumbsTemplate } from './breadcrumbs';
import { groupsTemplate } from './groups';
import { pageTitleTemplate } from './page-title';
import { reflectionTemplate } from './reflection';
import { tocTemplate } from './toc';

export function pageTemplate(page: PageEvent) {
  const md = new MarkdownBuilder();

  const { hideBreadcrumbs, hidePageTitle } = getContext();

  if (!hideBreadcrumbs) {
    md.add(breadcrumbsTemplate(page));
  }

  if (!hidePageTitle) {
    md.add(heading(1, pageTitleTemplate(page)));
  }

  if (page.model instanceof DeclarationReflection) {
    md.add(reflectionTemplate(page.model));
  } else {
    md.add(tocTemplate(page.model));
    md.add(groupsTemplate(page.model.groups));
  }

  return md.print();
}
