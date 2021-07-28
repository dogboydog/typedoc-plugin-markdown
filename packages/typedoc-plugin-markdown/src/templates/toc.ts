import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionCategory,
  ReflectionGroup,
} from 'typedoc/dist/lib/models';
import { getContext } from '../context';
import { MarkdownBuilder } from '../tools/builder';
import { heading, unorderedList } from '../tools/elements';
import { linkTemplate } from './link';

export function tocTemplate(model: ProjectReflection | DeclarationReflection) {
  const { hideInPageTOC } = getContext();

  const md = new MarkdownBuilder();
  const isVisible = model.groups?.some((group) =>
    group.allChildrenHaveOwnDocument(),
  );
  if ((!this.hideInPageTOC && model.groups) || (isVisible && model.groups)) {
    if (!hideInPageTOC) {
      md.add(heading(2, 'Table of contents'));
    }
    model.groups
      ?.filter((group) => !hideInPageTOC || group.allChildrenHaveOwnDocument())
      .forEach((group) => {
        if (group.categories) {
          group.categories.forEach((category) => {
            md.add(getGroup(category, category.title + ' ' + group.title));
          });
        } else {
          md.add(getGroup(group, group.title));
        }
      });
  }

  return md.print();
}

function getGroup(group: ReflectionGroup | ReflectionCategory, title: string) {
  const { hideInPageTOC } = getContext();
  const md = new MarkdownBuilder();
  md.add(heading(hideInPageTOC ? 2 : 3, title));
  const groupItems = group.children.map((child) =>
    linkTemplate(child.name, child.url),
  );
  md.add(unorderedList(groupItems));
  return md.print();
}
