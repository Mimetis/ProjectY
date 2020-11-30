// @ts-check
import router from "./router.js";
import { dashboardPage } from "./dashboard/index.js";
import { enginesPage, engineDetailsPage } from "./engines/index.js";
import { adminPage, adminDeploymentEnginePage, adminEngineRequestDetailsPage } from "./admin/index.js";
import { mgtloader } from "./mgt.js";
import { notification } from "./notification.js";
import { homePage } from "./home/homePage.js";
import { settingsPage } from "./settings/settingsPage.js";
import { auth } from "./auth.js"
import { dotmimtable } from "./dotmimtable"
import { personFormatters } from './formatters/index.js'
import { dataSourceNew, dataSourcesPage, dataSourceEdit } from './dataSources/index.js'
import { entitiesPage, entitiesNewPage, entitiesDetailsPage, entitiesNewVersionPage } from './entities/index.js'
import d from './extensions.js';

dotmimtable.initialize();

// Initialize home page to register notifications
homePage.current.initialize();

// Initialize auth helper
auth.current.initialize();


mgtloader.setMgtProvider();
mgtloader.interceptMgtLogin();

router.register('/Dashboard', dashboardPage);
router.register('/Dashboard/Index', dashboardPage);
router.register('/Engines', enginesPage);
router.register('/Engines/Index', enginesPage);
router.register('/Engines/Details', engineDetailsPage);
router.register('/Admin/Index', adminPage);
router.register('/Admin', adminPage);
router.register('/Settings/Index', settingsPage);
router.register('/Settings', settingsPage);
router.register('/Admin/Details', adminEngineRequestDetailsPage);
router.register('/Admin/Deploy', adminDeploymentEnginePage);
router.register('/DataSources', dataSourcesPage);
router.register('/DataSources/New', dataSourceNew);
router.register('/DataSources/Edit', dataSourceEdit);
router.register('/Entities', entitiesPage);
router.register('/Entities/New', entitiesNewPage);
router.register('/Entities/Details', entitiesDetailsPage);
router.register('/Entities/Version', entitiesNewVersionPage);
