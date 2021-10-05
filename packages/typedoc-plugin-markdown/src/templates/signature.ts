import {
  DeclarationReflection,
  ReflectionKind,
  SignatureReflection,
} from 'typedoc';
import { MarkdownBuilder } from '../tools/builder';
import { heading } from '../tools/elements';
import { comment, commentsTemplate } from './comments';
import { signatureTitleTemplate } from './signature.title';
import { sourcesTemplate } from './sources';
import { parameterTableTemplate } from './table.parameter';
import { propertyTableTemplate } from './table.property';
import { typeParameterTableTemplate } from './table.type-parameter';
import { typeTemplate } from './type';

export function signatureTemplate(
  model: SignatureReflection,
  nested = false,
  accessor?: string,
) {
  const md = new MarkdownBuilder();

  const typeDeclaration = (model.type as any)
    ?.declaration as DeclarationReflection;

  md.add(signatureTitleTemplate(model, accessor));

  if (model.comment) {
    md.add(commentsTemplate(model.comment));
  }

  if (model.typeParameters?.length) {
    md.add(heading(nested ? 5 : 4, 'Type parameters'));
    md.add(typeParameterTableTemplate(model.typeParameters));
  }

  if (model.parameters?.length) {
    md.add(heading(nested ? 5 : 4, 'Parameters'));
    md.add(parameterTableTemplate(model.parameters));
  }

  if (model.type && !model.parent?.kindOf(ReflectionKind.Constructor)) {
    if (model.type) {
      md.add(heading(nested ? 5 : 4, 'Returns'));
      md.add(typeTemplate(model.type, 'all'));
      if (model.comment?.returns) {
        md.add(comment(model.comment.returns));
      }
    }

    if (typeDeclaration?.signatures) {
      typeDeclaration.signatures.forEach((signature) => {
        md.add(signatureTemplate(signature, true));
      });
    }

    if (typeDeclaration?.children) {
      md.add(propertyTableTemplate(typeDeclaration.children));
    }
  }

  if (!nested) {
    md.add(sourcesTemplate(model));
  }

  return md.print();
}
