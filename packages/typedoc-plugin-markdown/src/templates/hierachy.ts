import { DeclarationHierarchy } from 'typedoc';
import { spaces } from '../tools/utils';
import { typeTemplate } from './type';

export function hierarchyTemplate(model: DeclarationHierarchy) {
  return hierarchy(model);
}

function hierarchy(model: DeclarationHierarchy, level = 0) {
  const md: string[] = [];
  const symbol = level > 0 ? getSymbol(level) : '-';
  model.types.forEach((hierarchyType) => {
    if (model.isTarget) {
      md.push(`${symbol} **\`${hierarchyType}\`**`);
    } else {
      md.push(`${symbol} ${typeTemplate(hierarchyType)}`);
    }
  });
  if (model.next) {
    md.push(hierarchy(model.next, level + 1));
  }
  return md.join('\n\n');
}

function getSymbol(level: number) {
  return spaces(2) + [...Array(level)].map(() => '↳').join('');
}
