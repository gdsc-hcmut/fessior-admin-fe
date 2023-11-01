import { useState, useEffect, Fragment } from 'react';
import FeatureFlagService from '../../common/services/feature-flag.service';
import TargetGroupService from '../../common/services/target-group.service';
import { targetGroupsIdToName } from '../../helpers/helpers';
import IFeatureFlag, { TKey, IPlatform } from '../../type/feature-flag-type';
import ITargetGroup from '../../type/target-group-type';
import { AuthContextProvider } from '../../context/authContext';
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

// const PLATFORMS = ['web', 'android', 'ios'];
const MAX_TARGET_GROUPS_SHOWN = 3;

const FeatureFlag = () => {
	const [featureFlags, seIFeatureFlags] = useState<IFeatureFlag[] | null>(null);
	const [targetGroupsObjects, seITargetGroupsObjects] = useState<ITargetGroup[] | null>(null);
	const [editFormShowing, setEditFormShowing] = useState(-1);
	const [createFormShowing, setCreateFormShowing] = useState(false);
	const [deleteModalShowing, setDeleteModalShowing] = useState(-1);

	useEffect(() => {
		(async () => {
			const [featureFlagsInitial, targetGroupsInitial] = await Promise.all([
				FeatureFlagService.getAll(),
				TargetGroupService.getAll(),
			]);
			seIFeatureFlags(
				featureFlagsInitial.map((featureFlag: IFeatureFlag) => {
					return {
						...featureFlag,
						targetGroups: targetGroupsIdToName(
							featureFlag.targetGroups,
							targetGroupsInitial,
						),
					};
				}),
			);
			seITargetGroupsObjects(targetGroupsInitial);
		})();
	}, []);

	if (!featureFlags || !targetGroupsObjects) {
		return null;
	}

	const renderTargetGroups = (featureFlag: IFeatureFlag) => {
		const targetGroupsAllowed =
			featureFlag.targetGroups.length > MAX_TARGET_GROUPS_SHOWN
				? featureFlag.targetGroups.slice(0, 3)
				: featureFlag.targetGroups;
		const remaining = featureFlag.targetGroups.slice(3);

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
					(name) =>
						targetGroupsObjects.find((targetGroup) => targetGroup.name === name)!._id,
				),
				isEnabled,
			} as IFeatureFlag;

			try {
				await FeatureFlagService.update(featureFlagId, newFeatureFlag);
			} catch (e) {
				console.log(e);
				return;
			}

			seIFeatureFlags(
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
		key: TKey,
		description: string,
		targetGroupsNames: string[],
		isEnabled: boolean,
	) => {
		return async () => {
			const newFeatureFlag = {
				key,
				description,
				targetGroups: targetGroupsNames.map(
					(name) =>
						targetGroupsObjects.find((targetGroup) => targetGroup.name === name)!._id,
				),
				platforms: [] as IPlatform[],
				isEnabled,
			} as IFeatureFlag;

			try {
				const response = await FeatureFlagService.create(newFeatureFlag);
				seIFeatureFlags(
					featureFlags.concat([
						{
							...response,
							targetGroups: targetGroupsIdToName(
								response.targetGroups,
								targetGroupsObjects,
							),
						},
					]),
				);
			} catch (e) {
				console.log(e);
			}
		};
	};

	const handleDelete = (id: string) => {
		return async () => {
			try {
				await FeatureFlagService.deleteById(id);
				seIFeatureFlags(featureFlags.filter((featureFlag) => featureFlag._id !== id));
			} catch (e) {
				console.log(e);
			}
		};
	};

	return (
		<AuthContextProvider>
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
													<td>{featureFlag.description}</td>
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
																setDeleteModalShowing(index)
															}>
															<Icon icon='Delete' />
														</Button>
													</td>
												</tr>
												<FeatureFlagForm
													mode='edit'
													targetGroupsObjects={targetGroupsObjects}
													featureFlag={featureFlag}
													featureFlagId={featureFlag._id}
													onEdit={handleUpdate}
													isShown={editFormShowing === index}
													setIsShown={() => setEditFormShowing(-1)}
												/>
												<Modal
													onClick={() => setDeleteModalShowing(-1)}
													titleId={featureFlag._id}
													size='sm'
													isCentered
													isOpen={deleteModalShowing === index}
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
																setDeleteModalShowing(-1);
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
						targetGroupsObjects={targetGroupsObjects}
						onCreate={handleCreate}
						isShown={createFormShowing}
						setIsShown={() => setCreateFormShowing(false)}
					/>
				</Page>
			</Content>
		</AuthContextProvider>
	);
};

export default FeatureFlag;
