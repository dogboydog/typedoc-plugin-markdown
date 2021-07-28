import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { linkTemplate } from './link';

export function reflectionPathTemplate(model: DeclarationReflection) {
  if (model) {
    if (model.kind && model.kind !== ReflectionKind.Module) {
      const title: string[] = [];
      if (model.parent && model.parent.parent) {
        if (model.parent.parent.parent) {
          title.push(
            linkTemplate(model.parent.parent.name, model.parent.parent.url),
          );
        }
        title.push(linkTemplate(model.parent.name, model.parent.url));
      }
      title.push(model.name);
      return title.length > 1 ? `${title.join('.')}` : '';
    }
  }
  return '';
}
