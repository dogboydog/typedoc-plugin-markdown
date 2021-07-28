import {
  Application,
  DeclarationReflection,
  ProjectReflection,
} from 'typedoc/dist';
import { PageEvent, RendererEvent } from 'typedoc/dist/lib/output/events';
import { AbstractComponent, BindOption } from 'typedoc/dist/lib/utils';
import { MarkdownRenderer } from './renderer';

class ContextComponent extends AbstractComponent<MarkdownRenderer> {
  @BindOption('entryPoints')
  entryPoints!: string[];
  @BindOption('readme')
  readme!: string;
  @BindOption('entryDocument')
  entryDocument!: string;
  @BindOption('publicPath')
  publicPath!: string;
  @BindOption('hideBreadcrumbs')
  hideBreadcrumbs!: string;
  @BindOption('hidePageTitle')
  hidePageTitle!: string;
  @BindOption('hideInPageTOC')
  hideInPageTOC!: string;
  @BindOption('namedAnchors')
  namedAnchors!: string;
  @BindOption('indexTitle')
  indexTitle!: string;
  @BindOption('filenameSeparator')
  filenameSeparator!: string;
  @BindOption('allReflectionsHaveOwnDocument')
  allReflectionsHaveOwnDocument!: string;

  globalsFile = 'modules.md';

  globalsName =
    this.entryPoints && this.entryPoints.length > 1 ? 'Modules' : 'Exports';

  project: ProjectReflection;

  activeReflection?: DeclarationReflection;

  activeUrl: string;

  initialize() {
    this.listenTo(this.owner, {
      [RendererEvent.BEGIN]: this.onBeginRenderer,
      [PageEvent.BEGIN]: this.onBeginPage,
    });
  }

  onBeginRenderer(event: RendererEvent) {
    this.project = event.project;
  }

  onBeginPage(page: PageEvent) {
    this.activeUrl = page.url;
    this.activeReflection =
      page.model instanceof DeclarationReflection ? page.model : undefined;
  }
}

let context: ContextComponent;

export function loadContext(app: Application) {
  context = new ContextComponent(app.renderer);
}

export function getContext() {
  return context;
}
