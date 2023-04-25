// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { FC } from 'react';
import { ERoomCreationStage } from '~src/redux/rooms/@types';
import { useRoomCreationStageComplete } from '~src/redux/rooms/selectors';

interface ILineProps {
    icon: JSX.Element;
    title: string;
	stage: ERoomCreationStage;
}

const Line: FC<ILineProps> = (props) => {
	const { stage } = props;
	const isComplete = useRoomCreationStageComplete(stage);
	return (
		<div className={classNames('flex-1 rounded-md h-[3px]', {
			'bg-[rgba(102,165,255,0.32)]': !isComplete,
			'bg-blue_primary': isComplete
		})}>
		</div>
	);
};

export default Line;