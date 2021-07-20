import { DeclarationReflection, ProjectReflection } from 'typedoc';

import { PluginOptions } from './types';

let _project: ProjectReflection;
let _options: PluginOptions;
let _activeUrl: string;
let _activeReflection: DeclarationReflection;

export default {
  get project() {
    return _project;
  },

  set project(project: ProjectReflection) {
    _project = project;
  },

  get options() {
    return _options;
  },

  set options(options: PluginOptions) {
    _options = options;
  },

  get activeUrl() {
    return _activeUrl;
  },

  set activeUrl(url) {
    _activeUrl = url;
  },

  get activeReflection() {
    return _activeReflection;
  },

  set activeReflection(reflection) {
    _activeReflection = reflection;
  },

  get globalsFile() {
    return 'modules.md';
  },

  get globalsName() {
    return _options.entryPoints && _options.entryPoints.length > 1
      ? 'Modules'
      : 'Exports';
  },
};
