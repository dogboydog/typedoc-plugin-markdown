import { DeclarationReflection } from 'typedoc';
import * as context from '../../src/context';
import { sourcesTemplate } from '../../src/templates/sources';
import { formatContents } from '../../src/tools/utils';
import { TestApp } from '../test-app';

const getProp = (reflection: DeclarationReflection) => {
  const prop = reflection.findReflectionByName('prop');
  prop.sources = prop.sources.map((source) => {
    delete source.url;
    return source;
  });
  return prop as any;
};

describe(`Sources:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['sources.ts']);
    testApp.bootstrap();
    jest
      .spyOn(context, 'getContext')
      .mockReturnValue({ activeUrl: 'class/SomeClass.md' } as any);
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should display implementation of sources'`, () => {
    expect(
      formatContents(
        sourcesTemplate(getProp(testApp.findReflection('SomeClass'))),
      ),
    ).toMatchSnapshot();
  });

  test(`should display inherited sources'`, () => {
    expect(
      formatContents(
        sourcesTemplate(getProp(testApp.findReflection('AnotherInterface'))),
      ),
    ).toMatchSnapshot();
  });

  test(`should display overide sources'`, () => {
    expect(
      formatContents(
        sourcesTemplate(getProp(testApp.findReflection('AnotherClass'))),
      ),
    ).toMatchSnapshot();
  });
});
