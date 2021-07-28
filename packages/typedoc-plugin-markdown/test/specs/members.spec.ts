import { DeclarationReflection } from 'typedoc';
import * as linkTemplate from '../../src/templates/link';
import * as memberTemplate from '../../src/templates/member';
import { reflectionTemplate } from '../../src/templates/reflection';
import * as sourcesTemplate from '../../src/templates/sources';
import * as tocTemplate from '../../src/templates/toc';
import { formatContents } from '../../src/tools/utils';
import { TestApp } from '../test-app';

describe(`Members:`, () => {
  let testApp: TestApp;

  beforeAll(() => {
    testApp = new TestApp(['members.ts']);
    testApp.bootstrap();
    jest.spyOn(tocTemplate, 'tocTemplate').mockReturnValue('[TOC]');
    jest.spyOn(linkTemplate, 'linkTemplate').mockReturnValue('[LINK]');
    jest.spyOn(sourcesTemplate, 'sourcesTemplate').mockReturnValue('[SOURCES]');
  });

  afterAll(() => {
    jest.restoreAllMocks();
    testApp.cleanup();
  });

  describe(`(members)`, () => {
    let memberSpy: jest.SpyInstance;
    beforeAll(() => {
      memberSpy = jest
        .spyOn(memberTemplate, 'memberTemplate')
        .mockReturnValue('[MEMBER]');
    });
    afterAll(() => {
      memberSpy.mockRestore();
    });
    test(`should compile class members'`, () => {
      expect(
        formatContents(
          reflectionTemplate(
            testApp.findReflection('ClassWithAccessorMembers'),
          ),
        ),
      ).toMatchSnapshot();
    });
  });

  describe(`(member)`, () => {
    test(`should compile declaration members'`, () => {
      expect(
        formatContents(
          memberTemplate.memberTemplate(
            testApp.findReflection('declarationMember'),
          ),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile a signature members'`, () => {
      expect(
        formatContents(
          memberTemplate.memberTemplate(
            testApp.findReflection('signatureMember'),
          ),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile members with getter'`, () => {
      expect(
        formatContents(
          memberTemplate.memberTemplate(
            testApp
              .findReflection('ClassWithAccessorMembers')
              .findReflectionByName('getter') as DeclarationReflection,
          ),
        ),
      ).toMatchSnapshot();
    });

    test(`should compile members with setter'`, () => {
      expect(
        formatContents(
          memberTemplate.memberTemplate(
            testApp
              .findReflection('ClassWithAccessorMembers')
              .findReflectionByName('setter') as DeclarationReflection,
          ),
        ),
      ).toMatchSnapshot();
    });
  });
});
