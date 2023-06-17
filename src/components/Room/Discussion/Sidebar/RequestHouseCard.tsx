// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';

const RequestHouseCard = () => {
	return (
		<section
			className='border border-solid border-blue_primary rounded-2xl drop-shadow-[0px_6px_18px_rgba(0,0,0,0.06)] p-6 text-white flex flex-col gap-y-3 items-center'
		>
			<h2 className='m-0 p-0 flex flex-col font-medium text-[18px] leading-[22px] tracking-[0.01em] items-center'>
				<span>
                    Simplify decision making
				</span>
				<span>
                    using Townhall
				</span>
			</h2>
			<button className='outline-none border border-solid border-blue_primary text-sm font-normal leading-[17px] text-blue_primary rounded-2xl py-2 px-4 bg-transparent'>
                Request a House for your Blockchain
			</button>
		</section>
	);
};

export default RequestHouseCard;