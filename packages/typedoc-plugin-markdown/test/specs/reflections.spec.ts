import { PageEvent } from 'typedoc/dist/lib/output/events';
import * as breadcrumbsTemplate from '../../src/templates/breadcrumbs';
import * as groupsTemplate from '../../src/templates/groups';
import * as linkTemplate from '../../src/templates/link';
import { pageTemplate } from '../../src/templates/page';
import * as signatureTemplate from '../../src/templates/signature';
import * as tocTemplate from '../../src/templates/toc';
import { TestApp } from '../test-app';

describe(`Reflections:`, () => {
  beforeAll(() => {
    jest
      .spyOn(breadcrumbsTemplate, 'breadcrumbsTemplate')
      .mockReturnValue('[BREADCRUMBS]');
    jest
      .spyOn(signatureTemplate, 'signatureTemplate')
      .mockReturnValue('[SIGNATURE]');
    jest.spyOn(tocTemplate, 'tocTemplate').mockReturnValue('[TOC]');
    jest.spyOn(linkTemplate, 'linkTemplate').mockReturnValue('[LINK]');
    jest.spyOn(groupsTemplate, 'groupsTemplate').mockReturnValue('[GROUPS]');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe(`(header)`, () => {
    let testApp: TestApp;

    beforeAll(() => {
      testApp = new TestApp(['reflections.ts']);
      testApp.bootstrap({
        hideBreadcrumbs: false,
        hidePageTitle: true,
      });
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should compile template with breadcrumbs and without title`, () => {
      expect(
        pageTemplate({
          model: testApp.project.children[0],
          project: testApp.project,
        } as PageEvent),
      ).toMatchSnapshot();
    });
  });

  describe(`(template)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['reflections.ts']);
      testApp.bootstrap({
        hideBreadcrumbs: true,
        hidePageTitle: false,
      });
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should compile module without breadcrumbs and with project title`, () => {
      expect(
        pageTemplate({
          model: testApp.project.children[0],
          project: testApp.project,
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile a callable reflection`, () => {
      expect(
        pageTemplate({
          model: testApp.findReflection('CallableReflection'),
          project: testApp.project,
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile an indexable reflection`, () => {
      expect(
        pageTemplate({
          model: testApp.findReflection('IndexableReflection'),
          project: testApp.project,
        } as PageEvent),
      ).toMatchSnapshot();
    });

    test(`should compile implemented class`, () => {
      expect(
        pageTemplate({
          model: testApp.findReflection('ImplementedClass'),
          project: testApp.project,
        } as PageEvent),
      ).toMatchSnapshot();
    });
  });
});
