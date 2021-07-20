import * as fs from 'fs';
import * as path from 'path';
import ProgressBar from 'progress';
import {
  DeclarationReflection,
  NavigationItem,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  UrlMapping,
} from 'typedoc';
import { GroupPlugin } from 'typedoc/dist/lib/converter/plugins';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import settings from './settings';
import { pageTemplate } from './templates/page';
import { readmeTemplate } from './templates/readme';
import { formatContents } from './tools/utils';
import { PluginOptions } from './types';

const URL_PREFIX = /^(http|ftp)s?:\/\//;

export async function render(
  project: ProjectReflection,
  outputDirectory: string,
) {
  if (
    !this.prepareTheme() ||
    !(await this.prepareOutputDirectory(outputDirectory))
  ) {
    return;
  }

  settings.project = project;

  const output = new RendererEvent(
    RendererEvent.BEGIN,
    outputDirectory,
    project,
  );

  const options = this.application.options.getRawValues() as PluginOptions;
  settings.options = options;
  output.settings = options;
  output.urls = getUrls(project);

  if (output.urls) {
    const bar = new ProgressBar('Rendering [:bar] :percent', {
      stream: process.stdout,
      total: output.urls.length,
      width: 40,
    });

    output.urls
      .filter((mapping) => mapping.url)
      .forEach((mapping) => {
        const page = output.createPageEvent(mapping);
        settings.activeUrl = page.url;
        settings.activeReflection = page.model;
        if (
          path.basename(page.filename) === options.entryDocument &&
          !options.readme?.endsWith('none')
        ) {
          writeFile(page.filename, formatContents(readmeTemplate(page)));
        } else {
          writeFile(page.filename, formatContents(pageTemplate(page)));
        }
        bar.tick();
      });
  }
}

export function writeFile(file: string, content: string) {
  const basename = path.dirname(file);
  if (!fs.existsSync(basename)) {
    fs.mkdirSync(basename);
  }
  fs.writeFileSync(file, content);
}

export const mappings = () => {
  const { allReflectionsHaveOwnDocument } = settings.options;
  return [
    {
      kind: [ReflectionKind.Module],
      isLeaf: false,
      directory: 'modules',
      template: 'reflection.hbs',
    },
    {
      kind: [ReflectionKind.Namespace],
      isLeaf: false,
      directory: 'modules',
      template: 'reflection.hbs',
    },
    {
      kind: [ReflectionKind.Enum],
      isLeaf: false,
      directory: 'enums',
      template: 'reflection.hbs',
    },
    {
      kind: [ReflectionKind.Class],
      isLeaf: false,
      directory: 'classes',
      template: 'reflection.hbs',
    },
    {
      kind: [ReflectionKind.Interface],
      isLeaf: false,
      directory: 'interfaces',
      template: 'reflection.hbs',
    },
    ...(allReflectionsHaveOwnDocument
      ? [
          {
            kind: [ReflectionKind.TypeAlias],
            isLeaf: true,
            directory: 'types',
            template: 'reflection.member.hbs',
          },
          {
            kind: [ReflectionKind.Variable],
            isLeaf: true,
            directory: 'variables',
            template: 'reflection.member.hbs',
          },
          {
            kind: [ReflectionKind.Function],
            isLeaf: true,
            directory: 'functions',
            template: 'reflection.member.hbs',
          },
        ]
      : []),
  ];
};

export function getUrls(project: ProjectReflection) {
  const { readme, entryDocument } = settings.options;
  const urls: UrlMapping[] = [];
  const noReadmeFile = readme == path.join(process.cwd(), 'none');
  if (noReadmeFile) {
    project.url = entryDocument;
    urls.push(new UrlMapping(entryDocument, project, 'reflection.hbs'));
  } else {
    project.url = settings.globalsFile;
    urls.push(new UrlMapping(settings.globalsFile, project, 'reflection.hbs'));
    urls.push(new UrlMapping(entryDocument, project, 'index.hbs'));
  }
  project.children?.forEach((child: Reflection) => {
    if (child instanceof DeclarationReflection) {
      buildUrls(child as DeclarationReflection, urls);
    }
  });
  return urls;
}

function buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]) {
  const mapping = mappings().find((mapping) => reflection.kindOf(mapping.kind));

  if (mapping) {
    if (!reflection.url || !URL_PREFIX.test(reflection.url)) {
      const url = mapping.directory + '/' + getUrl(reflection) + '.md';
      urls.push(new UrlMapping(url, reflection, mapping.template));
      reflection.url = url;
      reflection.hasOwnDocument = true;
    }
    for (const child of reflection.children || []) {
      if (mapping.isLeaf) {
        applyAnchorUrl(child, reflection);
      } else {
        buildUrls(child, urls);
      }
    }
  } else if (reflection.parent) {
    applyAnchorUrl(reflection, reflection.parent);
  }
  return urls;
}

function getUrl(reflection: Reflection, relative?: Reflection) {
  const { filenameSeparator } = settings.options;
  let url = reflection.getAlias();

  if (
    reflection.parent &&
    reflection.parent !== relative &&
    !(reflection.parent instanceof ProjectReflection)
  ) {
    url = getUrl(reflection.parent, relative) + filenameSeparator + url;
  }

  return url;
}

function applyAnchorUrl(reflection: Reflection, container: Reflection) {
  if (!reflection.url || !URL_PREFIX.test(reflection.url)) {
    const reflectionId = reflection.name.toLowerCase();
    const anchor = reflectionId;
    reflection.url = container.url + '#' + anchor;
    reflection.anchor = anchor;
    reflection.hasOwnDocument = false;
  }
  reflection.traverse((child) => {
    if (child instanceof DeclarationReflection) {
      applyAnchorUrl(child, container);
    }
  });
}

export function getNavigation(project: ProjectReflection) {
  const { readme, entryPoints, entryDocument } = settings.options;
  const createNavigationItem = (
    title: string,
    url: string | undefined,
    isLabel: boolean,
    children: NavigationItem[] = [],
  ) => {
    const navigationItem = new NavigationItem(title, url);
    navigationItem.isLabel = isLabel;
    navigationItem.children = children;
    const { reflection, parent, cssClasses, ...filteredNavigationItem } =
      navigationItem;
    return filteredNavigationItem as NavigationItem;
  };
  const navigation = createNavigationItem(project.name, undefined, false);
  const hasReadme = readme !== path.join(process.cwd(), 'none');
  if (hasReadme) {
    navigation.children?.push(
      createNavigationItem('Readme', entryDocument, false),
    );
  }
  if (entryPoints.length === 1) {
    navigation.children?.push(
      createNavigationItem(
        'Exports',
        hasReadme ? settings.globalsFile : entryDocument,
        false,
      ),
    );
  }
  mappings().forEach((mapping) => {
    const kind = mapping.kind[0];
    const items = project.getReflectionsByKind(kind);
    if (items.length > 0) {
      const children = items
        .map((item) => createNavigationItem(item.getFullName(), item.url, true))
        .sort((a, b) => (a.title > b.title ? 1 : -1));
      const group = createNavigationItem(
        GroupPlugin.getKindPlural(kind),
        undefined,
        true,
        children,
      );
      navigation.children?.push(group);
    }
  });
  return navigation;
}
