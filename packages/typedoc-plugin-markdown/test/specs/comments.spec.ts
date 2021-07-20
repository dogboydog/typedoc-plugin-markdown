import settings from '../../src/renderer/settings';
import { commentsTemplate } from '../../src/renderer/templates/comments';
import { TestApp } from '../test-app';

describe(`Comments:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['comments.ts']);
    testApp.bootstrap();
    settings.activeUrl = 'modules.md';
  });

  afterAll(() => {
    testApp.cleanup();
  });

  test(`should build @link references'`, () => {
    expect(
      commentsTemplate(testApp.findReflection('commentWithDocLinks').comment),
    ).toMatchSnapshot();
  });

  test(`should convert symbols brackets to symbol links'`, () => {
    expect(
      commentsTemplate(
        testApp.findReflection('commentsWithSymbolLinks').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with fenced block'`, () => {
    expect(
      commentsTemplate(
        testApp.findReflection('commentsWithFencedBlock').comment,
      ),
    ).toMatchSnapshot();
  });

  test(`should convert comments with tags'`, () => {
    expect(
      commentsTemplate(testApp.findReflection('commentsWithTags').comment),
    ).toMatchSnapshot();
  });

  test(`should allow html in comments'`, () => {
    expect(
      commentsTemplate(testApp.findReflection('commentsWithHTML').comment),
    ).toMatchSnapshot();
  });
});
