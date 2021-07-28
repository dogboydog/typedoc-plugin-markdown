import * as context from '../../src/context';
import { hierarchyTemplate } from '../../src/templates/hierachy';
import { formatContents } from '../../src/tools/utils';
import { TestApp } from '../test-app';

describe(`Hierarchy:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['hierarchy.ts']);
    testApp.bootstrap();
    jest.spyOn(context, 'getContext').mockReturnValue({
      activeUrl: 'classes/hierarchy.ParentClass.md',
    } as any);
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should compile type hierarchy`, () => {
    const reflection = testApp.findReflection('ParentClass');
    expect(
      formatContents(hierarchyTemplate(reflection.typeHierarchy)),
    ).toMatchSnapshot();
  });

  test(`should compile nested type hierarchy`, () => {
    const reflection = testApp.findReflection('ChildClassA');
    expect(
      formatContents(hierarchyTemplate(reflection.typeHierarchy)),
    ).toMatchSnapshot();
  });
});
