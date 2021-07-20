import { DeclarationReflection } from 'typedoc';
import settings from '../../src/renderer/settings';
import { sourcesTemplate } from '../../src/renderer/templates/sources';
import { formatContents } from '../../src/renderer/tools/utils';
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
    settings.activeUrl = 'class/SomeClass.md';
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
