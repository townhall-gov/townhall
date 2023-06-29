// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { FC } from 'react';
import { EVotingStrategy } from '~src/types/enums';
import { getVotingStrategyTitle } from '~src/components/RoomCreate/Form/Stages/RoomStrategies';
import { roomActions } from '~src/redux/room';
import { IStrategy } from '~src/redux/rooms/@types';
import { useDispatch } from 'react-redux';

interface IStrategyDropdownProps {
    isDisabled?: boolean;
    strategy: IStrategy;
    className?: string;
}

const StrategyDropdown: FC<IStrategyDropdownProps> = (props) => {
	const { isDisabled, strategy, className } = props;
	const dispatch = useDispatch();
	return (
		<article>
			<h5 className='mb-1'>Select strategy</h5>
			<Dropdown
				disabled={isDisabled}
				trigger={['click']}
				className={classNames('px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', className, {
					'cursor-not-allowed': isDisabled,
					'cursor-pointer': !isDisabled
				})}
				overlayClassName='ant-dropdown-menu-border-blue_primary'
				menu={{
					items: Object.values(EVotingStrategy).map((votingStrategy) => {
						return {
							key: votingStrategy,
							label: (
								<p
									className={classNames('text-base leading-none py-2 text-white cursor-pointer')}
								>
									{getVotingStrategyTitle(votingStrategy)}
								</p>
							)
						};
					}),
					onClick: (e) => {
						dispatch(roomActions.setRoomSettingsStrategiesEdit({
							...strategy,
							name: e.key as EVotingStrategy
						}));
					}
				}}
			>
				{
					strategy?.name?
						<p id='votingTypeDropdown' className="flex justify-between items-center text-white font-medium text-base leading-none">
							{getVotingStrategyTitle(strategy?.name)}
							<DownOutlined/>
						</p>
						:
						<p className='m-0 flex justify-between text-grey_light text-base leading-none'>
							<span>Select voting strategy</span>
							<DownOutlined/>
						</p>
				}
			</Dropdown>
		</article>
	);
};

export default StrategyDropdown;