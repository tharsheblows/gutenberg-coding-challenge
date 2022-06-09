/**
 * External dependencies
 */
import sanitize from 'sanitize-html';

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';

/**
 * Gets the string to use for the correct country flag.
 *
 * @param {string} countryCode The two character country code.
 * @return {string} The string which corresponds to the correct flag.
 */
export function getEmojiFlag( countryCode ) {
	return String.fromCodePoint(
		...countryCode
			.toUpperCase()
			.split( '' )
			.map( ( char ) => 127397 + char.charCodeAt() )
	);
}

/**
 * Adds markup around a word or string in content so that it may be styled.
 *
 * @param {string} content     The content to be searched for the word to be styled.
 * @param {string} countryCode The country code chosen.
 * @param {string} context     What context is this content? Eg 'excerpt' or 'title'.
 * @return {string} The sanitized content with the markup to style it.
 */
export function sanitizeAndStyle( content, countryCode, context ) {
	if ( ! content ) return;

	const wordsToBold = getWordsToBold( countryCode, context );
	if ( ! wordsToBold || wordsToBold.length < 1 ) {
		return sanitizeInContext( content, context );
	}

	const markedContent = wordsToBold.reduce( ( newContent, wordToBold ) => {
		const boldMarkup = `<span class="xwp-country-card__searched-word">${ wordToBold }</span>`;
		return newContent.split( wordToBold ).join( boldMarkup );
	}, content );

	return sanitizeInContext( markedContent, context );
}

/**
 *
 * Sanitize the content passed; can be contextual.
 * This currently has the context as a parameter to allow for more flexible sanitization. If needed this only has to change here.
 *
 * @param {string} content The content to be sanitized.
 * @param {string} context The context for the content, eg 'excerpt' or 'title'.
 * @return {string} The santized content.
 */
// eslint-disable-next-line no-unused-vars
export function sanitizeInContext( content, context ) {
	return sanitize( content, allowSpans );
}

/*
 * The label is not escaped in this object as the data comes from a file in this project.
 * If the data changes to come from outside this project, it must be escaped.
 * For translation of the label, the countries.json needs to be edited.
 */
export const options = Object.keys( countries ).map( ( code ) => ( {
	value: code,
	label: sprintf(
		'%1$s %2$s - %3$s',
		getEmojiFlag( code ),
		countries[ code ],
		code
	),
} ) );

/**
 *
 * Get a list of the words which should be formatted.
 *
 * @param {string} countryCode
 * @return {Array} An array of the words which should be in bold.
 */
const getWordsToBold = ( countryCode ) => {
	return [ countries[ countryCode ], 'ipsum' ];
};

/**
 * Used in sanitize() to allow only span tags with a class.
 */
const allowSpans = {
	allowedTags: [ 'span' ],
	allowedAttributes: {
		span: [ 'class' ],
	},
};
