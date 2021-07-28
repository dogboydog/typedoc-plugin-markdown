import { signatureTemplate } from '../../src/templates/signature';
import * as sourcesTemplate from '../../src/templates/sources';
import { formatContents } from '../../src/tools/utils';
import { TestApp } from '../test-app';

describe(`Signatures:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['signatures.ts']);
    testApp.bootstrap();
    jest.spyOn(sourcesTemplate, 'sourcesTemplate').mockReturnValue('[SOURCES]');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    testApp.cleanup();
  });

  test(`should compile callable signature'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('CallableSignature').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with a flag'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('privateFunction').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with params'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithParameters').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns an object'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionReturningAnObject').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function that returns a function'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionReturningAFunction').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with rest params'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithRest').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with optional params'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithOptionalParam').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with union types'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithUnionTypes').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with default values'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithDefaults').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile signature with @return comments'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('commentsInReturn').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithNamedParams').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile named parameters with comments'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithNamedParamsAndComments')
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile pipes in params and comments'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithPipesInParamsAndComments')
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with reference type'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithReferenceType').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile function with nested typen params'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('functionWithNestedParams').signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });

  test(`should compile class with constructor'`, () => {
    expect(
      formatContents(
        signatureTemplate(
          testApp.findReflection('ClassWithConstructor').children[0]
            .signatures[0],
        ),
      ),
    ).toMatchSnapshot();
  });
});
