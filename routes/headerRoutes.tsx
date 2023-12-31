import React from 'react';
import { dashboardPagesMenu, demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';
import DefaultHeader from '../pages/_layout/_headers/DefaultHeader';

const headers = [
	{ path: pageLayoutTypesPagesMenu.pageLayout.subMenu.onlySubheader.path, element: null },
	{ path: pageLayoutTypesPagesMenu.pageLayout.subMenu.onlyContent.path, element: null },
	{ path: pageLayoutTypesPagesMenu.blank.path, element: null },
	{ path: demoPagesMenu.login.path, element: null },
	{ path: demoPagesMenu.signUp.path, element: null },
	{ path: demoPagesMenu.page404.path, element: null },
	{
		path: `/*`,
		element: <DefaultHeader />,
	},
];

export default headers;
