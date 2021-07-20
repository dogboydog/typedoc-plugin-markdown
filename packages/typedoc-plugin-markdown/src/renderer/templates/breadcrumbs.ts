import { Reflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import settings from '../settings';
import { MarkdownBuilder } from '../tools/builder';
import { escapeChars } from '../tools/utils';
import { linkTemplate } from './link';

export function breadcrumbsTemplate(page: PageEvent) {
  const { activeUrl, globalsName, globalsFile, options } = settings;

  const md = new MarkdownBuilder();

  md.add(
    page.url === options.entryDocument
      ? page.project.name
      : linkTemplate(page.project.name, options.entryDocument),
  );

  if (!options.readme.endsWith('none')) {
    if (activeUrl === globalsFile) {
      md.add(globalsName);
    } else {
      md.add(linkTemplate(globalsName, globalsFile));
    }
  }

  const addBreadcrumb = (model: Reflection, md: MarkdownBuilder) => {
    if (model && model.parent) {
      addBreadcrumb(model.parent, md);

      if (activeUrl === model.url) {
        md.add(escapeChars(model.name));
      } else {
        md.add(linkTemplate(model.name, model.url));
      }
    }
  };

  addBreadcrumb(page.model, md);

  return md.print(' / ');
}
