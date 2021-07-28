import { TypeParameterReflection } from 'typedoc';
import { table } from '../tools/elements';
import { stripLineBreaks } from '../tools/utils';
import { commentsTemplate } from './comments';
import { typeTemplate } from './type';

export function typeParameterTableTemplate(
  parameters: TypeParameterReflection[],
) {
  const showTypeCol = hasTypes(parameters);
  const comments = parameters.map(
    (param) =>
      !!param.comment?.text?.trim() || !!param.comment?.shortText?.trim(),
  );
  const hasComments = !comments.every((value) => !value);

  const headers = ['Name'];

  if (showTypeCol) {
    headers.push('Type');
  }

  if (hasComments) {
    headers.push('Description');
  }

  const rows = parameters.map((parameter) => {
    const row: string[] = [];

    row.push(`\`${parameter.name}\``);

    if (showTypeCol) {
      const typeCol: string[] = [];
      if (!parameter.type && !parameter.default) {
        typeCol.push(`\`${parameter.name}\``);
      }
      if (parameter.type) {
        typeCol.push(`extends ${typeTemplate(parameter.type, 'object')}`);
      }
      if (parameter.default) {
        typeCol.push(typeTemplate(parameter.default));
      }
      row.push(typeCol.join(''));
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

function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default,
  );
  return !types.every((value) => !value);
}
