import {
  DeclarationReflection,
  ReflectionCategory,
  ReflectionGroup,
} from 'typedoc/dist/lib/models';

import { MarkdownBuilder } from '../tools/builder';
import { heading, horizontalRule } from '../tools/elements';
import { memberTemplate } from './member';

export function groupsTemplate(groups: ReflectionGroup[]) {
  const md = new MarkdownBuilder();

  groups
    ?.filter((group) => !group.allChildrenHaveOwnDocument())
    .forEach((group) => {
      if (group.categories) {
        group.categories
          ?.filter((category) => !category.allChildrenHaveOwnDocument())
          .forEach((category) => {
            md.add(heading(2, `${group.title} ${category.title}`));
            md.add(getMembers(category));
          });
      } else {
        md.add(heading(2, group.title));
        md.add(getMembers(group));
      }
    });

  return md.print();
}

function getMembers(item: ReflectionGroup | ReflectionCategory) {
  const md = new MarkdownBuilder();
  item.children.forEach((child, index) => {
    md.add(memberTemplate(child as DeclarationReflection));
    if (index !== item.children.length - 1) {
      md.add(horizontalRule());
    }
  });
  return md.print();
}
