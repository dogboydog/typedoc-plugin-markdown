import { DeclarationReflection } from 'typedoc';

import { MarkdownBuilder } from '../tools/builder';
import { heading, unorderedList } from '../tools/elements';
import { commentsTemplate } from './comments';
import { groupsTemplate } from './groups';
import { hierarchyTemplate } from './hierachy';
import { reflectionPathTemplate } from './reflection.path';
import { signatureTemplate } from './signature';
import { typeParameterTableTemplate } from './table.type-parameter';
import { tocTemplate } from './toc';
import { typeTemplate } from './type';

export function reflectionTemplate(model: DeclarationReflection) {
  const md = new MarkdownBuilder();

  md.add(reflectionPathTemplate(model));

  if (model.comment) {
    md.add(commentsTemplate(model.comment));
  }

  if (model.typeParameters) {
    md.add(heading(2, 'Type parameters'));
    md.add(typeParameterTableTemplate(model.typeParameters));
  }

  if (model.typeHierarchy && model.typeHierarchy.next) {
    md.add(heading(2, 'Hierarchy'));
    md.add(hierarchyTemplate(model.typeHierarchy));
  }

  if (model.implementedTypes) {
    md.add(heading(2, 'Implements'));
    md.add(
      unorderedList(
        model.implementedTypes.map((implementedType) =>
          typeTemplate(implementedType),
        ),
      ),
    );
  }

  if (model.signatures) {
    md.add(heading(2, 'Callable'));
    model.signatures.forEach((signature) => {
      md.add(heading(3, signature.name));
      md.add(signatureTemplate(signature));
    });
  }

  md.add(tocTemplate(model));

  if (model.groups) {
    md.add(groupsTemplate(model.groups));
  }

  return md.print();
}
