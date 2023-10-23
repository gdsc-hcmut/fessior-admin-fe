import React, { useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { Add, Delete } from '../../components/icon/material-icons';
import AccessLevelApi from '../../common/services/accessLevel.service';

interface AccessLevel {
	_id: string;
	name: string;
	permissions: string[];
	createdBy: string;
	createAt: string;
}

const PageAccessLevel: NextPage = () => {
	const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
	const [forceRendering, setForceRendering] = useState<boolean>(false);

	const deleteAccessLevel = async (id: string): Promise<void> => {
		try {
			await AccessLevelApi.deleteAccessLevel(id);
			setForceRendering(!forceRendering);
		} catch (error) {
			console.log(error);
		}
	};

	const getAllAccessLevel = async (): Promise<void> => {
		try {
			const response = await AccessLevelApi.getAll();
			console.log(typeof response.data?.payload?.accessLevels[0]?.createAt);
			setAccessLevels(response.data?.payload?.accessLevels || []);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getAllAccessLevel();
	}, [forceRendering]);

	return (
		<PageWrapper>
			<Head>Access Levels</Head>
			<Page>
				<Card>
					<CardHeader>
						<CardTitle tag='h4' className='h5'>
							Access Levels
						</CardTitle>
						<CardActions>
							<Button
								color='info'
								isLight
								tag='button'
								target='_blank'
								download
								className='flex justify-center'>
								<Add style={{ fontSize: 'large' }} />
								<span>Create Access Level</span>
							</Button>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									{/* <th>Id</th> */}
									<th>Name</th>
									<th>Permissions</th>
									<th>Created By</th>
									<th>Created At</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{accessLevels.map((item) => {
									return (
										<tr key={item._id}>
											{/* <th>{item.id}</th> */}
											<th>{item.name}</th>
											<th className='truncate w-[200px]'>
												{item.permissions.map((permission) => {
													return (
														<div
															key={permission}
															className='flex flex-col'>
															<span>{permission}</span>
															<span>&nbsp;</span>
														</div>
													);
												})}
											</th>
											<th>{item.createdBy}</th>
											<th>{item.createAt}</th>
											<th>
												<Button
													className='flex bg-red-200 p-2'
													color='dark'
													isLight
													onClick={() => deleteAccessLevel(item._id)}>
													<Delete
														style={{ color: 'red', fontSize: 'medium' }}
													/>
												</Button>
											</th>
										</tr>
									);
								})}
							</tbody>
						</table>
					</CardBody>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default PageAccessLevel;
