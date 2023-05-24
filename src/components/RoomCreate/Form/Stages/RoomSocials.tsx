// Copyright 2019-2025 @polka-labs/townhall authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRoomCreation_RoomSocials } from '~src/redux/rooms/selectors';
import Input from '../../../../ui-components/Input';
import { roomsActions } from '~src/redux/rooms';
import { ESocial } from '~src/redux/rooms/@types';
import SocialIcon from '~src/ui-components/SocialIcon';

const RoomSocials = () => {
	const projectSocials = useRoomCreation_RoomSocials();
	const [socials, setSocials] = useState({
		discord: '',
		github: '',
		reddit: '',
		telegram: '',
		twitter: ''
	});
	useEffect(() => {
		if (projectSocials && Array.isArray(projectSocials)) {
			const socials = {
				discord: '',
				github: '',
				reddit: '',
				telegram: '',
				twitter: ''
			};
			projectSocials?.forEach((social) => {
				if (social.type && social.url) {
					socials[social.type] = social.url;
				}
			});
			setSocials(socials);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<article>
			<p className='m-0 text-white font-semibold text-lg leading-[23px]'>
				Fill in your details.
			</p>
			<div className='flex flex-col mt-[28px] gap-y-5'>
				{
					Object.values(ESocial).map((social, index) => {
						return (
							<SocialInput
								onChange={(v) => {
									setSocials((prev) => {
										return {
											...prev,
											[social]: v
										};
									});
								}}
								type={social as ESocial}
								value={socials[social]}
								key={index}
							/>
						);
					})
				}
			</div>
		</article>
	);
};

interface ISocialInputProps {
	type: ESocial;
	onChange: (v: string) => void;
	value: string;
}

const SocialInput: FC<ISocialInputProps> = (props) => {
	const { onChange, type, value } = props;
	const dispatch = useDispatch();
	return (
		<div className='flex'>
			<div className='flex items-center justify-center text-white text-[22px] leading-none border border-r-0 border-solid rounded-2xl rounded-r-none border-blue_primary h-full px-[18.5px] py-[21.5px]'>
				<SocialIcon type={type} />
			</div>
			<Input
				value={value}
				onChange={(v) => {
					onChange(v);
					dispatch(roomsActions.setRoomCreation_RoomSocials({
						type: type,
						url: v
					}));
				}}
				type='text'
				placeholder={`${(type && type.toString)? (type.toString().charAt(0).toUpperCase() + type.toString().slice(1)): ''} Handle`}
				className='rounded-l-none'
			/>
		</div>
	);
};

export default RoomSocials;