import { Reflection } from 'typedoc';
import { PageEvent } from 'typedoc/dist/lib/output/events';
import settings from '../../src/renderer/settings';
import { breadcrumbsTemplate } from '../../src/renderer/templates/breadcrumbs';
import { TestApp } from '../test-app';

describe(`Breadcrumbs:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

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
      settings.activeUrl = 'README.md';
      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: testApp.project,
          url: 'README.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile entryPoint (globals) breadcrumbs'`, () => {
      settings.activeUrl = 'modules.md';
      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: testApp.project,
          url: 'modules.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      settings.activeUrl = 'classes/Breadcrumbs.md';
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
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should compile module breadcrumbs'`, () => {
      settings.activeUrl = 'README.md';
      expect(
        breadcrumbsTemplate({
          project: testApp.project,
          model: moduleReflection,
          url: 'README.md',
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile class breadcrumbs'`, () => {
      settings.activeUrl = 'classes/Breadcrumbs.md';
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
