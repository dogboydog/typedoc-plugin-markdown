import { DeclarationReflection, ReferenceReflection } from 'typedoc';
import settings from '../settings';
import { MarkdownBuilder } from '../tools/builder';
import { heading } from '../tools/elements';
import { escapeChars } from '../tools/utils';
import { declarationTemplate } from './declaration';
import { signatureTemplate } from './signature';

export function memberTemplate(
  model: DeclarationReflection | ReferenceReflection,
) {
  const options = settings.options;
  const md = new MarkdownBuilder();

  md.add(
    heading(
      3,
      options.namedAnchors
        ? `<a id="${model.anchor}" name="${model.anchor}"></a> `
        : '' + escapeChars(model.name),
    ),
  );

  if (model.signatures) {
    model.signatures.forEach((signature) => {
      md.add(signatureTemplate(signature));
    });
  } else {
    if (model.hasGetterOrSetter()) {
      if (model.getSignature) {
        md.add(signatureTemplate(model.getSignature, false, 'get'));
      }
      if (model.setSignature) {
        md.add(signatureTemplate(model.setSignature, false, 'set'));
      }
    } else {
      if (model instanceof ReferenceReflection && model.isReference) {
        const deep = model.tryGetTargetReflectionDeep();
        if (deep) {
          md.add(`Re-exports ${deep.name}`);
        }
      }

      if (model instanceof DeclarationReflection) {
        md.add(declarationTemplate(model));
      }
    }
  }

  return md.print();
}
