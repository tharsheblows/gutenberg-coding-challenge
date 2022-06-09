/**
 * WordPress dependencies
 */
import { edit, globe } from '@wordpress/icons';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	ComboboxControl,
	Placeholder,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { select } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import countries from '../assets/countries.json';
import Preview from './preview';
import { options, sanitizeAndStyle } from './utils';
import './editor.scss';

export default function Edit( { attributes, setAttributes, isSelected } ) {
	const { countryCode, relatedPosts } = attributes;
	const [ isPreview, setPreview ] = useState();

	/**
	 * Two things will automatically show the preview:
	 * 1 - changing the country code
	 * 2 - navigating away from the block when the country code is already set
	 */
	useEffect( () => {
		if ( ! isSelected && countryCode ) {
			setPreview( true );
		} else {
			setPreview( countryCode );
		}
	}, [ countryCode, isSelected ] );

	// Allow the edit button in the toolbar to toggle the preview.
	const handleChangeCountry = () => {
		if ( isPreview ) {
			setPreview( false );
		} else if ( countryCode ) {
			setPreview( true );
		}
	};

	// Set the new attribute for the country code and clear the related posts array when the country is changed.
	const handleChangeCountryCode = ( newCountryCode ) => {
		if ( newCountryCode && countryCode !== newCountryCode ) {
			setAttributes( {
				countryCode: newCountryCode,
				relatedPosts: [],
			} );
		}
	};

	/**
	 * Get the related posts, excluding the post to which this block belongs.
	 * The related posts will only update on the front end when the post is saved with a new country code,
	 * it does not dynamically search for related posts on the front end.
	 */
	useEffect( () => {
		async function getRelatedPosts() {
			const postId = select( 'core/editor' ).getCurrentPostId();

			// The search term comes from a file in this project. If that changes it needs to be escaped properly.
			const searchUrl = addQueryArgs( '/wp-json/wp/v2/posts', {
				search: countries[ countryCode ],
				exclude: postId,
			} );

			try {
				const response = await window.fetch( searchUrl );

				if ( ! response.ok ) {
					throw new Error(
						`HTTP error! Status: ${ response.status }`
					);
				}

				const posts = await response.json();

				setAttributes( {
					relatedPosts:
						posts?.map( ( relatedPost ) => ( {
							...relatedPost,
							title: relatedPost.title
								? sanitizeAndStyle(
										relatedPost.title.rendered,
										countryCode,
										'title'
								  )
								: relatedPost.link,
							excerpt: relatedPost.excerpt
								? sanitizeAndStyle(
										relatedPost.excerpt.rendered,
										countryCode,
										'excerpt'
								  )
								: '',
						} ) ) || [],
				} );
			} catch ( error ) {
				// Error logging goes here.
				setAttributes( {
					relatedPosts: [],
				} );
			}
		}

		getRelatedPosts();
	}, [ countryCode, setAttributes ] );

	return (
		<div { ...useBlockProps() }>
			{
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label={ __( 'Change Country', 'xwp-country-card' ) }
							icon={ edit }
							onClick={ handleChangeCountry }
							disabled={ ! Boolean( countryCode ) }
						/>
					</ToolbarGroup>
				</BlockControls>
			}
			{ isPreview ? (
				<Preview
					countryCode={ countryCode }
					relatedPosts={ relatedPosts }
				/>
			) : (
				<Placeholder
					icon={ globe }
					label={ __( 'XWP Country Card', 'xwp-country-card' ) }
					isColumnLayout={ true }
					instructions={ __(
						'Type in a name of a contry you want to display on you site.',
						'xwp-country-card'
					) }
				>
					<ComboboxControl
						label={ __( 'Country', 'xwp-country-card' ) }
						hideLabelFromVision
						options={ options }
						value={ countryCode }
						onChange={ handleChangeCountryCode }
						allowReset={ true }
					/>
				</Placeholder>
			) }
		</div>
	);
}
