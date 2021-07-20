import settings from '../../src/renderer/settings';
import { hierarchyTemplate } from '../../src/renderer/templates/hierachy';
import { formatContents } from '../../src/renderer/tools/utils';
import { TestApp } from '../test-app';

describe(`Hierarchy:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['hierarchy.ts']);
    testApp.bootstrap();
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should compile type hierarchy`, () => {
    settings.activeUrl = 'classes/hierarchy.ParentClass.md';
    const reflection = testApp.findReflection('ParentClass');
    expect(
      formatContents(hierarchyTemplate(reflection.typeHierarchy)),
    ).toMatchSnapshot();
  });

  test(`should compile nested type hierarchy`, () => {
    settings.activeUrl = 'classes/hierarchy.ParentClass.md';
    const reflection = testApp.findReflection('ChildClassA');
    expect(
      formatContents(hierarchyTemplate(reflection.typeHierarchy)),
    ).toMatchSnapshot();
  });
});
