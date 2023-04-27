// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';

interface ITimelineCardBtnProps {
    isActiveStage: boolean;
    onClick: () => void;
    icon: JSX.Element;
    title: string;
}

const TimelineCardBtn: FC<ITimelineCardBtnProps> = (props) => {
	const { icon, title, onClick, isActiveStage } = props;
	return (
		<article className='flex items-center gap-x-[6px] w-full'>
			{
				isActiveStage?
					<span className='max-h-[35px] h-full w-2 bg-blue_primary rounded-[4.3px]'>
					</span>
					: null
			}
			<button
				onClick={onClick}
				className={classNames('outline-none bg-transparent cursor-pointer grid grid-cols-10 gap-x-2 rounded-2xl border border-solid border-blue_primary py-[11px] px-[30px] text-white text-base leading-[20px] font-normal flex-1', {
					'pl-4': isActiveStage
				})}>
				<span className='col-span-2 flex items-center justify-center text-xl leading-none'>
					{icon}
				</span>
				<h4 className='col-span-8 m-0 p-0'>
					{title}
				</h4>
			</button>
		</article>
	);
};

export default TimelineCardBtn;