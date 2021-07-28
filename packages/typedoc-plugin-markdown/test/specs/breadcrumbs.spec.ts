import { Reflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import * as context from '../../src/context';
import { breadcrumbsTemplate } from '../../src/templates/breadcrumbs';
import { TestApp } from '../test-app';

describe(`Breadcrumbs:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;
  const baseContext = {
    entryDocument: 'README.md',
    globalsName: 'Exports',
    globalsFile: 'modules.md',
  };

  describe(`(with readme)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
    });

    afterAll(() => {
      jest.restoreAllMocks();
      testApp.cleanup();
    });

    test(`should compile README breadcrumbs'`, () => {
      jest.spyOn(context, 'getContext').mockReturnValue({
        ...baseContext,
        activeUrl: 'README.md',
        readme: 'readme',
      } as any);
      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: testApp.project,
          url: 'README.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile entryPoint (globals) breadcrumbs'`, () => {
      jest
        .spyOn(context, 'getContext')
        .mockReturnValue({
          ...baseContext,
          activeUrl: 'modules.md',
          readme: 'readme',
        } as any);

      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: testApp.project,
          url: 'modules.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      jest.spyOn(context, 'getContext').mockReturnValue({
        ...baseContext,
        activeUrl: 'classes/Breadcrumbs.md',
        readme: 'readme',
      } as any);

      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: classReflection,
          url: 'classes/Breadcrumbs.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });
  });

  describe(`(without readme)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap({ readme: 'none' });
      moduleReflection = testApp.project;
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
      jest.spyOn(context, 'getContext').mockReturnValue({
        ...baseContext,
        activeUrl: 'README.md',
        readme: 'none',
      } as any);
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should compile module breadcrumbs'`, () => {
      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: moduleReflection,
          url: 'README.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      jest.spyOn(context, 'getContext').mockReturnValue({
        ...baseContext,
        activeUrl: 'classes/Breadcrumbs.md',
        readme: 'none',
      } as any);

      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: classReflection,
          url: 'classes/Breadcrumbs.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });
  });
});
