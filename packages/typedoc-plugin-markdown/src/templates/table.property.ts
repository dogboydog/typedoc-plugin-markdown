import { DeclarationReflection } from 'typedoc';
import { table } from '../tools/elements';
import { escapeChars, stripLineBreaks } from '../tools/utils';
import { commentsTemplate } from './comments';
import { signatureTitleTemplate } from './signature.title';
import { typeTemplate } from './type';

export function propertyTableTemplate(model: DeclarationReflection[]) {
  const comments = model.map(
    (param) =>
      !!param.comment?.text?.trim() || !!param.comment?.shortText?.trim(),
  );
  const hasComments = !comments.every((value) => !value);

  const headers = ['Name', 'Type'];

  if (hasComments) {
    headers.push('Description');
  }

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
    const shouldFlatten = current.type?.declaration?.children;

    return shouldFlatten
      ? [...acc, current, ...flattenParams(current)]
      : [...acc, current];
  };

  const properties = model.reduce(
    (acc: any, current: any) => parseParams(current, acc),
    [],
  );

  const rows = properties.map((property) => {
    const propertyType = property.type ? property.type : property;
    const row: string[] = [];
    const nameCol: string[] = [];
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? escapeChars(getName(property))
        : `\`${getName(property)}\``;
    nameCol.push(name);
    row.push(nameCol.join(' '));
    row.push(typeTemplate(propertyType, 'object').replace(/(?<!\\)\|/g, '\\|'));

    if (hasComments) {
      if (property.comment) {
        row.push(stripLineBreaks(commentsTemplate(property.comment)));
      } else {
        row.push('-');
      }
    }
    return row;
  });

  return table(headers, rows);
}

function getName(property: DeclarationReflection) {
  const md: string[] = [];
  if (property.flags.isRest) {
    md.push('...');
  }
  if (property.getSignature) {
    md.push(signatureTitleTemplate(property.getSignature, 'get', false));
  } else if (property.setSignature) {
    md.push(signatureTitleTemplate(property.setSignature, 'set', false));
  } else {
    md.push(property.name);
  }
  if (property.flags.isOptional) {
    md.push('?');
  }
  return md.join('');
}
