import { TypeDocOptions } from 'typedoc';

export interface PluginOptions extends TypeDocOptions {
  entryDocument: string;
  filenameSeparator: string;
  allReflectionsHaveOwnDocument: boolean;
  hideBreadcrumbs: boolean;
  publicPath: string;
  indexTitle: string;
  hideInPageTOC: boolean;
  namedAnchors: boolean;
  hidePageTitle: boolean;
}
