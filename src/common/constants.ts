import { Capacitor } from '@capacitor/core';
import storage from '@/services/storagefile';

//
// STEP 1: Pick the correct key depending on platform + country
//

declare global {
  interface Window {
    NativeBridge: any;
  }
}

export async function getGoogleMapKey(): Promise<string> {
  const platform = Capacitor.getPlatform();

  // Default key fallback
  let googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_WEB_DEFAULT_KEY;

  try {
    // Read login_data from storage
    const { value } = await storage.get('login_data');
    if (value) {
      const loginData = JSON.parse(value);
      const countryName = loginData?.countryName || "India";

      console.log("Detected country:", countryName, "Platform:", platform);

      if (platform === 'android') {
        if (countryName === "India") {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_ANDROID_INDIA_KEY;

        } else if (countryName === "USA") {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_ANDROID_USA_KEY;
        } else {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_ANDROID_DEFAULT_KEY;
        }

     await (window as any).NativeBridge?.setMapsApiKey({ key: googleKey });

      } else if (platform === 'ios') {
        if (countryName === "India") {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_IOS_INDIA_KEY;
        } else {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_IOS_DEFAULT_KEY;
        }
      } else {
        if (countryName === "India") {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_WEB_INDIA_KEY;
        } else {
          googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_WEB_DEFAULT_KEY;
        }
      }
    }
  } catch (err) {
    console.error("Error fetching login_data from storage:", err);
  }
  console.log("googleKey",googleKey+"");
  return googleKey;
}

//
// STEP 2: Constants class for all common values
//
class Constants {
  public static First_API_URL = "https://www.tracerivms.com/tbe01_new/index.php/api/v1/getDomain/getDomain";
  public static Url_Prefix = "https://";
  public static Url_Postfix = "/tbe01_new/index.php/api/v1/";

  // Cache for Google Map Key
  private static _googleKey: string | null = null;

  // Async getter for Google Maps key
  public static async getGoogleMapAPI(): Promise<string> {
    if (!this._googleKey) {
      this._googleKey = await getGoogleMapKey();
    }
    return this._googleKey;
  }

  public static PROD_VER = false;
  public static VER_STR = "4.01";
  public static DEBUG = false;
  public static TIMEOUT_MS = 180000;
  public static MODE = "DEV"; // "LIVE" "DEV"

  public static CONT = {
    Login_Contro: "login",
    Mobile_Contro: "mob_api_v4",
  };

  public static CMD = {
    LOGIN: "login",
    Req_Group: "req_group",
    Req_Dash_All: "req_dash_per",
    Req_Color: "req_sts_clr",
    Req_Vehi_info: "req_veh_info",
    Req_Vehi_trip: "req_veh_trip",
    Req_trip_path: "req_trip_path",
    Req_Noti: "req_noti",
    Req_Event_List: "req_event_list",
    Req_Event_Report: "req_event_report",
    Req_Fuel_Efficiency_Report: "req_fuel_report",
    Req_Fill_Drop_Report: "req_fill_drop_infuel",
    Req_Fill_Drop: "req_fill_drop",
    Req_Fuel_graph: "req_fuelgraph",
    Req_Take_Tour: "req_taketour",
    LOGOUT: "logout",
  };

  public static Veh_color = {
    Key_Active_Color: '#68c521',
    key_Stopped_Color: '#078dfc',
    Key_Offline_Color: '#a9a9a9',
    Key_Idle_Color: '#fe6911',
    Key_Towing_Color: "fe6911"
  };

  public static storageValue = {
    Key_Todays: 'todaysData',
    Key_TodaysGroup: 'todaysGroupData',
    key_date_today: 'todaydate',

    Key_Month: 'MonthsData',
    Key_MonthGroup: 'MonthsGroupData',

    key_date_from: 'fromdate',
    key_date_to: 'todate',
    Key_Fav_data: 'favItem',

    Key_GroupAPI: "groupApi",
    key_GroupWithStatus: "groupnamestatus",
    key_VehicleDetails: "vehicledtlstatus",

    key_Fuel_GroupWithStatus: "fuelgroupnamestatus",
    key_Fuel_VehicleDetails: "fuelvehicledtlstatus",

    key_Map_GroupWithStatus: "mapgroupnamestatus",
    Key_Fav_data_group: 'favItemGroup'
  };

  public static eventType = {
    Event_Type_Moving: "1",
    Event_Type_Idel: "2",
    Event_Type_Stopped: "3",
    Event_Type_NoData: "7",
    Event_Type_IG_ON_NoGPS: "5",
    Event_Type_IG_OFF_NoGPS: "6",
  };
}

export default Constants;
