import {
  DeclarationReflection,
  SignatureReflection,
} from 'typedoc/dist/lib/models';

import { MarkdownBuilder } from '../tools/builder';
import { heading } from '../tools/elements';
import { commentsTemplate } from './comments';
import { declarationTitleTemplate } from './declaration.title';
import { signatureTemplate } from './signature';
import { sourcesTemplate } from './sources';
import { propertyTableTemplate } from './table.property';
import { typeParameterTableTemplate } from './table.type-parameter';
import { typeTemplate } from './type';

export function declarationTemplate(model: DeclarationReflection) {
  const md = new MarkdownBuilder();

  const typeDeclaration = (model.type as any)
    ?.declaration as DeclarationReflection;

  md.add(declarationTitleTemplate(model));

  if (model.comment) {
    md.add(commentsTemplate(model.comment));
  }

  if (model.typeParameters) {
    md.add(heading(4, 'Type parameters'));
    md.add(typeParameterTableTemplate(model.typeParameters));
  }

  if (typeDeclaration?.indexSignature) {
    md.add(heading(4, 'Index signature'));
    md.add(getIndexSignatureTitle(typeDeclaration.indexSignature));
  }

  if (typeDeclaration?.signatures) {
    md.add(
      heading(
        4,
        typeDeclaration.children ? 'Call signature' : 'Type declaration',
      ),
    );
    typeDeclaration.signatures.forEach((signature) => {
      md.add(signatureTemplate(signature, true));
    });
  }

  if (typeDeclaration?.children) {
    md.add(heading(4, 'Type declaration'));
    md.add(propertyTableTemplate(typeDeclaration.children));
  }

  md.add(sourcesTemplate(model));

  return md.print();
}

export function getIndexSignatureTitle(model: SignatureReflection) {
  const md = ['▪'];
  const parameters = model.parameters
    ? model.parameters.map((parameter) => {
        return `${parameter.name}: ${
          parameter.type ? typeTemplate(parameter.type) : ''
        }`;
      })
    : [];
  md.push(
    `\[${parameters.join('')}\]: ${model.type ? typeTemplate(model.type) : ''}`,
  );
  return md.join(' ');
}
