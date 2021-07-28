import { Comment } from 'typedoc/dist/lib/models';
import { getContext } from '../context';
import { MarkdownBuilder } from '../tools/builder';
import { backTicks, bold, link } from '../tools/elements';
import { linkTemplate } from './link';

const URL_PREFIX = /^(http|ftp)s?:\/\//;
const BRACKETS = /\[\[([^\]]+)\]\]/g;
const INLINE_TAG =
  /(?:\[(.+?)\])?\{@(link|linkcode|linkplain)\s+((?:.|\n)+?)\}/gi;

export function commentsTemplate(model: Comment) {
  const md = new MarkdownBuilder();

  if (model.hasVisibleComponent()) {
    if (model.shortText) {
      md.add(comment(model.shortText));
    }
    if (model.text) {
      md.add(comment(model.text));
    }
    if (model.tags) {
      const tags = model.tags.map(
        (tag) =>
          bold(backTicks(tag.tagName)) +
          (tag.text
            ? comment((tag.text.startsWith('\n') ? '' : ' ') + tag.text)
            : ''),
      );
      md.add(tags.join('\n\n'));
    }
  }
  return md.print();
}

export function comment(text: string) {
  return replaceInlineTags(replaceBrackets(text));
}

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
    caption = backTicks(caption);
  }

  if (URL_PREFIX.test(target)) {
    return link(caption, target);
  }

  const { project } = getContext();

  const reflection = project.findReflectionByName(target);
  if (reflection && reflection.url) {
    return linkTemplate(caption, reflection.url, !monospace);
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
