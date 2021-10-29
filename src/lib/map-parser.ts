import type { MapWord, ParsedMap, WordFlags } from './types';
import { parseTimmyTimestamp } from './types';
import JSON5 from 'json5';

let isRapper = false;

export function parseMap(map: string): ParsedMap {
	return {
		words: map
			.replace(/\r/g, '')
			// remove lines that start with #
			.split('\n')
			.filter((line) => !line.trim().startsWith('#'))
			.join('\n')
			.trim()
			.split(/\s*\n\n\s*/)
			.map(parseSection)
			.flat()
	};
}

function parseSection(section: string): MapWord[] {
	const words = section.split('\n').map(parseWord);
	words[0].isSectionStart = true;
	return words;
}

function parseWord(word: string): MapWord {
	try {
		let [text, ...rest] = word.split(':');
		let [, startTimeText, rest2] = rest
			.join(':')
			.trim()
			.match(/^([ \t,\[\]0-9\.]+)(\s+{.*})?\s*$/);
		const startTime = parseTimmyTimestamp(
			JSON5.parse(startTimeText.replace(/\b0+([0-9]+)/g, '$1'))
		);
		const flags = rest2 ? parseFlags(rest2) : {};
		const missingLetters = [];
		const isWordJoiner = text.startsWith('-');
		console.log(text, isWordJoiner);
		if (isWordJoiner) {
			text = text.slice(1);
		}
		let actualIndex = 0;
		let isMissing = false;
		for (let i = 0; i < text.length; i++) {
			if (text[i] === '[' || text[i] === ']') {
				isMissing = !isMissing;
				continue;
			} else if (isMissing) {
				missingLetters.push(actualIndex);
			}
			actualIndex++;
		}
		if (flags.replacingQTCinderellaTheRapperLudwigHiredOnFiverOneYearAgoStartsRappingHere) {
			isRapper = true;
		} else if (flags.replacingTheRapperLudwigHiredOnFiverOneYearAgoQTCinderellaResumesSingingHere) {
			isRapper = false;
		}
		return {
			text: text.replace(/\[|\]/g, ''),
			missingLetters,
			start: startTime,
			isSectionStart: false,
			isWordJoiner,
			flags,
			isRapperStyle: isRapper
		};
	} catch (error) {
		console.log('failed to parse the following:' + word);
	}
}

function parseFlags(flags: string) {
	const result: WordFlags = {};

	const flagContents = flags.trim().slice(1, -1);

	let state = 'key';
	let flagName = '';
	let flagValue = '';
	let stack = 0;

	for (const char of flagContents) {
		if (state === 'key') {
			if (char === ':') {
				state = 'value';
			} else if (char === ',') {
				result[flagName] = true;
				flagName = '';
				flagValue = '';
				state = 'key';
			} else {
				flagName += char;
			}
		} else if (state === 'value') {
			if (char === '{' || char === '[' || char === '(') {
				stack++;
			} else if (char === '}' || char === ']' || char === ')') {
				stack--;
			}

			if (stack === 0 && char === ',') {
				result[flagName.trim()] = JSON5.parse(flagValue.trim().replace(/\b0+([0-9]+)/g, '$1'));
				flagName = '';
				flagValue = '';
				state = 'key';
			} else {
				flagValue += char;
			}
		}
	}

	if (flagName) {
		result[flagName.trim()] = flagValue
			? JSON5.parse(flagValue.trim().replace(/\b0+([0-9]+)/g, '$1'))
			: true;
	}

	return result;
}
