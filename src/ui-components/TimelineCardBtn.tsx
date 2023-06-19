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
	disabled?: boolean;
}

const TimelineCardBtn: FC<ITimelineCardBtnProps> = (props) => {
	const { icon, title, onClick, isActiveStage, disabled } = props;
	return (
		<article className='flex items-center gap-x-[6px] w-[188px]'>
			{
				isActiveStage?
					<span className='max-h-[35px] h-full w-2 bg-blue_primary rounded-[4.3px]'>
					</span>
					: null
			}
			<button
				disabled={disabled}
				onClick={onClick}
				className={classNames('outline-none bg-transparent flex items-center justify-center gap-x-2 rounded-2xl border border-solid border-blue_primary py-[11px] text-white text-base leading-[20px] font-normal flex-1 h-[40px]', {
					'cursor-not-allowed': disabled,
					'cursor-pointer': !disabled
				})}>
				<span className='flex items-center justify-center text-xl leading-none'>
					{icon}
				</span>
				<h4 className='m-0 p-0'>
					{title}
				</h4>
			</button>
		</article>
	);
};

export default TimelineCardBtn;