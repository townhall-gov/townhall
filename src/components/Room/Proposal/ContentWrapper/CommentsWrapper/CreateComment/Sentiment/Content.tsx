// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Slider } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '~src/redux/proposal';
import { useProposalSelector } from '~src/redux/selectors';
import { ESentiment } from '~src/types/enums';
import SentimentIcon from '~src/ui-components/SentimentIcon';

const SentimentModalContent = () => {
	const { commentCreation } = useProposalSelector();
	const dispatch = useDispatch();
	return (
		<section>
			<h3 className='m-0 text-lg font-medium leading-[22px] tracking-[0.01em] flex flex-col justify-center'>
				<p className='m-0 p-0 text-center'>
                    Thank you for commenting on the post.
				</p>
				<p className='m-0 p-0 text-center'>
                    Select a sentiment that feels
				</p>
				<p className='m-0 p-0 text-center'>
                    appropriate to you.
				</p>
			</h3>
			<article className='mt-7 flex flex-col items-center justify-center'>
				<Slider
					className='w-full max-w-[276px]'
					trackStyle={{ backgroundColor:'#5E6F80' }}
					onChange={(value: number) => {
						dispatch(proposalActions.setCommentCreation_Field({
							key: 'sentiment',
							value: Object.values(ESentiment)[value - 1]
						}));
					}}
					step={5}
					marks={Object.values(ESentiment).reduce((prev, sentiment, index) => {
						prev = {
							...prev,
							[index + 1]: {
								label: (
									<SentimentIcon
										type={sentiment}
										className={classNames('text-[36px]', {
											'text-grey_tertiary': commentCreation?.sentiment !== sentiment,
											'text-purple_primary': commentCreation?.sentiment === sentiment
										})}
									/>),
								style: { marginTop:'-22.5px' }
							}
						};
						return prev;
					}, {})}
					min={1}
					max={5}
					value={Object.values(ESentiment).indexOf(commentCreation?.sentiment) + 1}
					defaultValue={3}
				/>
				<h4 className='m-0 text-purple_primary font-semibold text-xl leading-6 tracking-[0.01em]'>
					{(commentCreation?.sentiment || '')?.toString().split('_').map((str) => str.charAt(0)?.toUpperCase() + str.slice(1).toLowerCase()).join(' ')}
				</h4>
			</article>
		</section>
	);
};

export default SentimentModalContent;