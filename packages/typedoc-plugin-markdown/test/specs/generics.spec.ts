import { PageEvent } from 'typedoc/dist/lib/output/events';
import * as context from '../../src/context';
import * as breadcrumbsTemplate from '../../src/templates/breadcrumbs';
import * as commentsTemplate from '../../src/templates/comments';
import { declarationTemplate } from '../../src/templates/declaration';
import * as groupsTemplate from '../../src/templates/groups';
import * as linkTemplate from '../../src/templates/link';
import { pageTemplate } from '../../src/templates/page';
import { signatureTemplate } from '../../src/templates/signature';
import * as sourcesTemplate from '../../src/templates/sources';
import * as tocTemplate from '../../src/templates/toc';
import { formatContents } from '../../src/tools/utils';
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
    jest.spyOn(linkTemplate, 'linkTemplate').mockReturnValue('[LINK]');
    jest.spyOn(sourcesTemplate, 'sourcesTemplate').mockReturnValue('[SOURCES]');

    jest
      .spyOn(context, 'getContext')
      .mockReturnValue({ activeUrl: 'modules/generics.md' } as any);

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
          url: 'ClassWithTypeParams.md',
          model: testApp.findReflection('ClassWithTypeParams'),
          project: testApp.project,
        } as PageEvent),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with a simple type param'`, () => {
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
