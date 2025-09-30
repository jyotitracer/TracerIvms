import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

// Importing all required components for the routes
import LoginPage from '../views/Login.vue';
import MenuPage from '../views/MenuPage.vue';
import SplashScreen from '../views/SplashScreen.vue';
import GroupPage from '../views/NavigationPages/Group.vue';
import MapPage from '../views/NavigationPages/MapPage.vue';
import Notification from '../views/NavigationPages/Notification.vue';
import Favorite from '../views/NavigationPages/Favorite.vue';
import EventReport from '../views/NavigationPages/EventReport.vue';
import FuelReport from '../views/NavigationPages/FuelReport.vue';
import Setting from '../views/NavigationPages/Setting.vue';
import SelectHomeScreen from '../views/SettingsPages/SelectHomeScreen.vue';
import EventNotiList from '@/views/SettingsPages/EventNotiList.vue';
import VehicleStatus from '@/views/SettingsPages/VehicleStatus.vue';
import About from '@/views/SettingsPages/About.vue';
import GroupPageFromDashboard from '@/views/DashboardPages/GroupPageFromThisMonth.vue';
import GroupPageFromToday from '@/views/DashboardPages/GroupPageFromToday.vue';
import VehicleDetailMap_info_trip from '@/views/GroupPages/VehicleDetailMap_info_trip.vue';
import VehicleInfoDetails from '@/views/GroupPages/VehicleInfoDetails.vue';
import VehicleMapDetails from '@/views/GroupPages/VehicleMapDetails.vue';
import VehicleTripDetails from '@/views/GroupPages/VehicleTripDetails.vue';
import VehiclesListDetails from '@/views/GroupPages/VehiclesListDetails.vue';
import SelectEvent from '@/views/EventReportPages/SelectEvent.vue';
import SelectGroup from '@/views/EventReportPages/SelectGroup.vue';
import SelectVehicle from '@/views/EventReportPages/SelectVehicle.vue';
import SelectVehicleFuel from '@/views/FuelReportPages/SelectVehicleFuel.vue';
import SelectGroupFuel from '@/views/FuelReportPages/SelectGroupFuel.vue';
import FuelFillingdropping from '@/views/FuelReportPages/FuelFillingdropping.vue';
import FuelChart from '@/views/FuelReportPages/FuelChart.vue';
import MapLayer from '@/views/MapPages/MapLayer.vue';
import NearestVehicle from '@/views/MapPages/NearestVehicle.vue';
import SearchClosestVehLand from '@/views/MapPages/SearchClosestVehLand.vue';
import SearchLandmark from '@/views/MapPages/SearchLandmark.vue';
import SearchVehicle from '@/views/MapPages/SearchVehicle.vue';
import SelectGroupMap from '@/views/MapPages/SelectGroupMap.vue';
import SetHomeLocation from '@/views/MapPages/SetHomeLocation.vue';
import SettingMap from '@/views/MapPages/SettingMap.vue';
import SetZoomLevel from '@/views/MapPages/SetZoomLevel.vue';
import ShowTrip from '@/views/MapPages/ShowTrip.vue';
import Statusofvehicle from '@/views/MapPages/mapStatusofvehicle.vue';
import TripSummaryVehiclewise from '@/views/MapPages/TripSummaryVehiclewise.vue';
import TripVehicleList from '@/views/MapPages/TripVehicleList.vue';
import navigationHistoryStore from '@/services/navigationHistory';
import PieChartView from '@/components/PieChartView.vue';
import SelectPeriod from '@/views/EventReportPages/SelectPeriod.vue';
import DashboardTodaySelectPeriod from '@/views/DashboardPages/DashboardTodaySelectPeriod.vue';
import DashboardMonthSelectPeriod from '@/views/DashboardPages/DashboardMonthSelectPeriod.vue';
import Snackbar from '@/components/Snackbar.vue';
import TourPage from '@/views/TourPage.vue';
import FuelSelectPeriod from '@/views/FuelReportPages/FuelSelectPeriod.vue';
import GroupMapLayer from '@/views/GroupPages/GroupMapLayer.vue';
import GroupSearchVehicle from '@/views/GroupPages/GroupSearchVehicle.vue';
import Testfile from '@/views/testfile.vue';


// Define route configurations
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/splash', // Redirect to splash page
  },
  {
    path: '/splash',
    component: SplashScreen,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path:'/groupmaplayer',
    component: GroupMapLayer,
  },
  
  {
    path:'/groupsearchvehiclemap',
    component: GroupSearchVehicle,
  },
  // {
  //   path: '/vehtabs/:vehicleId/:vehicleName',
  //   component: VehicleDetailMap_info_trip,
  //   name: 'VehcileMapInfoTripPage',
  //   props: true,
  //   children: [
  //     {
  //       path: '/',
  //       redirect: 'map',
  //     },
  //     {
  //       path: 'map',
  //       component: VehicleMapDetails,
  //       props: true,
  //     },
  //     {
  //       path: 'info',
  //       component: VehicleInfoDetails,
  //       props: true,
  //     },
  //     {
  //       path: 'trip',
  //       component: VehicleTripDetails,
  //       props: true,
  //     },
  //   ],
  // },

  {
    path: '/vehtabs/:vehicleId/:vehicleName/:groupname',
    component: VehicleDetailMap_info_trip,
    name: 'VehcileMapInfoTripPage',
    props: true,
    children: [
      {
        path: '',
        redirect: 'map',
      },
      {
        path: 'map',
        component: VehicleMapDetails,
        props: true,
      },
      {
        path: 'info',
        component: VehicleInfoDetails,
        props: true,
      },
      {
        path: 'trip',
        component: VehicleTripDetails,
        props: true,
      },
    ],
  },
  {
    path: '/selectevent',
    component: SelectEvent,
  },
  {
    path: '/selectperiod',
    component: SelectPeriod,
  },
  {
    path: '/selectgroup',
    component: SelectGroup,
  },
  {
    path: '/fuelselectperiod',
    component: FuelSelectPeriod,
  },
  {
    path: '/selectvehiclefuel',
    component: SelectVehicleFuel,
  },
  {
    path: '/selectgroupfuel',
    component: SelectGroupFuel,
  },
  {
    path: '/selectvehicle',
    component: SelectVehicle,
  },
  {
    path: '/fuelfilldrop/:fromdate/:todate/:vehid',
    name: 'fuelFillingDropping',
    component: FuelFillingdropping,
  },
  {
    path: '/fuelchart/:fromdate/:todate/:vehid',
    name: 'fuelChart',
    component: FuelChart,
  },
  {
    path: '/vehlistdet/:group',
    name: 'DetailVehicle',
    component: VehiclesListDetails,
    props: true,
  },
 
  {
    path: '/grouptoday/:currentDate',
    name: 'grouptoday',
    component: GroupPageFromToday,
  },
  {
    path: '/groupmonth/:fromdate/:todate',
    name: 'groupmonth',
    component: GroupPageFromDashboard,
  },
  {
    path: '/sethome',
    component: SelectHomeScreen,
  },
  {
    path: '/eventnoti',
    component: EventNotiList,
  },
  {
    path: '/vehstatus',
    component: VehicleStatus,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/maplayer',
    component: MapLayer,
  },
  {
    path: '/nearestvehicle',
    component: NearestVehicle,
  },
  {
    path: '/searchclosestland',
    component: SearchClosestVehLand,
  },
  {
    path: '/searchland',
    component: SearchLandmark,
  },
  {
    path: '/searchgoupmap',
    component: SelectGroupMap,
  },
  {
    path: '/sethomemap',
    component: SetHomeLocation,
  },
  {
    path: '/searchvehiclemap',
    component: SearchVehicle,
  },
  {
    path: '/settingmap',
    component: SettingMap,
  },
  {
    path: '/setzoom',
    component: SetZoomLevel,
  },
  {
    path: '/showtrip',
    component: ShowTrip,
  },
  {
    path: '/statusofvehi',
    component: Statusofvehicle,
  },
 
  {
    path: '/tripvehiwise',
    component: TripSummaryVehiclewise,
  },
 
  {
    path: '/dashPeriodtoday/:currentDate',
    name:'Periodtoday',
    component: DashboardTodaySelectPeriod,
  },
  {
    path: '/dashPeriodmonth/:fromdate/:todate',
    name:'Periodmonth',
    component: DashboardMonthSelectPeriod,
  },
  {
    path: '/tourpage/:pageid/',
    name: 'TourPage',
    component: TourPage,
  },
  {
    path: '/Menu',
    component: MenuPage,
    children: [
      {
        path: '/today',
        name: 'today',
        component: () => import('@/views/NavigationPages/TodaysPage.vue'),
      },
      {
        path: '/month',
        name: 'month',
        component: () => import('@/views/NavigationPages/ThisMonthPage.vue'),
      },
      {
        path: '/group',
        name: 'group',
        component: GroupPage,
      },
      {
        path: '/mappage/:vehLat/:vehLon/:arrayData',
        name: 'map',
        component: MapPage,
      },
      {
        path: '/notipage',
        name: 'noti',
        component: Notification,
      },
      {
        path: '/favpage',
        name: 'fav',
        component: Favorite,
      },
      {
        path: '/eventreport',
        name: 'event',
        component: EventReport,
      },
      {
        path: '/fuelreport',
        name: 'fuel',
        component: FuelReport,
        meta: {
          keepAlive: true // Enable keep-alive
        }
      },
      {
        path: '/settingpage',
        name: 'setting',
        component: Setting,
      },
    ],
  },
  {
    path: '/test',
    component: Testfile,
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  // Attach from.path to the `to` route's `meta`
  to.meta.previousPath = from.path;
  next();
});

// Export the router instance
export default router;
