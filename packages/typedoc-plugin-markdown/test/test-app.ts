import * as path from 'path';
import * as tmp from 'tmp';
import {
  Application,
  DeclarationReflection,
  ProjectReflection,
  TSConfigReader,
  TypeDocReader,
} from 'typedoc';
import { RendererEvent } from 'typedoc/dist/lib/output/events';
import { load } from '../src/index';
import { getUrls } from '../src/renderer/renderer';
import settings from '../src/renderer/settings';
import { PluginOptions } from '../src/renderer/types';

tmp.setGracefulCleanup();

export class TestApp {
  app: Application;
  project: ProjectReflection;
  outDir: string;
  tmpobj: tmp.DirResult;
  entryPoints: string[];

  constructor(entryPoints?: string[]) {
    this.app = new Application();
    this.entryPoints = entryPoints
      ? entryPoints.map((inputFile: string) =>
          path.join(__dirname, './stubs/src/' + inputFile),
        )
      : ['./test/stubs/src'];
    load(this.app);
    this.app.options.addReader(new TypeDocReader());
    this.app.options.addReader(new TSConfigReader());
  }

  bootstrap(options: any = {}) {
    this.app.bootstrap({
      logger: 'none',
      entryPoints: this.entryPoints,
      tsconfig: path.join(__dirname, 'stubs', 'tsconfig.json'),
      ...options,
    });

    this.project = this.app.convert();

    if (this.project) {
      settings.project = this.project;
      settings.options = this.app.options.getRawValues() as PluginOptions;

      this.tmpobj = tmp.dirSync();

      const output = new RendererEvent(
        RendererEvent.BEGIN,
        this.tmpobj.name,
        this.project,
      );

      output.urls = getUrls(this.project);
    }
  }

  cleanup() {
    delete this.app;
    delete this.project;
  }

  findModule(name: string) {
    return this.project.children.find(
      (child) => child.name.replace(/\"/g, '') === name,
    );
  }

  findEntryPoint() {
    return this.project;
  }

  findReflection(name: string) {
    return this.project.findReflectionByName(name) as DeclarationReflection;
  }
}
