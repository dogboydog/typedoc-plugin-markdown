import * as path from 'path';

import {
  Application,
  Context,
  Converter,
  PageEvent,
  ParameterType,
} from 'typedoc';
import { setActiveUrl, setOptions } from './context';
import { CustomOptionsReader } from './tools/options-reader';

import { MarkdownTheme } from './theme';

export function load(app: Application) {
  addDeclarations(app);
  addSettings(app);
  setTheme(app);
}

function addDeclarations(app: Application) {
  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render page title.',
    name: 'hidePageTitle',
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render breadcrumbs in template.',
    name: 'hideBreadcrumbs',
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Specifies the base path that all links to be served from. If omitted all urls will be relative.',
    name: 'publicPath',
    type: ParameterType.String,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Use HTML named anchors as fragment identifiers for engines that do not automatically assign header ids. Should be set for Bitbucket Server docs.',
    name: 'namedAnchors',
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Output all reflections into seperate output files.',
    name: 'allReflectionsHaveOwnDocument',
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Separator used to format filenames.',
    name: 'filenameSeparator',
    type: ParameterType.String,
    defaultValue: '.',
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] The file name of the entry document.',
    name: 'entryDocument',
    type: ParameterType.String,
    defaultValue: 'README.md',
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Do not render in-page table of contents items.',
    name: 'hideInPageTOC',
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    help: '[Markdown Plugin] Customise the index page title.',
    name: 'indexTitle',
    type: ParameterType.String,
  });
}

function addSettings(app: Application) {
  app.renderer.on(PageEvent.BEGIN, (page: PageEvent) => {
    setActiveUrl(page.url);
  });

  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => {
    setOptions({
      project: context.project,
      entryDocument: app.options.getValue('entryDocument') as string,
      entryPoints: app.options.getValue('entryPoints') as string[],
      readme: app.options.getValue('readme') as string,
      publicPath: app.options.getValue('publicPath') as string,
      hideBreadcrumbs: app.options.getValue('hideBreadcrumbs') as boolean,
      hideInPageTOC: app.options.getValue('hideInPageTOC') as boolean,
      namedAnchors: app.options.getValue('namedAnchors') as boolean,
    });
  });
}

function setTheme(app: Application) {
  const themeRef = app.options.getValue('theme');

  const getCustomTheme = (themeFile: string) => {
    try {
      const ThemeClass = require(themeFile);
      const instance = ThemeClass[Object.keys(ThemeClass)[0]];
      return instance.prototype instanceof MarkdownTheme ? instance : null;
    } catch (e) {
      return null;
    }
  };

  if (['default', 'markdown'].includes(themeRef)) {
    app.renderer.theme = new MarkdownTheme(app.renderer);
  } else {
    const CustomTheme = getCustomTheme(
      path.resolve(path.join(themeRef, 'theme.js')),
    );
    if (CustomTheme !== null) {
      app.options.addReader(new CustomOptionsReader());
      app.renderer.theme = new CustomTheme(app.renderer);
    } else {
      app.logger.warn(
        `[typedoc-plugin-markdown] '${themeRef}' is not a recognised markdown theme.`,
      );
    }
  }
}
