import { PageEvent } from 'typedoc/dist/lib/output/events';
import * as breadcrumbsTemplate from '../../src/renderer/templates/breadcrumbs';
import { readmeTemplate } from '../../src/renderer/templates/readme';
import { TestApp } from '../test-app';

describe(`Index:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['reflections.ts']);
    testApp.bootstrap();
    jest
      .spyOn(breadcrumbsTemplate, 'breadcrumbsTemplate')
      .mockReturnValue('[BREADCRUMBS]');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    testApp.cleanup();
  });

  test(`should compile readme`, () => {
    expect(
      readmeTemplate({
        model: testApp.project,
        project: testApp.project,
      } as PageEvent),
    ).toMatchSnapshot();
  });
});
