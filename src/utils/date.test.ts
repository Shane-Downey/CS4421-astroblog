import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const postsDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../pages/posts');

describe('publication dates', () => {
	it('uses valid YYYY-MM-DD dates in every Markdown blog post', () => {
		const postFiles = readdirSync(postsDirectory).filter((file) => file.endsWith('.md')).sort();

		for (const postFile of postFiles) {
			const post = readFileSync(resolve(postsDirectory, postFile), 'utf8');
			const publicationDate = post.match(/^pubDate:\s*(\d{4}-\d{2}-\d{2})$/m)?.[1];
			const dateParts = publicationDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);

			expect(publicationDate, `${postFile} should define a pubDate`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(dateParts, `${postFile} should contain a valid date`).not.toBeNull();

			if (dateParts) {
				const [, year, month, day] = dateParts;
				const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

				expect(date.getUTCFullYear()).toBe(Number(year));
				expect(date.getUTCMonth()).toBe(Number(month) - 1);
				expect(date.getUTCDate()).toBe(Number(day));
			}
		}
	});
});
