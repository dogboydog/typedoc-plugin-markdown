import { PageEvent } from 'typedoc/dist/lib/output/events';
import settings from '../../src/renderer/settings';
import * as breadcrumbsTemplate from '../../src/renderer/templates/breadcrumbs';
import * as commentsTemplate from '../../src/renderer/templates/comments';
import { declarationTemplate } from '../../src/renderer/templates/declaration';
import * as groupsTemplate from '../../src/renderer/templates/groups';
import { pageTemplate } from '../../src/renderer/templates/page';
import { signatureTemplate } from '../../src/renderer/templates/signature';
import * as sourcesTemplate from '../../src/renderer/templates/sources';
import * as tocTemplate from '../../src/renderer/templates/toc';
import { formatContents } from '../../src/renderer/tools/utils';
import { TestApp } from '../test-app';

describe(`Generics:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    jest.spyOn(groupsTemplate, 'groupsTemplate').mockReturnValue('[GROUPS]');
    jest
      .spyOn(breadcrumbsTemplate, 'breadcrumbsTemplate')
      .mockReturnValue('[BREADCRUMBS]');
    jest
      .spyOn(commentsTemplate, 'commentsTemplate')
      .mockReturnValue('[COMMENT]');
    jest.spyOn(tocTemplate, 'tocTemplate').mockReturnValue('[TOC]');

    jest.spyOn(sourcesTemplate, 'sourcesTemplate').mockReturnValue('[SOURCES]');
    settings.activeUrl = 'modules/generics.md';

    testApp = new TestApp(['generics.ts']);
    testApp.bootstrap();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    testApp.cleanup();
  });

  test(`should compile class with type params`, () => {
    expect(
      formatContents(
        pageTemplate({
          model: testApp.findReflection('ClassWithTypeParams'),
          project: testApp.project,
        } as PageEvent),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with a simple type param'`, () => {
    settings.activeUrl = 'modules/generics.md';
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithTypeParam').signatures[0] as any,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with complex type params'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithTypeParams').signatures[0] as any,
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type with nested generics'`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('nestedGenerics')),
      ),
    ).toMatchSnapshot();
  });
});
