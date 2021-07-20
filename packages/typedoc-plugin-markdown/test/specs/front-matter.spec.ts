import { prependYAML } from '../../src/renderer/tools/front-matter';
import { TestApp } from '../test-app';

describe(`FrontMatter:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['frontmatter.ts']);
    testApp.bootstrap();
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should prependYAML to doc content`, () => {
    expect(
      prependYAML('# Doc title\n\nDoc content', {
        stringProp: '"Escaped" title',
        booleanProp: true,
        numberProp: 2,
      }),
    ).toMatchSnapshot();
  });
});
