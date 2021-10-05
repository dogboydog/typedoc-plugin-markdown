import { ProjectReflection } from 'typedoc';

interface PluginOptions {
  project: ProjectReflection;
  entryDocument: string;
  entryPoints: string[];
  readme: string;
  publicPath: string;
  hideBreadcrumbs: boolean;
  hideInPageTOC: boolean;
  namedAnchors: boolean;
}

export interface Settings extends PluginOptions {
  activeUrl: string;
  globalsFile: string;
  globalsName: string;
}

let activeUrl: string;
let settings: Settings;

export function setActiveUrl(url: string) {
  activeUrl = url;
}

export function setOptions(pluginOptions: PluginOptions) {
  settings = {
    ...pluginOptions,
    globalsFile: 'modules.md',
    globalsName:
      pluginOptions.entryPoints && pluginOptions.entryPoints.length > 1
        ? 'Modules'
        : 'Exports',
    activeUrl: '',
  };
}

export const useSettings = (): Settings => ({
  ...settings,
  activeUrl: activeUrl,
});
