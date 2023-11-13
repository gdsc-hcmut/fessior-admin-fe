import { useState, useEffect, Fragment } from 'react';
import FeatureFlagService from '../../common/services/feature-flag.service';
import TargetGroupService from '../../common/services/target-group.service';
import { idsToObjects } from '../../helpers/helpers';
import IFeatureFlag, { IPlatform } from '../../type/feature-flag-type';
import ITargetGroup from '../../type/target-group-type';
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
import FeatureFlagForm from '../../components/FeatureFlagForm';
import Tooltips from '../../components/bootstrap/Tooltips';
import Modal, {
	ModalTitle,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../components/bootstrap/Modal';
import { ToastContainer } from '../../components/bootstrap/Toasts';

// const PLATFORMS = ['web', 'android', 'ios'];
const MAX_TARGET_GROUPS_SHOWN = 3;
const MAX_DESCRIPTION_LENGTH = 40;

const FeatureFlag = () => {
	const [featureFlags, setFeatureFlags] = useState<IFeatureFlag[] | null>(null);
	const [targetGroups, setTargetGroups] = useState<ITargetGroup[] | null>(null);
	const [editFormShowing, setEditFormShowing] = useState(-1);
	const [createFormShowing, setCreateFormShowing] = useState(false);
	const [idDeleting, setIdDeleting] = useState<string | null>(null);
	const [toastInfo, setToastInfo] = useState<{ isSuccess: boolean; message: string } | null>(
		null,
	);

	useEffect(() => {
		(async () => {
			const [featureFlagsInitial, targetGroupsInitial] = await Promise.all([
				FeatureFlagService.getAll(),
				TargetGroupService.getAll(),
			]);
			setFeatureFlags(
				featureFlagsInitial.map((featureFlag: IFeatureFlag) => {
					return {
						...featureFlag,
						targetGroups: idsToObjects<ITargetGroup>(
							featureFlag.targetGroups,
							targetGroupsInitial,
						).map((targetGroup) => targetGroup.name),
					};
				}),
			);
			setTargetGroups(targetGroupsInitial);
		})();
	}, []);

	if (!featureFlags || !targetGroups) {
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

	const renderTargetGroups = (featureFlag: IFeatureFlag) => {
		const targetGroupsAllowed =
			featureFlag.targetGroups.length > MAX_TARGET_GROUPS_SHOWN
				? featureFlag.targetGroups.slice(0, MAX_TARGET_GROUPS_SHOWN)
				: featureFlag.targetGroups;
		const remaining = featureFlag.targetGroups.slice(MAX_TARGET_GROUPS_SHOWN);

		return (
			<>
				{targetGroupsAllowed.map((targetGroup) => (
					<Button
						key={targetGroup}
						className='text-[#323232] mx-px'
						color='dark'
						isOutline
						isDisable>
						{targetGroup}
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

	const renderDescription = (featureFlag: IFeatureFlag) => {
		return featureFlag.description.length > MAX_DESCRIPTION_LENGTH ? (
			<Tooltips className='mb-3 text-[13px]' title={featureFlag.description}>
				{`${featureFlag.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
			</Tooltips>
		) : (
			featureFlag.description
		);
	};

	const handleUpdate = (
		featureFlagId: string,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => {
		return async () => {
			const newFeatureFlag = {
				description,
				targetGroups: targetGroupsNames.map(
					(name) => targetGroups.find((targetGroup) => targetGroup.name === name)!._id,
				),
				isEnabled,
			} as IFeatureFlag;

			try {
				await FeatureFlagService.update(featureFlagId, newFeatureFlag);
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
				return;
			}

			setToast('Update successfully');

			setFeatureFlags(
				featureFlags.map((featureFlag) =>
					featureFlag._id === featureFlagId
						? {
								...featureFlag,
								description,
								targetGroups: targetGroupsNames,
								isEnabled,
						  }
						: featureFlag,
				),
			);
		};
	};

	const handleCreate = (
		key: string,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => {
		return async () => {
			const newFeatureFlag = {
				key,
				description,
				targetGroups: targetGroupsNames.map(
					(name) => targetGroups.find((targetGroup) => targetGroup.name === name)!._id,
				),
				platforms: [] as IPlatform[],
				isEnabled,
			} as IFeatureFlag;

			try {
				const response = await FeatureFlagService.create(newFeatureFlag);
				setToast('Create successfully');
				setFeatureFlags(
					featureFlags.concat([
						{
							...response,
							targetGroups: idsToObjects(response.targetGroups, targetGroups).map(
								(targetGroup) => targetGroup.name,
							),
						},
					]),
				);
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
			}
		};
	};

	const handleDelete = (id: string) => {
		return async () => {
			try {
				await FeatureFlagService.deleteById(id);
				setToast('Delete successfully');
				setFeatureFlags(featureFlags.filter((featureFlag) => featureFlag._id !== id));
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
								<CardTitle className='h3'>Feature Flag</CardTitle>
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
										<th>Key</th>
										<th>Description</th>
										<th>Target Groups</th>
										<th>isEnabled</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{featureFlags.map(
										(featureFlag: IFeatureFlag, index: number) => (
											<Fragment key={featureFlag._id}>
												<tr>
													<td>{index + 1}</td>
													<td>{featureFlag.key}</td>
													<td>{renderDescription(featureFlag)}</td>
													<td>{renderTargetGroups(featureFlag)}</td>
													<td
														className={
															featureFlag.isEnabled
																? 'font-medium text-[#005b2e]'
																: 'font-medium text-[#b3170a]'
														}
														color={
															featureFlag.isEnabled
																? 'success'
																: 'danger'
														}>
														{featureFlag.isEnabled ? 'TRUE' : 'FALSE'}
													</td>
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
																setIdDeleting(featureFlag._id)
															}>
															<Icon icon='Delete' />
														</Button>
													</td>
												</tr>
												<FeatureFlagForm
													mode='edit'
													targetGroups={targetGroups}
													featureFlag={featureFlag}
													featureFlagId={featureFlag._id}
													onEdit={handleUpdate}
													isShown={editFormShowing === index}
													setIsShown={() => setEditFormShowing(-1)}
												/>
												<Modal
													onClick={() => setIdDeleting(null)}
													titleId={featureFlag._id}
													size='sm'
													isCentered
													isOpen={idDeleting === featureFlag._id}
													setIsOpen={() => {}}>
													<ModalHeader
														onClick={(e) => e.stopPropagation()}>
														<ModalTitle id={featureFlag._id}>
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
																handleDelete(featureFlag._id)();
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
					<FeatureFlagForm
						mode='create'
						targetGroups={targetGroups}
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

export default FeatureFlag;
