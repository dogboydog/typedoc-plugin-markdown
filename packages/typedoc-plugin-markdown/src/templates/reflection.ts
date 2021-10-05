import { DeclarationReflection, PageEvent, ProjectReflection } from 'typedoc';

import { typeTemplate } from './type';
import { MarkdownBuilder } from '../tools/builder';
import { heading, unorderedList } from '../tools/elements';
import { commentsTemplate } from './comments';
import { hierarchyTemplate } from './hierarchy';

import { reflectionPathTemplate } from './reflection-path';
import { typeParameterTableTemplate } from './table.type-parameter';
import { signatureTemplate } from './signature';
import { tocTemplate } from './toc';
import { groupsTemplate } from './groups';
import { breadcrumbsTemplate } from './breadcrumbs';
import { useSettings } from '../context';

export function reflectionTemplate(page: PageEvent<DeclarationReflection>) {
  const { hideBreadcrumbs } = useSettings();

  const md = new MarkdownBuilder();

  if (!hideBreadcrumbs) {
    md.add(breadcrumbsTemplate(page));
  }

  md.add(reflectionPathTemplate(page.model));

  if (page.model.comment) {
    md.add(commentsTemplate(page.model.comment));
  }

  if (page.model.typeParameters) {
    md.add(heading(2, 'Type parameters'));
    md.add(typeParameterTableTemplate(page.model.typeParameters));
  }

  if (page.model.typeHierarchy && page.model.typeHierarchy.next) {
    md.add(heading(2, 'Hierarchy'));
    md.add(hierarchyTemplate(page.model.typeHierarchy));
  }

  if (page.model.implementedTypes) {
    md.add(heading(2, 'Implements'));
    md.add(
      unorderedList(
        page.model.implementedTypes.map((implementedType) =>
          typeTemplate(implementedType),
        ),
      ),
    );
  }

  if (page.model.signatures) {
    md.add(heading(2, 'Callable'));
    page.model.signatures.forEach((signature) => {
      md.add(heading(3, signature.name));
      md.add(signatureTemplate(signature));
    });
  }

  md.add(tocTemplate(page.model));

  if (page.model.groups) {
    md.add(groupsTemplate(page.model.groups));
  }

  return md.print();
}
