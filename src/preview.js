/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import continentNames from '../assets/continent-names.json';
import continents from '../assets/continents.json';
import { getEmojiFlag, sanitizeInContext } from './utils';

export default function Preview( { countryCode, relatedPosts } ) {
	if ( ! countryCode ) return null;

	const emojiFlag = getEmojiFlag( countryCode ),
		hasRelatedPosts = relatedPosts?.length > 0;

	return (
		<div className="xwp-country-card">
			<div
				className="xwp-country-card__media"
				data-emoji-flag={ emojiFlag }
			>
				<div className="xwp-country-card-flag">{ emojiFlag }</div>
			</div>
			<h3 className="xwp-country-card__heading">
				{ __( 'Hello from' ) }{ ' ' }
				<strong>{ countries[ countryCode ] }</strong> (
				<span className="xwp-country-card__country-code">
					{ countryCode }
				</span>
				), { continentNames[ continents[ countryCode ] ] }!
			</h3>
			<div className="xwp-country-card__related-posts">
				<h3 className="xwp-country-card__related-posts__heading">
					{ hasRelatedPosts
						? sprintf(
								/* translators: %d will be replaced by the number of related posts */
								_n(
									'There is %d related post',
									'There are %d related posts:',
									relatedPosts.length,
									'xwp-country-card'
								),
								relatedPosts.length
						  )
						: __( 'There are no related posts.' ) }
				</h3>
				{ hasRelatedPosts && (
					<ul className="xwp-country-card__related-posts__list">
						{ relatedPosts.map( ( relatedPost, index ) => (
							<li
								key={ index }
								className="xwp-country-card__related-post"
							>
								<a
									className="xwp-country-card__related-post__link"
									href={ relatedPost.link }
									data-post-id={ relatedPost.id }
								>
									{ /* eslint-disable-next-line jsx-a11y/heading-has-content */ }
									<h4
										className="xwp-country-card__related-post__heading"
										dangerouslySetInnerHTML={ {
											__html: sanitizeInContext(
												relatedPost.title,
												'title'
											),
										} }
									></h4>
									<div
										className="xwp-country-card__related-post__excerpt"
										dangerouslySetInnerHTML={ {
											__html: sanitizeInContext(
												relatedPost.excerpt,
												'excerpt'
											),
										} }
									></div>
								</a>
							</li>
						) ) }
					</ul>
				) }
			</div>
		</div>
	);
}
