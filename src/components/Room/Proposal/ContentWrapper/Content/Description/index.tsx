// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import ReactHTMLParser from 'react-html-parser';

interface IDescriptionProps {
    value: string;
}

const Description: FC<IDescriptionProps> = (props) => {
	const { value } = props;
	const [showMore, setShowMore] = useState(false);
	const divRef = useRef<HTMLDivElement>(null);
	const [showMoreBtnVisible, setShowMoreBtnVisible] = useState(true);
	useEffect(() => {
		if (divRef.current && divRef.current.scrollHeight <= 200) {
			setShowMoreBtnVisible(false);
		} else {
			setShowMoreBtnVisible(true);
		}
	}, [value]);
	return (
		<article
			className='flex flex-col gap-y-7'
		>
			<div
				ref={divRef}
				className={
					classNames('html-content font-normal text-white leading-[23px] text-sm tracking-[0.01em] overflow-y-hidden',
						{
							'max-h-[200px]': !showMore,
							'max-h-none': showMore
						})
				}
			>
				{ReactHTMLParser(value)}
			</div>
			{
				showMoreBtnVisible?
					<div className='flex items-center justify-center border border-solid border-transparent border-b-[#373737] pb-1 drop-shadow-[0px_-9px_14px_#66A5FF]'>
						<button
							onClick={() => setShowMore(!showMore)}
							className='border-none outline-none bg-transparent text-blue_primary font-medium text-sm leading-[22px] flex items-center justify-center cursor-pointer'
						>
							{
								showMore?
									'Show Less':
									'Show More'
							}
						</button>
					</div>
					: null
			}
		</article>
	);
};

export default Description;