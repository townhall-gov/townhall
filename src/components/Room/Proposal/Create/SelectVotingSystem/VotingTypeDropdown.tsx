// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Dropdown } from 'antd';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { roomActions } from '~src/redux/room';
import { useRoomSelector } from '~src/redux/selectors';
import { EVotingSystem } from '~src/types/enums';

interface IVotingTypeDropdownProps {
    className?: string;
}

const getVotingSystemTitle = (votingSystem: EVotingSystem) => {
	return votingSystem? votingSystem.toString().split('_').map((str, i) => i == 0? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase():str).join(' '): '';
};

const disabledVotingSystems = [EVotingSystem.APPROVAL_VOTING, EVotingSystem.BASIC_VOTING, EVotingSystem.QUADRATIC_VOTING, EVotingSystem.RANKED_CHOICE_VOTING, EVotingSystem.WEIGHTED_VOTING];

const isVotingSystemDisabled = (votingSystem: EVotingSystem) => {
	return disabledVotingSystems.includes(votingSystem);
};

const VotingTypeDropdown: FC<IVotingTypeDropdownProps> = (props) => {
	const { className } = props;
	const dispatch = useDispatch();
	const { loading } = useRoomSelector();
	const [votingSystem, setVotingSystem] = useState<EVotingSystem>(EVotingSystem.SINGLE_CHOICE_VOTING);
	return (
		<div>
			<h4 className='text-grey_light'>Type</h4>
			<Dropdown
				disabled={loading}
				trigger={['click']}
				className={classNames('cursor-pointer px-[18.5px] py-[21.5px] border border-solid border-blue_primary rounded-2xl voting_system_type', className)}
				overlayClassName='ant-dropdown-menu-border-blue_primary'
				menu={{
					items: Object.values(EVotingSystem).map((votingSystem) => {
						return {
							disabled: isVotingSystemDisabled(votingSystem),
							key: votingSystem,
							label: (
								<p
									className={classNames('text-base leading-none py-2', {
										'text-grey_light cursor-not-allowed': isVotingSystemDisabled(votingSystem),
										'text-white cursor-pointer': !isVotingSystemDisabled(votingSystem)
									})}
								>
									{getVotingSystemTitle(votingSystem)}
								</p>
							)
						};
					}),
					onClick: (e) => {
						if (isVotingSystemDisabled(e.key as EVotingSystem)) return;
						dispatch(roomActions.setProposalCreation_Field({
							key: 'voting_system',
							value: e.key as EVotingSystem
						}));
						setVotingSystem(e.key as EVotingSystem);
					}
				}}
			>
				<p id='votingTypeDropdown' className="flex justify-between items-center text-white font-medium text-base leading-none">
					{getVotingSystemTitle(votingSystem)}
				</p>
			</Dropdown>
		</div>
	);
};

export default VotingTypeDropdown;