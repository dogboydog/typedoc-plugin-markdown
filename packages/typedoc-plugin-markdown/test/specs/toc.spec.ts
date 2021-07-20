import { Reflection } from 'typedoc';
import settings from '../../src/renderer/settings';
import { tocTemplate } from '../../src/renderer/templates/toc';
import { TestApp } from '../test-app';

describe(`TOC:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  describe(`(default)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
      settings.activeUrl = 'classes/Breadcrumbs.md';
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should display toc for module'`, () => {
      expect(tocTemplate(moduleReflection as any)).toMatchSnapshot();
    });

    test(`should display toc for class'`, () => {
      expect(tocTemplate(classReflection as any)).toMatchSnapshot();
    });
  });
  describe(`(hideInPageToc)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap({ hideInPageTOC: true });
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
      settings.activeUrl = 'classes/Breadcrumbs.md';
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should not display toc for class'`, () => {
      expect(tocTemplate(classReflection as any)).toEqual('');
    });
  });
});
