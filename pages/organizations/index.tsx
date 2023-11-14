// LIB
import { useState, useEffect, Fragment } from 'react';
// SERVICE
import OrganizationService from '../../common/services/organization.service';
import DomainService from '../../common/services/domain.service';
// HELPER
import textShortener from '../../helpers/textShortener';
// TYPE
import IOrganization from '../../type/organization-type';
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
import OrganizationForm from '../../components/OrganizationForm';
import Tooltips from '../../components/bootstrap/Tooltips';
import Modal, {
	ModalTitle,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../components/bootstrap/Modal';
import { ToastContainer } from '../../components/bootstrap/Toasts';

const MAX_DOMAINS_SHOWN = 3;
const MAX_NAME_LENGTH = 20;

const Organization = () => {
	const [organizations, setOrganizations] = useState<IOrganization[] | null>(null);
	const [domains, setDomains] = useState<string[] | null>(null);
	const [idDeleting, setIdDeleting] = useState<string | null>(null);
	const [editFormShowing, setEditFormShowing] = useState(-1);
	const [createFormShowing, setCreateFormShowing] = useState(false);
	const [toastInfo, setToastInfo] = useState<{ isSuccess: boolean; message: string } | null>(
		null,
	);

	useEffect(() => {
		(async () => {
			const [organizationsInitial, domainsInitial] = await Promise.all([
				OrganizationService.getAll(),
				DomainService.getAll(),
			]);
			setOrganizations(organizationsInitial);
			setDomains(domainsInitial);
		})();
	}, []);

	if (!organizations || !domains) return null;

	const setToast = (message: string, isSuccess: boolean = true) => {
		setToastInfo({
			isSuccess,
			message,
		});
		setTimeout(() => {
			setToastInfo(null);
		}, 3000);
	};

	const renderDomains = (organization: IOrganization) => {
		const domainsAllowed =
			organization.domains.length > MAX_DOMAINS_SHOWN
				? organization.domains.slice(0, MAX_DOMAINS_SHOWN)
				: organization.domains;
		const remaining = organization.domains.slice(MAX_DOMAINS_SHOWN);

		console.log(domainsAllowed);

		return (
			<>
				{domainsAllowed.map((domain) => (
					<Button
						key={domain}
						className='text-[#323232] mx-px'
						color='dark'
						isOutline
						isDisable>
						{domain}
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
		organizationId: string,
		shortName: string,
		longName: string,
		domainValues: string[],
		managers: string[],
	) => {
		return async () => {
			const newOrganization = {
				shortName,
				longName,
				domains: domainValues,
				managers,
			} as IOrganization;

			try {
				await OrganizationService.update(organizationId, newOrganization);
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
				return;
			}

			setToast('Update successfully');

			setOrganizations(
				organizations.map((organization) =>
					organization._id === organizationId
						? {
								...organization,
								shortName,
								longName,
								domains: domainValues,
								managers,
						  }
						: organization,
				),
			);
		};
	};

	const handleCreate = (
		shortName: string,
		longName: string,
		domainValues: string[],
		managers: string[],
	) => {
		return async () => {
			const newOrganization = {
				shortName,
				longName,
				domains: domainValues,
				managers,
			} as IOrganization;

			try {
				const response = await OrganizationService.create(newOrganization);
				setToast('Create successfully');
				setOrganizations(organizations.concat([response]));
			} catch (e: any) {
				console.log(e);
				setToast(e.response.data.message, false);
			}
		};
	};

	const handleDelete = (id: string) => {
		return async () => {
			try {
				await OrganizationService.deleteById(id);
				setToast('Delete successfully');
				setOrganizations(organizations.filter((organization) => organization._id !== id));
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
								<CardTitle className='h3'>Organizations</CardTitle>
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
										<th>Long Name</th>
										<th>Domains</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{organizations.map(
										(organization: IOrganization, index: number) => (
											<Fragment key={organization._id}>
												<tr>
													<td>{index + 1}</td>
													<td>
														{textShortener(
															organization.longName,
															MAX_NAME_LENGTH,
														)}
													</td>
													<td>{renderDomains(organization)}</td>
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
																setIdDeleting(organization._id)
															}>
															<Icon icon='Delete' />
														</Button>
													</td>
												</tr>
												<OrganizationForm
													mode='edit'
													domainOptions={domains}
													organization={organization}
													onEdit={handleUpdate}
													isShown={editFormShowing === index}
													setIsShown={() => setEditFormShowing(-1)}
												/>
												<Modal
													onClick={() => setIdDeleting(null)}
													titleId={organization._id}
													size='sm'
													isCentered
													isOpen={idDeleting === organization._id}
													setIsOpen={() => {}}>
													<ModalHeader
														onClick={(e) => e.stopPropagation()}>
														<ModalTitle id={organization._id}>
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
																handleDelete(organization._id)();
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
					<OrganizationForm
						mode='create'
						domainOptions={domains}
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

export default Organization;
