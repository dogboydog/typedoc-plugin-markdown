import {
  DeclarationReflection,
  LiteralType,
  ParameterReflection,
  ReflectionKind,
  ReflectionType,
} from 'typedoc';
import {
  escapeChars,
  memberSymbol,
  stripComments,
  stripLineBreaks,
} from '../tools/utils';
import { typeTemplate } from './type';

export function declarationTitleTemplate(
  model: ParameterReflection | DeclarationReflection,
) {
  const md = [memberSymbol(model)];

  function getType(reflection: ParameterReflection | DeclarationReflection) {
    const reflectionType = reflection.type as ReflectionType;
    if (reflectionType && reflectionType.declaration?.children) {
      return ': `Object`';
    }
    return (
      ': ' +
      typeTemplate(reflectionType ? reflectionType : reflection, 'object')
    );
  }

  if (model.flags && model.flags.length > 0 && !model.flags.isRest) {
    md.push(' ' + model.flags.map((flag) => `\`${flag}\``).join(' '));
  }
  md.push(`${model.flags.isRest ? '... ' : ''} **${escapeChars(model.name)}**`);
  if (model instanceof DeclarationReflection && model.typeParameters) {
    md.push(
      `<${model.typeParameters
        .map((typeParameter) => `\`${typeParameter.name}\``)
        .join(', ')}\\>`,
    );
  }

  if (!model.parent?.kindOf(ReflectionKind.Enum)) {
    md.push(getType(model));
  }

  if (
    !(model.type instanceof LiteralType) &&
    model.defaultValue &&
    model.defaultValue !== '...'
  ) {
    md.push(` = \`${stripLineBreaks(stripComments(model.defaultValue))}\``);
  }
  return md.join('');
}
