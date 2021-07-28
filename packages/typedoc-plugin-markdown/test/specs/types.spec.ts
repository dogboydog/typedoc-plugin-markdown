import * as context from '../../src/context';
import { typeTemplate } from '../../src/templates/type';
import { TestApp } from '../test-app';

describe(`Types:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['types.ts']);
    testApp.bootstrap();
    jest
      .spyOn(context, 'getContext')
      .mockReturnValue({ activeUrl: 'modules/types.md' } as any);
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should compile 'array' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('arrayType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'stringLiteral' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('stringLiteralType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of string literals types'`, () => {
    expect(
      typeTemplate(testApp.findReflection('unionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'union' of literal declarations`, () => {
    expect(
      typeTemplate(
        testApp.findReflection('unionTypeWithSymbolsDeclarations').type,
      ),
    ).toMatchSnapshot();
  });

  test(`should compile intrinsic type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('stringType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'literal' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('literalType').type, 'all'),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'literal' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('literalType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'objectLiteralType' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('objectLiteralType'), 'object'),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'objectLiteralType' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('objectLiteralType')),
    ).toMatchSnapshot();
  });

  test(`should compile 'tuple' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('tupleType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'intersection' type'`, () => {
    expect(
      typeTemplate(testApp.findReflection('intersectionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile collapsed 'function' type '`, () => {
    expect(
      typeTemplate(
        testApp.findReflection('functionReflectionType').type,
        'function',
      ),
    ).toMatchSnapshot();
  });

  test(`should compile expanded 'function' type '`, () => {
    expect(
      typeTemplate(testApp.findReflection('functionReflectionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile 'typeOperator' type '`, () => {
    expect(
      typeTemplate(testApp.findReflection('typeOperatorType').type),
    ).toMatchSnapshot();
  });

  test(`should compile unionType with object literal type '`, () => {
    expect(
      typeTemplate(testApp.findReflection('objectLiteralUnionType').type),
    ).toMatchSnapshot();
  });

  test(`should compile conditional type '`, () => {
    expect(
      typeTemplate(testApp.findReflection('ConditionalType').type),
    ).toMatchSnapshot();
  });
});
