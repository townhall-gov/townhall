// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { roomsActions } from '~src/redux/rooms';
import { IStrategy } from '~src/redux/rooms/@types';
import { useRoomCreation_House } from '~src/redux/rooms/selectors';
import { useRoomsSelector } from '~src/redux/selectors';
import { EVotingStrategy } from '~src/types/enums';
import { chainProperties } from '~src/onchain-data/networkConstants';

interface IRoomStrategiesProps {
    className?: string;
}

export const getVotingStrategyTitle = (votingStrategy: EVotingStrategy | string) => {
	return votingStrategy? votingStrategy.toString().split('_').map((str, i) => i == 0? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase():str).join(' '): '';
};

export const disabledVotingStrategies: EVotingStrategy[] = [];

export const isVotingStrategyDisabled = (votingStrategy: EVotingStrategy) => {
	return disabledVotingStrategies.includes(votingStrategy);
};

export const getNetworkTitle = (network?: string) => {
	return network? network.toString().split('_').map((str, i) => i == 0? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase():str).join(' '): '';
};

const RoomStrategies: FC<IRoomStrategiesProps> = (props) => {
	const { className } = props;
	const house = useRoomCreation_House();
	const { loading, roomCreation } = useRoomsSelector();
	const { room_strategies } = roomCreation;
	const dispatch = useDispatch();

	const [strategy, setStrategy] = useState<IStrategy>();

	const isNetworkDisabled = (network: string) => {
		return house?.blockchain?.toString() === network;
	};
	return (
		<article>
			<section className='flex flex-col gap-y-5'>
				<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
                    Strategies
				</p>
				{
					(room_strategies && Array.isArray(room_strategies) && room_strategies.length > 0)?
						<ul className='flex flex-col gap-y-2 list-decimal m-0 pl-5'>
							{
								room_strategies.map((strategy, index) => {
									return <li key={index} className='p-2 text-white m-0 border-0 border-b border-solid border-blue_primary'>
										<p className='m-0 flex flex-col gap-y-2'>
											<span>{getVotingStrategyTitle(strategy.name)}</span>
											<span className='text-grey_light'>{strategy.network}</span>
										</p>
									</li>;
								})
							}
						</ul>
						: <p className='m-0 text-red_primary'>0 room strategies.</p>
				}
			</section>
			<section className='flex flex-col mt-[28px] gap-y-5'>
				<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
                    Setup voting strategy
				</p>
				<div className='flex flex-col gap-y-2'>
					<Dropdown
						disabled={loading}
						trigger={['click']}
						className={classNames('cursor-pointer px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', className)}
						overlayClassName='ant-dropdown-menu-border-blue_primary'
						menu={{
							items: Object.values(EVotingStrategy).map((votingStrategy) => {
								return {
									disabled: isVotingStrategyDisabled(votingStrategy),
									key: votingStrategy,
									label: (
										<p
											className={classNames('text-base leading-none py-2', {
												'text-grey_light cursor-not-allowed': isVotingStrategyDisabled(votingStrategy),
												'text-white cursor-pointer': !isVotingStrategyDisabled(votingStrategy)
											})}
										>
											{getVotingStrategyTitle(votingStrategy)}
										</p>
									)
								};
							}),
							onClick: (e) => {
								if (isVotingStrategyDisabled(e.key as EVotingStrategy)) return;
								// setStrategy((prev) => ({
								// decimals: 0,
								// network: '',
								// ...prev,
								// name: e.key as EVotingStrategy
								// }));
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
					<Dropdown
						disabled={loading || !house?.networks}
						trigger={['click']}
						className={classNames('px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', className, {
							'cursor-not-allowed': loading || !house?.networks,
							'cursor-pointer': !(loading || !house?.networks)
						})}
						overlayClassName='ant-dropdown-menu-border-blue_primary'
						menu={{
							items: house?.networks.map((network) => {
								return {
									disabled: isNetworkDisabled(network.name),
									key: network.name,
									label: (
										<p
											className={classNames('text-base leading-none py-2', {
												'text-grey_light cursor-not-allowed': isNetworkDisabled(network.name),
												'text-white cursor-pointer': !isNetworkDisabled(network.name)
											})}
										>
											{getNetworkTitle(network.name)}
										</p>
									)
								};
							}),
							onClick: (e) => {
								if (!e.key || isNetworkDisabled(e.key)) return;
								const network = house?.networks.find((network) => network.name === e.key);
								setStrategy((prev) => ({
									...prev,
									decimals: network?.decimals || chainProperties?.[e.key as keyof typeof chainProperties]?.decimals || 0,
									network: e.key as EVotingStrategy
								} as any));
							}
						}}
					>
						{
							house?.networks?
								strategy?.network?
									<p id='votingTypeDropdown' className="flex justify-between items-center text-white font-medium text-base leading-none">
										{getNetworkTitle(strategy?.network)}
										<DownOutlined/>
									</p>
									: <p className='m-0 flex justify-between items-center text-grey_light text-base leading-none'>
										<span>Select network for voting strategy</span>
										<DownOutlined/>
									</p>
								: <p className='text-red_primary flex justify-between items-center text-white font-medium text-base leading-none'>
                                    No networks available, please select different house
								</p>
						}
					</Dropdown>
					<div className='flex items-center justify-end'>
						<button
							disabled={!strategy || !strategy.name || !strategy.network}
							onClick={() => {
								if (strategy) {
									dispatch(roomsActions.setRoomCreation_RoomStrategies(strategy));
									setStrategy(undefined);
								}
							}}
							className={
								classNames('border-none outline-none px-8 py-2 text-base bg-blue_primary text-white rounded-xl', {
									'cursor-not-allowed': !strategy || !strategy.name || !strategy.network,
									'cursor-pointer': !(!strategy || !strategy.name || !strategy.network)
								})
							}
						>
                            Add
						</button>
					</div>
				</div>
			</section>
		</article>
	);
};

export default RoomStrategies;