import { declarationTemplate } from '../../src/templates/declaration';
import * as sourcesTemplate from '../../src/templates/sources';
import { formatContents } from '../../src/tools/utils';
import { TestApp } from '../test-app';

describe(`Declarations:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    jest.spyOn(sourcesTemplate, 'sourcesTemplate').mockReturnValue('[SOURCES]');
    testApp = new TestApp(['declarations.ts']);
    testApp.bootstrap();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    testApp.cleanup();
  });

  test(`should compile a const with default value`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('stringConstWithDefaultValue'),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile a let with default value`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('stringLetWithDefaultValue'),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile an undefined declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('undefinedNumberDeclaration'),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('objectLiteralDeclaration')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile object literal cast as a const`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('objectLiteralAsConstDeclaration'),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile type literal declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('typeLiteralDeclaration')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile declaration with double underscores in name and value`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('__DOUBLE_UNDERSCORES_DECLARATION__'),
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile any function type`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('AnyFunctionType')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('functionDeclaration')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile callable declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('callableDeclaration')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile indexable declaration`, () => {
    expect(
      formatContents(
        declarationTemplate(testApp.findReflection('indexableDeclaration')),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile enum delcaration`, () => {
    expect(
      formatContents(
        declarationTemplate(
          testApp.findReflection('EnumDeclarations').children[0],
        ),
      ),
    ).toMatchSnapshot();
  });
});
