// LIB
import { useState, useEffect, Fragment } from 'react';
// SERVICE
import TargetGroupService from '../../common/services/target-group.service';
// TYPE
import ITargetGroup from '../../type/target-group-type';
// COMPONENT
import Content from '../../layout/Content/Content';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import Icon from '../../components/icon/Icon';
import { ToastContainer } from '../../components/bootstrap/Toasts';
import TargetGroupName from '../../components/TargetGroupName';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../components/bootstrap/Modal';
import Card, {
	CardHeader,
	CardBody,
	CardTitle,
	CardActions,
} from '../../components/bootstrap/Card';

const TargetGroup = () => {
	const [targetGroups, setTargetGroups] = useState<ITargetGroup[] | null>(null);
	const [idDeleting, setIdDeleting] = useState<string | null>('');
	const [isCreating, setIsCreating] = useState(false);
	const [toastInfo, setToastInfo] = useState<{ isSuccess: boolean; message: string } | null>(
		null,
	);

	useEffect(() => {
		(async () => setTargetGroups(await TargetGroupService.getAll()))();
	}, []);

	const setToast = (message: string, isSuccess: boolean = true) => {
		setToastInfo({
			isSuccess,
			message,
		});
		setTimeout(() => {
			setToastInfo(null);
		}, 3000);
	};

	if (!targetGroups) return null;

	const handleUpdateName = (targetGroup: ITargetGroup) => {
		return async (name: string) => {
			if (name === targetGroup.name) return;
			try {
				await TargetGroupService.update(targetGroup._id, {
					...targetGroup,
					name,
				});
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
			}
			setToast('Update successfully');

			setTargetGroups(
				targetGroups.map((group) => (group._id === targetGroup._id ? targetGroup : group)),
			);
			setIsCreating(false);
		};
	};

	const handleCreate = async (name: string) => {
		const newTargetGroup = {
			name,
			users: [] as string[],
			organizations: [] as string[],
		} as ITargetGroup;

		try {
			const response = await TargetGroupService.create(newTargetGroup);
			setTargetGroups(targetGroups.concat(response));
			setIsCreating(false);
			setToast('Create successfully');
		} catch (e: any) {
			console.log(e);
			setToast(e.response.data.message, false);
		}
	};

	const handleDelete = (id: string) => {
		return async () => {
			try {
				await TargetGroupService.deleteById(id);
			} catch (e: any) {
				setToast(e.response.data.message, false);
			}
			setToast('Delete successfully');

			setTargetGroups(targetGroups.filter((targetGroup) => targetGroup._id !== id));
		};
	};

	return (
		<>
			<Content>
				<Page>
					<Card>
						<CardHeader>
							<CardTitle className='h3'>Target Groups</CardTitle>
							<CardActions>
								<Button
									color='primary'
									rounded={1}
									isActive
									onClick={() => setIsCreating(true)}>
									<Icon className='inline-block' icon='Add' />
									Create new
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody>
							<table className='table-fixed'>
								<thead>
									<tr className='h-16'>
										<th className='w-1/4'>No.</th>
										<th className='w-2/4'>Name</th>
										<th className='w-1/4'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{targetGroups.map((targetGroup, index) => (
										<Fragment key={targetGroup._id}>
											<tr className='h-16'>
												<td>{index + 1}</td>
												<td>
													<TargetGroupName
														name={targetGroup.name}
														onNameChange={handleUpdateName(targetGroup)}
														triggerToast={setToast}
													/>
												</td>
												<td>
													<Button
														className='mx-1'
														tag='a'
														to={`target-groups/${targetGroup._id}/users`}
														color='light'>
														<Icon
															className='inline-block'
															icon='Person'
														/>
														User
													</Button>
													<Button
														className='mx-1'
														tag='a'
														to={`target-groups/${targetGroup._id}/organizations`}
														color='light'>
														<Icon
															className='inline-block'
															icon='CorporateFare'
														/>
														Organization
													</Button>
													<Button
														className='mx-1'
														isActive
														onClick={() =>
															setIdDeleting(targetGroup._id)
														}
														color='danger'>
														<Icon icon='Delete' />
													</Button>
												</td>
											</tr>
											<Modal
												onClick={() => setIdDeleting(null)}
												titleId={targetGroup._id}
												size='sm'
												isCentered
												isOpen={idDeleting === targetGroup._id}
												setIsOpen={() => {}}>
												<ModalHeader onClick={(e) => e.stopPropagation()}>
													<ModalTitle id={targetGroup._id}>
														Are you sure?
													</ModalTitle>
												</ModalHeader>
												<ModalBody onClick={(e) => e.stopPropagation()}>
													This action is irreversible!
												</ModalBody>
												<ModalFooter onClick={(e) => e.stopPropagation()}>
													<Button
														className='mx-2'
														rounded={1}
														color='dark'
														isOutline
														onClick={() => {
															setIdDeleting(null);
														}}>
														Cancel
													</Button>
													<Button
														color='danger'
														onClick={(e: Event) => {
															e.stopPropagation();
															handleDelete(targetGroup._id)();
														}}>
														Delete
													</Button>
												</ModalFooter>
											</Modal>
										</Fragment>
									))}
									{isCreating && (
										<tr>
											<td>{targetGroups.length + 1}</td>
											<td>
												<TargetGroupName
													name=''
													onNameChange={handleCreate}
													onCancel={() => setIsCreating(false)}
													isCreate
												/>
											</td>
											<td>
												<Button isDisable className='mx-1' color='light'>
													<Icon className='inline-block' icon='Person' />
													User
												</Button>
												<Button isDisable className='mx-1' color='light'>
													<Icon
														className='inline-block'
														icon='CorporateFare'
													/>
													Organization
												</Button>
												<Button
													className='mx-1'
													isActive
													isDisable
													color='danger'>
													<Icon icon='Delete' />
												</Button>
											</td>
										</tr>
									)}
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

export default TargetGroup;
