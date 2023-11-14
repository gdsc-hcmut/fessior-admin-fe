// LIB
import { useState, useEffect, Fragment } from 'react';
// SERVICE
import AccessLevelService from '../../common/services/access-level.service';
import PermissionService from '../../common/services/permission.service';
// TYPE
import IAccessLevel from '../../type/access-level-type';
// COMPONENT
import Page from '../../layout/Page/Page';
import Content from '../../layout/Content/Content';
import Card, {
	CardTitle,
	CardBody,
	CardHeader,
	CardLabel,
	CardActions,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Icon from '../../components/icon/Icon';
import AccessLevelForm from '../../components/AccessLevelForm';
import Tooltips from '../../components/bootstrap/Tooltips';
import Modal, {
	ModalTitle,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../components/bootstrap/Modal';
import { ToastContainer } from '../../components/bootstrap/Toasts';

const MAX_PERMISSIONS_SHOWN = 3;

const AccessLevel = () => {
	const [accessLevels, setAccessLevels] = useState<IAccessLevel[] | null>(null);
	const [permissions, setPermissions] = useState<string[] | null>(null);
	const [idDeleting, setIdDeleting] = useState<string | null>(null);
	const [editFormShowing, setEditFormShowing] = useState(-1);
	const [createFormShowing, setCreateFormShowing] = useState(false);
	const [toastInfo, setToastInfo] = useState<{ isSuccess: boolean; message: string } | null>(
		null,
	);

	useEffect(() => {
		(async () => {
			const [accessLevelsInitial, permissionsInitial] = await Promise.all([
				AccessLevelService.getAll(),
				PermissionService.getAll(),
			]);
			setAccessLevels(accessLevelsInitial);
			setPermissions(permissionsInitial);
		})();
	}, []);

	if (!accessLevels || !permissions) {
		return null;
	}

	const setToast = (message: string, isSuccess: boolean = true) => {
		setToastInfo({
			isSuccess,
			message,
		});
		setTimeout(() => {
			setToastInfo(null);
		}, 3000);
	};

	const renderPermissions = (accessLevel: IAccessLevel) => {
		const permissionsAllowed =
			accessLevel.permissions.length > MAX_PERMISSIONS_SHOWN
				? accessLevel.permissions.slice(0, MAX_PERMISSIONS_SHOWN)
				: accessLevel.permissions;
		const remaining = accessLevel.permissions.slice(MAX_PERMISSIONS_SHOWN);

		return (
			<>
				{permissionsAllowed.map((permission) => (
					<Button
						key={permission}
						className='text-[#323232] mx-px'
						color='dark'
						isOutline
						isDisable>
						{permission}
					</Button>
				))}
				{remaining.length > 0 && (
					<Tooltips className='mb-3 text-[13px]' title={remaining.join(', ')}>
						<Button className='text-[#323232] mx-px' color='dark' isOutline>
							{`+${remaining.length}`}
						</Button>
					</Tooltips>
				)}
			</>
		);
	};

	const handleUpdate = (
		accessLevelId: string,
		name: string,
		permissionValues: string[],
		users: string[],
	) => {
		return async () => {
			const newAccessLevel = {
				name,
				permissions: permissionValues,
				users,
			} as IAccessLevel;

			try {
				await AccessLevelService.update(accessLevelId, newAccessLevel);
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
				return;
			}

			setToast('Update successfully');

			setAccessLevels(
				accessLevels.map((accessLevel) =>
					accessLevel._id === accessLevelId
						? {
								...accessLevel,
								name,
								permissions: permissionValues,
								users,
						  }
						: accessLevel,
				),
			);
		};
	};

	const handleCreate = (name: string, permissionValues: string[], users: string[]) => {
		return async () => {
			const newAccessLevel = {
				name,
				permissions: permissionValues,
				users,
			} as IAccessLevel;

			try {
				const response = await AccessLevelService.create(newAccessLevel);
				setToast('Create successfully');
				setAccessLevels(accessLevels.concat([response]));
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
			}
		};
	};

	const handleDelete = (id: string) => {
		return async () => {
			try {
				await AccessLevelService.deleteById(id);
				setToast('Delete successfully');
				setAccessLevels(accessLevels.filter((accessLevel) => accessLevel._id !== id));
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
			}
		};
	};

	return (
		<>
			<Content>
				<Page container='fluid'>
					<Card>
						<CardHeader>
							<CardLabel>
								<CardTitle className='h3'>Access Level</CardTitle>
							</CardLabel>
							<CardActions>
								<Button
									rounded={1}
									color='primary'
									onClick={() => setCreateFormShowing(true)}>
									<Icon className='inline-block' icon='Add' />
									Create new
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody>
							<table className='table'>
								<thead>
									<tr>
										<th>No.</th>
										<th>Name</th>
										<th>Permissions</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{accessLevels.map(
										(accessLevel: IAccessLevel, index: number) => (
											<Fragment key={accessLevel._id}>
												<tr>
													<td>{index + 1}</td>
													<td>{accessLevel.name}</td>
													<td>{renderPermissions(accessLevel)}</td>
													<td>
														<Button
															className='mx-2'
															rounded={1}
															color='dark'
															isOutline
															onClick={() =>
																setEditFormShowing(index)
															}>
															<Icon icon='Edit' />
														</Button>
														<Button
															className='mx-2'
															rounded={1}
															color='danger'
															onClick={() =>
																setIdDeleting(accessLevel._id)
															}>
															<Icon icon='Delete' />
														</Button>
													</td>
												</tr>
												<AccessLevelForm
													mode='edit'
													permissionOptions={permissions}
													accessLevel={accessLevel}
													onEdit={handleUpdate}
													isShown={editFormShowing === index}
													setIsShown={() => setEditFormShowing(-1)}
												/>
												<Modal
													onClick={() => setIdDeleting(null)}
													titleId={accessLevel._id}
													size='sm'
													isCentered
													isOpen={idDeleting === accessLevel._id}
													setIsOpen={() => {}}>
													<ModalHeader
														onClick={(e) => e.stopPropagation()}>
														<ModalTitle id={accessLevel._id}>
															Are you sure?
														</ModalTitle>
													</ModalHeader>
													<ModalBody onClick={(e) => e.stopPropagation()}>
														This action is irreversible!
													</ModalBody>
													<ModalFooter
														onClick={(e) => e.stopPropagation()}>
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
																handleDelete(accessLevel._id)();
															}}>
															Delete
														</Button>
													</ModalFooter>
												</Modal>
											</Fragment>
										),
									)}
								</tbody>
							</table>
						</CardBody>
					</Card>
					<AccessLevelForm
						mode='create'
						permissionOptions={permissions}
						onCreate={handleCreate}
						isShown={createFormShowing}
						setIsShown={() => setCreateFormShowing(false)}
					/>
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

export default AccessLevel;
