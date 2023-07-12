// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';
import { assetType, chainProperties } from '~src/onchain-data/networkConstants';
import { modalActions } from '~src/redux/modal';
import { EContentType, EFooterType, ETitleType } from '~src/redux/modal/@types';
import { roomActions } from '~src/redux/room';
import { useRoomSettings } from '~src/redux/room/selectors';
import { EVotingStrategy } from '~src/types/enums';
import { PlusSignSquareIcon, ExpandIcon } from '~src/ui-components/CustomIcons';

interface IAddStrategyOrThresholdProps {
    type?: string;
    isDisabled?:boolean
}

const AddStrategyOrThreshold: FC<IAddStrategyOrThresholdProps> = (props) => {
	const { type,isDisabled } = props;
	const dispatch = useDispatch();
	const roomSettings = useRoomSettings();
	const { room_strategies_threshold } = roomSettings;
	if(type=='Strategy')
		return (
			<>
				<Button
					disabled={isDisabled}
					className={classNames('border border-solid border-blue_primary text-white py-1 px-6 rounded-md text-base font-medium bg-blue_primary flex items-center justify-center')}
					onClick={() => {
						dispatch(modalActions.setModal({
							contentType: EContentType.ROOM_STRATEGY_ADD_MODAL,
							footerType: EFooterType.ROOM_STRATEGY_ADD_MODAL,
							open: true,
							titleType: ETitleType.ROOM_STRATEGY_ADD_MODAL
						}));
					} }
				>
					<PlusSignSquareIcon className='text-transparent stroke-white' />
            Add Strategy
				</Button><ExpandIcon className='text-2xl cursor-pointer bg-app_background border-none' /></>
		);
	else
		return (
			<>
				{
					(room_strategies_threshold && Array.isArray(room_strategies_threshold) && room_strategies_threshold.length > 8)?
						null
						:<>
							<Button
								disabled={isDisabled}
								className={classNames('border border-solid border-blue_primary text-white py-1 px-6 rounded-md text-base font-medium bg-blue_primary flex items-center justify-center')}
								onClick={() => {
									const defaultNetwork = 'polkadot';
									dispatch(roomActions.setRoomSettingsStrategiesThresholdAdd({
										asset_type: assetType.Native,
										id: v4(),
										name: EVotingStrategy.BALANCE_OF,
										network: defaultNetwork,
										proposal_creation_threshold: '',
										threshold: '',
										token_metadata: {
											[assetType.Native]: {
												decimals: chainProperties[defaultNetwork].decimals,
												name: '',
												symbol: chainProperties[defaultNetwork].symbol
											}
										},
										weight: ''
									}));
								}}
							>
								<PlusSignSquareIcon className='text-transparent stroke-white' />
                                 Add New
							</Button><ExpandIcon className='text-2xl cursor-pointer bg-app_background border-none' /></>
				}
			</>
		);
};
export default AddStrategyOrThreshold;