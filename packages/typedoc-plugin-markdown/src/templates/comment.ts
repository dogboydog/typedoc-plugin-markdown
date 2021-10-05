import { URL_PREFIX } from '../constants';
import { useSettings } from '../context';
import { linkTemplate } from './link';

const BRACKETS = /\[\[([^\]]+)\]\]/g;
const INLINE_TAG =
  /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;

export function commentTemplate(comment: string) {
  const { project } = useSettings();

  function replaceBrackets(text: string) {
    return text.replace(BRACKETS, (match: string, content: string): string => {
      const split = splitLinkText(content);
      return buildLink(match, split.target, split.caption);
    });
  }

  function replaceInlineTags(text: string): string {
    return text.replace(
      INLINE_TAG,
      (match: string, leading: string, tagName: string, content: string) => {
        const split = splitLinkText(content);
        const target = split.target;
        const caption = leading || split.caption;
        return buildLink(match, target, caption, tagName === 'linkcode');
      },
    );
  }

  function buildLink(
    original: string,
    target: string,
    caption: string,
    monospace = false,
  ) {
    if (monospace) {
      caption = '`' + caption + '`';
    }

    if (URL_PREFIX.test(target)) {
      return linkTemplate(caption, target);
    }

    const reflection = project?.findReflectionByName(target);

    if (reflection && reflection.url) {
      return linkTemplate(caption, reflection.url);
    } else {
      return original;
    }
  }

  function splitLinkText(text: string) {
    let splitIndex = text.indexOf('|');
    if (splitIndex === -1) {
      splitIndex = text.search(/\s/);
    }
    if (splitIndex !== -1) {
      return {
        caption: text
          .substr(splitIndex + 1)
          .replace(/\n+/, ' ')
          .trim(),
        target: text.substr(0, splitIndex).trim(),
      };
    } else {
      return {
        caption: text,
        target: text,
      };
    }
  }

  return replaceInlineTags(replaceBrackets(comment));
}
