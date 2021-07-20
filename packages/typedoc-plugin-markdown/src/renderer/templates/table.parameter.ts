import { ParameterReflection, ReflectionKind } from 'typedoc';
import { table } from '../tools/elements';
import { stripLineBreaks } from '../tools/utils';
import { commentsTemplate } from './comments';
import { getReflectionType, typeTemplate } from './type';

export function parameterTableTemplate(model: ParameterReflection[]) {
  const flattenParams = (current: any) => {
    return current.type?.declaration?.children?.reduce(
      (acc: any, child: any) => {
        const childObj = {
          ...child,
          name: `${current.name}.${child.name}`,
        };
        return parseParams(childObj, acc);
      },
      [],
    );
  };

  const parseParams = (current: any, acc: any) => {
    const shouldFlatten =
      current.type?.declaration?.kind === ReflectionKind.TypeLiteral &&
      current.type?.declaration?.children;
    return shouldFlatten
      ? [...acc, current, ...flattenParams(current)]
      : [...acc, current];
  };

  const parameters = model.reduce(
    (acc: any, current: any) => parseParams(current, acc),
    [],
  );

  const showDefaults = hasDefaultValues(parameters);

  const comments = parameters.map(
    (param) =>
      !!param.comment?.text?.trim() || !!param.comment?.shortText?.trim(),
  );
  const hasComments = !comments.every((value) => !value);

  const headers = ['Name', 'Type'];

  if (showDefaults) {
    headers.push('Default value');
  }

  if (hasComments) {
    headers.push('Description');
  }

  const rows: string[][] = parameters.map((parameter) => {
    const row: string[] = [];

    row.push(
      `\`${parameter.flags.isRest ? '...' : ''}${parameter.name}${
        parameter.flags.isOptional ? '?' : ''
      }\``,
    );

    row.push(
      parameter.type
        ? typeTemplate(parameter.type, 'object')
        : getReflectionType(parameter, 'object'),
    );

    if (showDefaults) {
      row.push(getDefaultValue(parameter));
    }
    if (hasComments) {
      if (parameter.comment) {
        row.push(
          stripLineBreaks(commentsTemplate(parameter.comment)).replace(
            /\|/g,
            '\\|',
          ),
        );
      } else {
        row.push('-');
      }
    }
    return row;
  });
  return table(headers, rows);
}

function getDefaultValue(parameter: ParameterReflection) {
  return parameter.defaultValue && parameter.defaultValue !== '...'
    ? `\`${parameter.defaultValue}\``
    : '`undefined`';
}

function hasDefaultValues(parameters: ParameterReflection[]) {
  const defaultValues = (parameters as ParameterReflection[]).map(
    (param) =>
      param.defaultValue !== '{}' &&
      param.defaultValue !== '...' &&
      !!param.defaultValue,
  );

  return !defaultValues.every((value) => !value);
}
