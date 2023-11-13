// LIB
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// SERVICES
import targetGroupService from '../../../common/services/target-group.service';
import userService from '../../../common/services/user.service';
// TYPES
import IUser from '../../../type/user-type';
import ITargetGroup from '../../../type/target-group-type';
// COMPONENTS
import Content from '../../../layout/Content/Content';
import Page from '../../../layout/Page/Page';
import Card, {
	CardTitle,
	CardHeader,
	CardBody,
	CardActions,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Label from '../../../components/bootstrap/forms/Label';
import { ToastContainer } from '../../../components/bootstrap/Toasts';

const TargetGroupUsers = () => {
	const [targetGroup, setTargetGroup] = useState<ITargetGroup | null>(null);
	const [userOptions, setUserOptions] = useState<IUser[] | null>(null);
	const [userValues, setUserValues] = useState<IUser[] | null>(null);
	const [search, setSearch] = useState('');
	const [toastInfo, setToastInfo] = useState<{ isSuccess: boolean; message: string } | null>(
		null,
	);
	const [hasChanged, setHasChanged] = useState(false);
	const renderCount = useRef(0);

	useEffect(() => {
		if (renderCount.current <= 2) {
			renderCount.current += 1;
		} else {
			setHasChanged(true);
		}
	}, [userValues]);

	const router = useRouter();
	const targetGroupId = router.query['target-group-id'];

	useEffect(() => {
		if (!router.isReady) return;
		(async () => {
			const [targetGroupInitial, usersInitial] = await Promise.all([
				targetGroupService.getById(targetGroupId as string),
				userService.getAll(),
			]);

			setUserOptions(usersInitial);
			setUserValues(
				targetGroupInitial.users.map((userId: string) =>
					usersInitial.find((user: IUser) => user._id === userId),
				),
			);
			setTargetGroup(targetGroupInitial);
		})();
	}, [router.isReady, targetGroupId]);

	if (!(router.isReady && userOptions && userValues && targetGroup)) return null;

	const setToast = (message: string, isSuccess: boolean = true) => {
		setToastInfo({
			isSuccess,
			message,
		});
		setTimeout(() => {
			setToastInfo(null);
		}, 3000);
	};

	const handleSaveUser = async () => {
		const updatePayload = {
			...targetGroup,
			users: userValues.map((user) => user._id),
		};
		try {
			await targetGroupService.update(targetGroup._id, updatePayload);
		} catch (e: any) {
			setToast(e.response.data.message, false);
			console.log(e);
			return;
		}
		setToast('Update successfully');
		setTargetGroup(updatePayload);
	};

	const handleToggleUser = (user: IUser) => {
		return () => {
			if (isUserSelected(user)) {
				setUserValues(userValues.filter((userValue) => userValue._id !== user._id));
			} else {
				setUserValues(userValues.concat([user]));
			}
		};
	};

	const isUserSelected = (user: IUser) => {
		return userValues.find((selectedUser) => user._id === selectedUser._id);
	};

	const sortedAndSearched = userOptions
		.filter((user) => {
			const fullName = `${user.lastName} ${user.firstName}`;
			return fullName.toLowerCase().includes(search) || user.email.includes(search);
		})
		.sort((a, b) => {
			if (isUserSelected(a) && !isUserSelected(b)) return -1;
			if (isUserSelected(b) && !isUserSelected(a)) return 1;

			return 0;
		});

	return (
		<>
			<Content>
				<Page container='fluid'>
					<Card>
						<CardHeader>
							<CardTitle className='h3'>{`Target Group: ${targetGroup.name}`}</CardTitle>
							<CardActions>
								<Button
									rounded={1}
									isDisable={!hasChanged}
									color='primary'
									onClick={handleSaveUser}>
									<Icon className='inline-block' icon='Save' />
									Save changes
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody>
							<Label htmlFor='search'>Search</Label>
							<Input
								className='mb-2'
								id='search'
								// disabled={}
								onInput={(event: InputEvent) => {
									setSearch(
										(
											event.currentTarget as HTMLInputElement
										).value.toLowerCase(),
									);
								}}
								value={search}
							/>
							<table className='table'>
								<thead>
									<tr>
										<th>No.</th>
										<th>Name</th>
										<th>Email</th>
										<th>isManager</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{sortedAndSearched.map((user, index) => (
										<tr key={user._id}>
											<td>{index + 1}</td>
											<td>
												<Image
													className='rounded-full inline-block me-2'
													alt='avatar'
													src={user.picture}
													width={30}
													height={30}
												/>
												{`${user.lastName} ${user.firstName}`}
											</td>
											<td className='align-middle'>{user.email}</td>
											<td
												className={
													user.isManager
														? 'font-medium align-middle text-[#005b2e]'
														: 'font-medium align-middle text-[#b3170a]'
												}
												color={user.isManager ? 'success' : 'danger'}>
												{user.isManager ? 'TRUE' : 'FALSE'}
											</td>
											<td>
												<Button
													className='mx-2'
													rounded={1}
													color={
														isUserSelected(user) ? 'danger' : 'primary'
													}
													isActive
													onClick={handleToggleUser(user)}>
													<Icon
														icon={
															isUserSelected(user) ? 'Close' : 'Add'
														}
													/>
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</CardBody>
					</Card>
				</Page>
			</Content>
			{toastInfo && (
				<ToastContainer>
					<div
						className={`text-[1.2rem] h-14 w-[30rem] flex items-center text-white p-4 ${
							toastInfo.isSuccess ? 'bg-[#005b2e]' : 'bg-[#b3170a]'
						}`}>
						<Icon className='me-3' icon={toastInfo.isSuccess ? 'TaskAlt' : 'Block'} />
						{toastInfo.message}
					</div>
				</ToastContainer>
			)}
		</>
	);
};

export default TargetGroupUsers;
