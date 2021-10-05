import * as Handlebars from 'handlebars';
import { ReferenceReflection } from 'typedoc';
import { linkTemplate } from './link';

export function referenceTemplate(reference: ReferenceReflection) {
  const referenced = reference.tryGetTargetReflectionDeep();

  if (!referenced) {
    return `Re-exports ${reference.name}`;
  }

  if (reference.name === referenced.name) {
    return `Re-exports ${linkTemplate(referenced.name, reference.url)}`;
  }

  return `Renames and re-exports ${linkTemplate(
    referenced.name,
    reference.url,
  )}`;
}
