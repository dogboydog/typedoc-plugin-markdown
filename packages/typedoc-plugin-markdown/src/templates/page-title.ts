import { ParameterReflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import { getContext } from '../context';
import { escapeChars } from '../tools/utils';

export function pageTitleTemplate(page: PageEvent, shouldEscape = true) {
  const { indexTitle } = getContext();
  const title: string[] = [''];
  if (page.model && page.model.kindString && page.url !== page.project.url) {
    title.push(`${page.model.kindString}: `);
  }

  if (page.url === page.project.url) {
    title.push(indexTitle || page.project.name);
  } else {
    title.push(shouldEscape ? escapeChars(page.model.name) : page.model.name);
    if (page.model.typeParameters) {
      const typeParameters = page.model.typeParameters
        .map((typeParameter: ParameterReflection) => typeParameter.name)
        .join(', ');
      title.push(`<${typeParameters}${shouldEscape ? '\\>' : '>'}`);
    }
  }
  return title.join('');
}
