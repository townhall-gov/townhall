// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';

interface IFilterProps {
    className?: string;
	setOption: React.Dispatch<React.SetStateAction<string>>;
	option: string;
	loading?: boolean;
}

interface IFilterOptionLabelProps {
    title: string;
}

const FilterOptionLabel: FC<IFilterOptionLabelProps> = (props) => {
	const { title } = props;
	return (
		<p className='text-white font-normal text-sm leading-[17px] m-0'>
			{title}
		</p>
	);
};

const Filter: FC<IFilterProps> = (props) => {
	const { className, setOption, option, loading } = props;
	const items = [
		{
			key: 'all',
			label: <FilterOptionLabel title={'All'} />
		},
		{
			key: 'active',
			label: <FilterOptionLabel title={'Active'} />
		},
		{
			key: 'pending',
			label: <FilterOptionLabel title={'Pending'} />
		},
		{
			key: 'closed',
			label: <FilterOptionLabel title={'Closed'} />
		}
	];
	return (
		<Dropdown
			disabled={loading}
			trigger={['click']}
			className={classNames('cursor-pointer px-[15.5px] py-[7.5px] border border-solid border-blue_primary rounded-2xl min-w-[125px] w-full', className)}
			overlayClassName='ant-dropdown-menu-border-blue_primary'
			menu={{
				items: items,
				onClick: (e) => {
					setOption(e.key);
				}
			}}
		>
			<div className="flex justify-between items-center gap-x-[10px]">
				{
					option?
						<>
							{
								items.find((item) => item.key === option)?.label
							}
						</>
						: <span className='text-[#ABA3A3] font-normal text-lg leading-[22px]'>
                                All
						</span>
				}
				<span className='flex items-center justify-center text-white'>
					<DownOutlined />
				</span>
			</div>
		</Dropdown>
	);
};

export default Filter;