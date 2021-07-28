import { Reflection } from 'typedoc';
import * as context from '../../src/context';
import { tocTemplate } from '../../src/templates/toc';
import { TestApp } from '../test-app';

describe(`TOC:`, () => {
  let moduleReflection: Reflection;
  let classReflection: Reflection;

  describe(`(default)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap();
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
      jest
        .spyOn(context, 'getContext')
        .mockReturnValue({ activeUrl: 'classes/Breadcrumbs.md' } as any);
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should display toc for module'`, () => {
      expect(tocTemplate(moduleReflection as any)).toMatchSnapshot();
    });

    test(`should display toc for class'`, () => {
      expect(tocTemplate(classReflection as any)).toMatchSnapshot();
    });
  });
  describe(`(hideInPageToc)`, () => {
    let testApp: TestApp;
    beforeAll(() => {
      testApp = new TestApp(['breadcrumbs.ts']);
      testApp.bootstrap({ hideInPageTOC: true });
      moduleReflection = testApp.project.children[0];
      classReflection = testApp.project.findReflectionByName('Breadcrumbs');
      jest
        .spyOn(context, 'getContext')
        .mockReturnValue({
          hideInPageTOC: true,
          activeUrl: 'classes/Breadcrumbs.md',
        } as any);
    });

    afterAll(() => {
      testApp.cleanup();
    });

    test(`should not display toc for class'`, () => {
      expect(tocTemplate(classReflection as any)).toEqual('');
    });
  });
});
