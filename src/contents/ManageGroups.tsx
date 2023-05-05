import cssText from "data-text:../base.css"
import type { PlasmoGetInlineAnchor } from "plasmo"
import { AiOutlineClose } from "react-icons/ai"
import {
  FcAddColumn,
  FcAddDatabase,
  FcAddImage,
  FcAddRow,
  FcAddressBook,
  FcAdvance,
  FcAdvertising,
  FcAlarmClock,
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcAndroidOs,
  FcAnswers,
  FcApproval,
  FcApprove,
  FcAreaChart,
  FcAssistant,
  FcAudioFile,
  FcAutomatic,
  FcAutomotive,
  FcBadDecision,
  FcBarChart,
  FcBbc,
  FcBearish,
  FcBinoculars,
  FcBiohazard,
  FcBiomass,
  FcBiotech,
  FcBookmark,
  FcBriefcase,
  FcBrokenLink,
  FcBullish,
  FcBusiness,
  FcBusinessContact,
  FcBusinessman,
  FcBusinesswoman,
  FcButtingIn,
  FcCableRelease,
  FcCalculator,
  FcCalendar,
  FcCallTransfer,
  FcCallback,
  FcCamcorder,
  FcCamcorderPro,
  FcCamera,
  FcCameraAddon,
  FcCameraIdentification,
  FcCancel,
  FcCandleSticks,
  FcCapacitor,
  FcCdLogo,
  FcCellPhone,
  FcChargeBattery,
  FcCheckmark,
  FcCircuit,
  FcClapperboard,
  FcClearFilters,
  FcClock,
  FcCloseUpMode,
  FcCloth,
  FcCollaboration,
  FcCollapse,
  FcCollect,
  FcComboChart,
  FcCommandLine,
  FcComments,
  FcCompactCamera,
  FcConferenceCall,
  FcContacts,
  FcCopyleft,
  FcCopyright,
  FcCrystalOscillator,
  FcCurrencyExchange,
  FcCursor,
  FcCustomerSupport,
  FcDam,
  FcDataBackup,
  FcDataConfiguration,
  FcDataEncryption,
  FcDataProtection,
  FcDataRecovery,
  FcDataSheet,
  FcDatabase,
  FcDebian,
  FcDebt,
  FcDecision,
  FcDeleteColumn,
  FcDeleteDatabase,
  FcDeleteRow,
  FcDepartment,
  FcDeployment,
  FcDiploma1,
  FcDiploma2,
  FcDisapprove,
  FcDisclaimer,
  FcDislike,
  FcDisplay,
  FcDoNotInhale,
  FcDoNotInsert,
  FcDoNotMix,
  FcDocument,
  FcDonate,
  FcDoughnutChart,
  FcDown,
  FcDownLeft,
  FcDownRight,
  FcDownload,
  FcDribbble,
  FcDvdLogo,
  FcEditImage,
  FcElectricalSensor,
  FcElectricalThreshold,
  FcElectricity,
  FcElectroDevices,
  FcElectronics,
  FcEmptyBattery,
  FcEmptyFilter,
  FcEmptyTrash,
  FcEndCall,
  FcEngineering,
  FcEnteringHeavenAlive,
  FcExpand,
  FcExpired,
  FcExport,
  FcExternal,
  FcFactory,
  FcFactoryBreakdown,
  FcFaq,
  FcFeedIn,
  FcFeedback,
  FcFile,
  FcFilingCabinet,
  FcFilledFilter,
  FcFilm,
  FcFilmReel,
  FcFinePrint,
  FcFlashAuto,
  FcFlashOff,
  FcFlashOn,
  FcFlowChart,
  FcFolder,
  FcFrame,
  FcFullBattery,
  FcFullTrash,
  FcGallery,
  FcGenealogy,
  FcGenericSortingAsc,
  FcGenericSortingDesc,
  FcGlobe,
  FcGoodDecision,
  FcGoogle,
  FcGraduationCap,
  FcGrid,
  FcHeadset,
  FcHeatMap,
  FcHighBattery,
  FcHighPriority,
  FcHome,
  FcIcons8Cup,
  FcIdea,
  FcImageFile,
  FcImport,
  FcInTransit,
  FcInfo,
  FcInspection,
  FcIntegratedWebcam,
  FcInternal,
  FcInvite,
  FcIpad,
  FcIphone,
  FcKey,
  FcKindle,
  FcLandscape,
  FcLeave,
  FcLeft,
  FcLeftDown,
  FcLeftDown2,
  FcLeftUp,
  FcLeftUp2,
  FcLibrary,
  FcLightAtTheEndOfTunnel,
  FcLike,
  FcLikePlaceholder,
  FcLineChart,
  FcLink,
  FcLinux,
  FcList,
  FcLock,
  FcLockLandscape,
  FcLockPortrait,
  FcLowBattery,
  FcLowPriority,
  FcMakeDecision,
  FcManager,
  FcMediumPriority,
  FcMenu,
  FcMiddleBattery,
  FcMindMap,
  FcMinus,
  FcMissedCall,
  FcMms,
  FcMoneyTransfer,
  FcMultipleCameras,
  FcMultipleDevices,
  FcMultipleInputs,
  FcMultipleSmartphones,
  FcMusic,
  FcNegativeDynamic,
  FcNeutralDecision,
  FcNeutralTrading,
  FcNews,
  FcNext,
  FcNfcSign,
  FcNightLandscape,
  FcNightPortrait,
  FcNoIdea,
  FcNoVideo,
  FcNook,
  FcNumericalSorting12,
  FcNumericalSorting21,
  FcOk,
  FcOldTimeCamera,
  FcOnlineSupport,
  FcOpenedFolder,
  FcOrgUnit,
  FcOrganization,
  FcOvertime,
  FcPackage,
  FcPaid,
  FcPanorama,
  FcParallelTasks,
  FcPhone,
  FcPhoneAndroid,
  FcPhotoReel,
  FcPicture,
  FcPieChart,
  FcPlanner,
  FcPlus,
  FcPodiumWithAudience,
  FcPodiumWithSpeaker,
  FcPodiumWithoutSpeaker,
  FcPortraitMode,
  FcPositiveDynamic,
  FcPrevious,
  FcPrint,
  FcPrivacy,
  FcProcess,
  FcPuzzle,
  FcQuestions,
  FcRadarPlot,
  FcRating,
  FcRatings,
  FcReading,
  FcReadingEbook,
  FcReddit,
  FcRedo,
  FcRefresh,
  FcRegisteredTrademark,
  FcRemoveImage,
  FcReuse,
  FcRight,
  FcRightDown,
  FcRightDown2,
  FcRightUp,
  FcRightUp2,
  FcRotateCamera,
  FcRotateToLandscape,
  FcRotateToPortrait,
  FcRuler,
  FcRules,
  FcSafe,
  FcSalesPerformance,
  FcScatterPlot,
  FcSearch,
  FcSelfServiceKiosk,
  FcSelfie,
  FcSerialTasks,
  FcServiceMark,
  FcServices,
  FcSettings,
  FcShare,
  FcShipped,
  FcShop,
  FcSignature,
  FcSimCard,
  FcSimCardChip,
  FcSlrBackSide,
  FcSmartphoneTablet,
  FcSms,
  FcSoundRecordingCopyright,
  FcSpeaker,
  FcSportsMode,
  FcStackOfPhotos,
  FcStart,
  FcStatistics,
  FcSteam,
  FcStumbleupon,
  FcSupport,
  FcSurvey,
  FcSwitchCamera,
  FcSynchronize,
  FcTabletAndroid,
  FcTemplate,
  FcTimeline,
  FcTodoList,
  FcTouchscreenSmartphone,
  FcTrademark,
  FcTreeStructure,
  FcTwoSmartphones,
  FcUndo,
  FcUnlock,
  FcUp,
  FcUpLeft,
  FcUpRight,
  FcUpload,
  FcUsb,
  FcVideoCall,
  FcVideoFile,
  FcVideoProjector,
  FcViewDetails,
  FcVip,
  FcVlc,
  FcVoicePresentation,
  FcVoicemail,
  FcWebcam,
  FcWiFiLogo,
  FcWikipedia
} from "react-icons/fc"

import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "~components/ui/button"
import { ComboboxDemo } from "~components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "~components/ui/dialog"
import { Input } from "~components/ui/input"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText

  style.textContent += `
    #plasmo-shadow-container {
      position: fixed !important;
      left: 0px;
      top: 0px;
      height: auto;
      width: 100%;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    #plasmo-inline {
      left: -10vw;
    }`
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("body")
}

const icons = [
  {
    icon: <FcAddColumn size={24} />,
    label: "FcAddColumn",
    value: "FcAddColumn"
  },
  {
    icon: <FcAddDatabase size={24} />,
    label: "FcAddDatabase",
    value: "FcAddDatabase"
  },
  { icon: <FcAddImage size={24} />, label: "FcAddImage", value: "FcAddImage" },
  { icon: <FcAddRow size={24} />, label: "FcAddRow", value: "FcAddRow" },
  {
    icon: <FcAddressBook size={24} />,
    label: "FcAddressBook",
    value: "FcAddressBook"
  },
  { icon: <FcAdvance size={24} />, label: "FcAdvance", value: "FcAdvance" },
  {
    icon: <FcAdvertising size={24} />,
    label: "FcAdvertising",
    value: "FcAdvertising"
  },
  {
    icon: <FcAlarmClock size={24} />,
    label: "FcAlarmClock",
    value: "FcAlarmClock"
  },
  {
    icon: <FcAlphabeticalSortingAz size={24} />,
    label: "FcAlphabeticalSortingAz",
    value: "FcAlphabeticalSortingAz"
  },
  {
    icon: <FcAlphabeticalSortingZa size={24} />,
    label: "FcAlphabeticalSortingZa",
    value: "FcAlphabeticalSortingZa"
  },
  {
    icon: <FcAndroidOs size={24} />,
    label: "FcAndroidOs",
    value: "FcAndroidOs"
  },
  { icon: <FcAnswers size={24} />, label: "FcAnswers", value: "FcAnswers" },
  { icon: <FcApproval size={24} />, label: "FcApproval", value: "FcApproval" },
  { icon: <FcApprove size={24} />, label: "FcApprove", value: "FcApprove" },
  {
    icon: <FcAreaChart size={24} />,
    label: "FcAreaChart",
    value: "FcAreaChart"
  },
  {
    icon: <FcAssistant size={24} />,
    label: "FcAssistant",
    value: "FcAssistant"
  },
  {
    icon: <FcAudioFile size={24} />,
    label: "FcAudioFile",
    value: "FcAudioFile"
  },
  {
    icon: <FcAutomatic size={24} />,
    label: "FcAutomatic",
    value: "FcAutomatic"
  },
  {
    icon: <FcAutomotive size={24} />,
    label: "FcAutomotive",
    value: "FcAutomotive"
  },
  {
    icon: <FcBadDecision size={24} />,
    label: "FcBadDecision",
    value: "FcBadDecision"
  },
  { icon: <FcBarChart size={24} />, label: "FcBarChart", value: "FcBarChart" },
  { icon: <FcBbc size={24} />, label: "FcBbc", value: "FcBbc" },
  { icon: <FcBearish size={24} />, label: "FcBearish", value: "FcBearish" },
  {
    icon: <FcBinoculars size={24} />,
    label: "FcBinoculars",
    value: "FcBinoculars"
  },
  {
    icon: <FcBiohazard size={24} />,
    label: "FcBiohazard",
    value: "FcBiohazard"
  },
  { icon: <FcBiomass size={24} />, label: "FcBiomass", value: "FcBiomass" },
  { icon: <FcBiotech size={24} />, label: "FcBiotech", value: "FcBiotech" },
  { icon: <FcBookmark size={24} />, label: "FcBookmark", value: "FcBookmark" },
  {
    icon: <FcBriefcase size={24} />,
    label: "FcBriefcase",
    value: "FcBriefcase"
  },
  {
    icon: <FcBrokenLink size={24} />,
    label: "FcBrokenLink",
    value: "FcBrokenLink"
  },
  { icon: <FcBullish size={24} />, label: "FcBullish", value: "FcBullish" },
  { icon: <FcBusiness size={24} />, label: "FcBusiness", value: "FcBusiness" },
  {
    icon: <FcBusinessContact size={24} />,
    label: "FcBusinessContact",
    value: "FcBusinessContact"
  },
  {
    icon: <FcBusinessman size={24} />,
    label: "FcBusinessman",
    value: "FcBusinessman"
  },
  {
    icon: <FcBusinesswoman size={24} />,
    label: "FcBusinesswoman",
    value: "FcBusinesswoman"
  },
  {
    icon: <FcButtingIn size={24} />,
    label: "FcButtingIn",
    value: "FcButtingIn"
  },
  {
    icon: <FcCableRelease size={24} />,
    label: "FcCableRelease",
    value: "FcCableRelease"
  },
  {
    icon: <FcCalculator size={24} />,
    label: "FcCalculator",
    value: "FcCalculator"
  },
  { icon: <FcCalendar size={24} />, label: "FcCalendar", value: "FcCalendar" },
  {
    icon: <FcCallTransfer size={24} />,
    label: "FcCallTransfer",
    value: "FcCallTransfer"
  },
  { icon: <FcCallback size={24} />, label: "FcCallback", value: "FcCallback" },
  {
    icon: <FcCamcorder size={24} />,
    label: "FcCamcorder",
    value: "FcCamcorder"
  },
  {
    icon: <FcCamcorderPro size={24} />,
    label: "FcCamcorderPro",
    value: "FcCamcorderPro"
  },
  { icon: <FcCamera size={24} />, label: "FcCamera", value: "FcCamera" },
  {
    icon: <FcCameraAddon size={24} />,
    label: "FcCameraAddon",
    value: "FcCameraAddon"
  },
  {
    icon: <FcCameraIdentification size={24} />,
    label: "FcCameraIdentification",
    value: "FcCameraIdentification"
  },
  { icon: <FcCancel size={24} />, label: "FcCancel", value: "FcCancel" },
  {
    icon: <FcCandleSticks size={24} />,
    label: "FcCandleSticks",
    value: "FcCandleSticks"
  },
  {
    icon: <FcCapacitor size={24} />,
    label: "FcCapacitor",
    value: "FcCapacitor"
  },
  { icon: <FcCdLogo size={24} />, label: "FcCdLogo", value: "FcCdLogo" },
  {
    icon: <FcCellPhone size={24} />,
    label: "FcCellPhone",
    value: "FcCellPhone"
  },
  {
    icon: <FcChargeBattery size={24} />,
    label: "FcChargeBattery",
    value: "FcChargeBattery"
  },
  {
    icon: <FcCheckmark size={24} />,
    label: "FcCheckmark",
    value: "FcCheckmark"
  },
  { icon: <FcCircuit size={24} />, label: "FcCircuit", value: "FcCircuit" },
  {
    icon: <FcClapperboard size={24} />,
    label: "FcClapperboard",
    value: "FcClapperboard"
  },
  {
    icon: <FcClearFilters size={24} />,
    label: "FcClearFilters",
    value: "FcClearFilters"
  },
  { icon: <FcClock size={24} />, label: "FcClock", value: "FcClock" },
  {
    icon: <FcCloseUpMode size={24} />,
    label: "FcCloseUpMode",
    value: "FcCloseUpMode"
  },
  { icon: <FcCloth size={24} />, label: "FcCloth", value: "FcCloth" },
  {
    icon: <FcCollaboration size={24} />,
    label: "FcCollaboration",
    value: "FcCollaboration"
  },
  { icon: <FcCollapse size={24} />, label: "FcCollapse", value: "FcCollapse" },
  { icon: <FcCollect size={24} />, label: "FcCollect", value: "FcCollect" },
  {
    icon: <FcComboChart size={24} />,
    label: "FcComboChart",
    value: "FcComboChart"
  },
  {
    icon: <FcCommandLine size={24} />,
    label: "FcCommandLine",
    value: "FcCommandLine"
  },
  { icon: <FcComments size={24} />, label: "FcComments", value: "FcComments" },
  {
    icon: <FcCompactCamera size={24} />,
    label: "FcCompactCamera",
    value: "FcCompactCamera"
  },
  {
    icon: <FcConferenceCall size={24} />,
    label: "FcConferenceCall",
    value: "FcConferenceCall"
  },
  { icon: <FcContacts size={24} />, label: "FcContacts", value: "FcContacts" },
  { icon: <FcCopyleft size={24} />, label: "FcCopyleft", value: "FcCopyleft" },
  {
    icon: <FcCopyright size={24} />,
    label: "FcCopyright",
    value: "FcCopyright"
  },
  {
    icon: <FcCrystalOscillator size={24} />,
    label: "FcCrystalOscillator",
    value: "FcCrystalOscillator"
  },
  {
    icon: <FcCurrencyExchange size={24} />,
    label: "FcCurrencyExchange",
    value: "FcCurrencyExchange"
  },
  { icon: <FcCursor size={24} />, label: "FcCursor", value: "FcCursor" },
  {
    icon: <FcCustomerSupport size={24} />,
    label: "FcCustomerSupport",
    value: "FcCustomerSupport"
  },
  { icon: <FcDam size={24} />, label: "FcDam", value: "FcDam" },
  {
    icon: <FcDataBackup size={24} />,
    label: "FcDataBackup",
    value: "FcDataBackup"
  },
  {
    icon: <FcDataConfiguration size={24} />,
    label: "FcDataConfiguration",
    value: "FcDataConfiguration"
  },
  {
    icon: <FcDataEncryption size={24} />,
    label: "FcDataEncryption",
    value: "FcDataEncryption"
  },
  {
    icon: <FcDataProtection size={24} />,
    label: "FcDataProtection",
    value: "FcDataProtection"
  },
  {
    icon: <FcDataRecovery size={24} />,
    label: "FcDataRecovery",
    value: "FcDataRecovery"
  },
  {
    icon: <FcDataSheet size={24} />,
    label: "FcDataSheet",
    value: "FcDataSheet"
  },
  { icon: <FcDatabase size={24} />, label: "FcDatabase", value: "FcDatabase" },
  { icon: <FcDebian size={24} />, label: "FcDebian", value: "FcDebian" },
  { icon: <FcDebt size={24} />, label: "FcDebt", value: "FcDebt" },
  { icon: <FcDecision size={24} />, label: "FcDecision", value: "FcDecision" },
  {
    icon: <FcDeleteColumn size={24} />,
    label: "FcDeleteColumn",
    value: "FcDeleteColumn"
  },
  {
    icon: <FcDeleteDatabase size={24} />,
    label: "FcDeleteDatabase",
    value: "FcDeleteDatabase"
  },
  {
    icon: <FcDeleteRow size={24} />,
    label: "FcDeleteRow",
    value: "FcDeleteRow"
  },
  {
    icon: <FcDepartment size={24} />,
    label: "FcDepartment",
    value: "FcDepartment"
  },
  {
    icon: <FcDeployment size={24} />,
    label: "FcDeployment",
    value: "FcDeployment"
  },
  { icon: <FcDiploma1 size={24} />, label: "FcDiploma1", value: "FcDiploma1" },
  { icon: <FcDiploma2 size={24} />, label: "FcDiploma2", value: "FcDiploma2" },
  {
    icon: <FcDisapprove size={24} />,
    label: "FcDisapprove",
    value: "FcDisapprove"
  },
  {
    icon: <FcDisclaimer size={24} />,
    label: "FcDisclaimer",
    value: "FcDisclaimer"
  },
  { icon: <FcDislike size={24} />, label: "FcDislike", value: "FcDislike" },
  { icon: <FcDisplay size={24} />, label: "FcDisplay", value: "FcDisplay" },
  {
    icon: <FcDoNotInhale size={24} />,
    label: "FcDoNotInhale",
    value: "FcDoNotInhale"
  },
  {
    icon: <FcDoNotInsert size={24} />,
    label: "FcDoNotInsert",
    value: "FcDoNotInsert"
  },
  { icon: <FcDoNotMix size={24} />, label: "FcDoNotMix", value: "FcDoNotMix" },
  { icon: <FcDocument size={24} />, label: "FcDocument", value: "FcDocument" },
  { icon: <FcDonate size={24} />, label: "FcDonate", value: "FcDonate" },
  {
    icon: <FcDoughnutChart size={24} />,
    label: "FcDoughnutChart",
    value: "FcDoughnutChart"
  },
  { icon: <FcDown size={24} />, label: "FcDown", value: "FcDown" },
  { icon: <FcDownLeft size={24} />, label: "FcDownLeft", value: "FcDownLeft" },
  {
    icon: <FcDownRight size={24} />,
    label: "FcDownRight",
    value: "FcDownRight"
  },
  { icon: <FcDownload size={24} />, label: "FcDownload", value: "FcDownload" },
  { icon: <FcDribbble size={24} />, label: "FcDribbble", value: "FcDribbble" },
  { icon: <FcDvdLogo size={24} />, label: "FcDvdLogo", value: "FcDvdLogo" },
  {
    icon: <FcEditImage size={24} />,
    label: "FcEditImage",
    value: "FcEditImage"
  },
  {
    icon: <FcElectricalSensor size={24} />,
    label: "FcElectricalSensor",
    value: "FcElectricalSensor"
  },
  {
    icon: <FcElectricalThreshold size={24} />,
    label: "FcElectricalThreshold",
    value: "FcElectricalThreshold"
  },
  {
    icon: <FcElectricity size={24} />,
    label: "FcElectricity",
    value: "FcElectricity"
  },
  {
    icon: <FcElectroDevices size={24} />,
    label: "FcElectroDevices",
    value: "FcElectroDevices"
  },
  {
    icon: <FcElectronics size={24} />,
    label: "FcElectronics",
    value: "FcElectronics"
  },
  {
    icon: <FcEmptyBattery size={24} />,
    label: "FcEmptyBattery",
    value: "FcEmptyBattery"
  },
  {
    icon: <FcEmptyFilter size={24} />,
    label: "FcEmptyFilter",
    value: "FcEmptyFilter"
  },
  {
    icon: <FcEmptyTrash size={24} />,
    label: "FcEmptyTrash",
    value: "FcEmptyTrash"
  },
  { icon: <FcEndCall size={24} />, label: "FcEndCall", value: "FcEndCall" },
  {
    icon: <FcEngineering size={24} />,
    label: "FcEngineering",
    value: "FcEngineering"
  },
  {
    icon: <FcEnteringHeavenAlive size={24} />,
    label: "FcEnteringHeavenAlive",
    value: "FcEnteringHeavenAlive"
  },
  { icon: <FcExpand size={24} />, label: "FcExpand", value: "FcExpand" },
  { icon: <FcExpired size={24} />, label: "FcExpired", value: "FcExpired" },
  { icon: <FcExport size={24} />, label: "FcExport", value: "FcExport" },
  { icon: <FcExternal size={24} />, label: "FcExternal", value: "FcExternal" },
  { icon: <FcFactory size={24} />, label: "FcFactory", value: "FcFactory" },
  {
    icon: <FcFactoryBreakdown size={24} />,
    label: "FcFactoryBreakdown",
    value: "FcFactoryBreakdown"
  },
  { icon: <FcFaq size={24} />, label: "FcFaq", value: "FcFaq" },
  { icon: <FcFeedIn size={24} />, label: "FcFeedIn", value: "FcFeedIn" },
  { icon: <FcFeedback size={24} />, label: "FcFeedback", value: "FcFeedback" },
  { icon: <FcFile size={24} />, label: "FcFile", value: "FcFile" },
  {
    icon: <FcFilingCabinet size={24} />,
    label: "FcFilingCabinet",
    value: "FcFilingCabinet"
  },
  {
    icon: <FcFilledFilter size={24} />,
    label: "FcFilledFilter",
    value: "FcFilledFilter"
  },
  { icon: <FcFilm size={24} />, label: "FcFilm", value: "FcFilm" },
  { icon: <FcFilmReel size={24} />, label: "FcFilmReel", value: "FcFilmReel" },
  {
    icon: <FcFinePrint size={24} />,
    label: "FcFinePrint",
    value: "FcFinePrint"
  },
  {
    icon: <FcFlashAuto size={24} />,
    label: "FcFlashAuto",
    value: "FcFlashAuto"
  },
  { icon: <FcFlashOff size={24} />, label: "FcFlashOff", value: "FcFlashOff" },
  { icon: <FcFlashOn size={24} />, label: "FcFlashOn", value: "FcFlashOn" },
  {
    icon: <FcFlowChart size={24} />,
    label: "FcFlowChart",
    value: "FcFlowChart"
  },
  { icon: <FcFolder size={24} />, label: "FcFolder", value: "FcFolder" },
  { icon: <FcFrame size={24} />, label: "FcFrame", value: "FcFrame" },
  {
    icon: <FcFullBattery size={24} />,
    label: "FcFullBattery",
    value: "FcFullBattery"
  },
  {
    icon: <FcFullTrash size={24} />,
    label: "FcFullTrash",
    value: "FcFullTrash"
  },
  { icon: <FcGallery size={24} />, label: "FcGallery", value: "FcGallery" },
  {
    icon: <FcGenealogy size={24} />,
    label: "FcGenealogy",
    value: "FcGenealogy"
  },
  {
    icon: <FcGenericSortingAsc size={24} />,
    label: "FcGenericSortingAsc",
    value: "FcGenericSortingAsc"
  },
  {
    icon: <FcGenericSortingDesc size={24} />,
    label: "FcGenericSortingDesc",
    value: "FcGenericSortingDesc"
  },
  { icon: <FcGlobe size={24} />, label: "FcGlobe", value: "FcGlobe" },
  {
    icon: <FcGoodDecision size={24} />,
    label: "FcGoodDecision",
    value: "FcGoodDecision"
  },
  { icon: <FcGoogle size={24} />, label: "FcGoogle", value: "FcGoogle" },
  {
    icon: <FcGraduationCap size={24} />,
    label: "FcGraduationCap",
    value: "FcGraduationCap"
  },
  { icon: <FcGrid size={24} />, label: "FcGrid", value: "FcGrid" },
  { icon: <FcHeadset size={24} />, label: "FcHeadset", value: "FcHeadset" },
  { icon: <FcHeatMap size={24} />, label: "FcHeatMap", value: "FcHeatMap" },
  {
    icon: <FcHighBattery size={24} />,
    label: "FcHighBattery",
    value: "FcHighBattery"
  },
  {
    icon: <FcHighPriority size={24} />,
    label: "FcHighPriority",
    value: "FcHighPriority"
  },
  { icon: <FcHome size={24} />, label: "FcHome", value: "FcHome" },
  {
    icon: <FcIcons8Cup size={24} />,
    label: "FcIcons8Cup",
    value: "FcIcons8Cup"
  },
  { icon: <FcIdea size={24} />, label: "FcIdea", value: "FcIdea" },
  {
    icon: <FcImageFile size={24} />,
    label: "FcImageFile",
    value: "FcImageFile"
  },
  { icon: <FcImport size={24} />, label: "FcImport", value: "FcImport" },
  {
    icon: <FcInTransit size={24} />,
    label: "FcInTransit",
    value: "FcInTransit"
  },
  { icon: <FcInfo size={24} />, label: "FcInfo", value: "FcInfo" },
  {
    icon: <FcInspection size={24} />,
    label: "FcInspection",
    value: "FcInspection"
  },
  {
    icon: <FcIntegratedWebcam size={24} />,
    label: "FcIntegratedWebcam",
    value: "FcIntegratedWebcam"
  },
  { icon: <FcInternal size={24} />, label: "FcInternal", value: "FcInternal" },
  { icon: <FcInvite size={24} />, label: "FcInvite", value: "FcInvite" },
  { icon: <FcIpad size={24} />, label: "FcIpad", value: "FcIpad" },
  { icon: <FcIphone size={24} />, label: "FcIphone", value: "FcIphone" },
  { icon: <FcKey size={24} />, label: "FcKey", value: "FcKey" },
  { icon: <FcKindle size={24} />, label: "FcKindle", value: "FcKindle" },
  {
    icon: <FcLandscape size={24} />,
    label: "FcLandscape",
    value: "FcLandscape"
  },
  { icon: <FcLeave size={24} />, label: "FcLeave", value: "FcLeave" },
  { icon: <FcLeft size={24} />, label: "FcLeft", value: "FcLeft" },
  { icon: <FcLeftDown size={24} />, label: "FcLeftDown", value: "FcLeftDown" },
  {
    icon: <FcLeftDown2 size={24} />,
    label: "FcLeftDown2",
    value: "FcLeftDown2"
  },
  { icon: <FcLeftUp size={24} />, label: "FcLeftUp", value: "FcLeftUp" },
  { icon: <FcLeftUp2 size={24} />, label: "FcLeftUp2", value: "FcLeftUp2" },
  { icon: <FcLibrary size={24} />, label: "FcLibrary", value: "FcLibrary" },
  {
    icon: <FcLightAtTheEndOfTunnel size={24} />,
    label: "FcLightAtTheEndOfTunnel",
    value: "FcLightAtTheEndOfTunnel"
  },
  { icon: <FcLike size={24} />, label: "FcLike", value: "FcLike" },
  {
    icon: <FcLikePlaceholder size={24} />,
    label: "FcLikePlaceholder",
    value: "FcLikePlaceholder"
  },
  {
    icon: <FcLineChart size={24} />,
    label: "FcLineChart",
    value: "FcLineChart"
  },
  { icon: <FcLink size={24} />, label: "FcLink", value: "FcLink" },
  { icon: <FcLinux size={24} />, label: "FcLinux", value: "FcLinux" },
  { icon: <FcList size={24} />, label: "FcList", value: "FcList" },
  { icon: <FcLock size={24} />, label: "FcLock", value: "FcLock" },
  {
    icon: <FcLockLandscape size={24} />,
    label: "FcLockLandscape",
    value: "FcLockLandscape"
  },
  {
    icon: <FcLockPortrait size={24} />,
    label: "FcLockPortrait",
    value: "FcLockPortrait"
  },
  {
    icon: <FcLowBattery size={24} />,
    label: "FcLowBattery",
    value: "FcLowBattery"
  },
  {
    icon: <FcLowPriority size={24} />,
    label: "FcLowPriority",
    value: "FcLowPriority"
  },
  {
    icon: <FcMakeDecision size={24} />,
    label: "FcMakeDecision",
    value: "FcMakeDecision"
  },
  { icon: <FcManager size={24} />, label: "FcManager", value: "FcManager" },
  {
    icon: <FcMediumPriority size={24} />,
    label: "FcMediumPriority",
    value: "FcMediumPriority"
  },
  { icon: <FcMenu size={24} />, label: "FcMenu", value: "FcMenu" },
  {
    icon: <FcMiddleBattery size={24} />,
    label: "FcMiddleBattery",
    value: "FcMiddleBattery"
  },
  { icon: <FcMindMap size={24} />, label: "FcMindMap", value: "FcMindMap" },
  { icon: <FcMinus size={24} />, label: "FcMinus", value: "FcMinus" },
  {
    icon: <FcMissedCall size={24} />,
    label: "FcMissedCall",
    value: "FcMissedCall"
  },
  { icon: <FcMms size={24} />, label: "FcMms", value: "FcMms" },
  {
    icon: <FcMoneyTransfer size={24} />,
    label: "FcMoneyTransfer",
    value: "FcMoneyTransfer"
  },
  {
    icon: <FcMultipleCameras size={24} />,
    label: "FcMultipleCameras",
    value: "FcMultipleCameras"
  },
  {
    icon: <FcMultipleDevices size={24} />,
    label: "FcMultipleDevices",
    value: "FcMultipleDevices"
  },
  {
    icon: <FcMultipleInputs size={24} />,
    label: "FcMultipleInputs",
    value: "FcMultipleInputs"
  },
  {
    icon: <FcMultipleSmartphones size={24} />,
    label: "FcMultipleSmartphones",
    value: "FcMultipleSmartphones"
  },
  { icon: <FcMusic size={24} />, label: "FcMusic", value: "FcMusic" },
  {
    icon: <FcNegativeDynamic size={24} />,
    label: "FcNegativeDynamic",
    value: "FcNegativeDynamic"
  },
  {
    icon: <FcNeutralDecision size={24} />,
    label: "FcNeutralDecision",
    value: "FcNeutralDecision"
  },
  {
    icon: <FcNeutralTrading size={24} />,
    label: "FcNeutralTrading",
    value: "FcNeutralTrading"
  },
  { icon: <FcNews size={24} />, label: "FcNews", value: "FcNews" },
  { icon: <FcNext size={24} />, label: "FcNext", value: "FcNext" },
  { icon: <FcNfcSign size={24} />, label: "FcNfcSign", value: "FcNfcSign" },
  {
    icon: <FcNightLandscape size={24} />,
    label: "FcNightLandscape",
    value: "FcNightLandscape"
  },
  {
    icon: <FcNightPortrait size={24} />,
    label: "FcNightPortrait",
    value: "FcNightPortrait"
  },
  { icon: <FcNoIdea size={24} />, label: "FcNoIdea", value: "FcNoIdea" },
  { icon: <FcNoVideo size={24} />, label: "FcNoVideo", value: "FcNoVideo" },
  { icon: <FcNook size={24} />, label: "FcNook", value: "FcNook" },
  {
    icon: <FcNumericalSorting12 size={24} />,
    label: "FcNumericalSorting12",
    value: "FcNumericalSorting12"
  },
  {
    icon: <FcNumericalSorting21 size={24} />,
    label: "FcNumericalSorting21",
    value: "FcNumericalSorting21"
  },
  { icon: <FcOk size={24} />, label: "FcOk", value: "FcOk" },
  {
    icon: <FcOldTimeCamera size={24} />,
    label: "FcOldTimeCamera",
    value: "FcOldTimeCamera"
  },
  {
    icon: <FcOnlineSupport size={24} />,
    label: "FcOnlineSupport",
    value: "FcOnlineSupport"
  },
  {
    icon: <FcOpenedFolder size={24} />,
    label: "FcOpenedFolder",
    value: "FcOpenedFolder"
  },
  { icon: <FcOrgUnit size={24} />, label: "FcOrgUnit", value: "FcOrgUnit" },
  {
    icon: <FcOrganization size={24} />,
    label: "FcOrganization",
    value: "FcOrganization"
  },
  { icon: <FcOvertime size={24} />, label: "FcOvertime", value: "FcOvertime" },
  { icon: <FcPackage size={24} />, label: "FcPackage", value: "FcPackage" },
  { icon: <FcPaid size={24} />, label: "FcPaid", value: "FcPaid" },
  { icon: <FcPanorama size={24} />, label: "FcPanorama", value: "FcPanorama" },
  {
    icon: <FcParallelTasks size={24} />,
    label: "FcParallelTasks",
    value: "FcParallelTasks"
  },
  { icon: <FcPhone size={24} />, label: "FcPhone", value: "FcPhone" },
  {
    icon: <FcPhoneAndroid size={24} />,
    label: "FcPhoneAndroid",
    value: "FcPhoneAndroid"
  },
  {
    icon: <FcPhotoReel size={24} />,
    label: "FcPhotoReel",
    value: "FcPhotoReel"
  },
  { icon: <FcPicture size={24} />, label: "FcPicture", value: "FcPicture" },
  { icon: <FcPieChart size={24} />, label: "FcPieChart", value: "FcPieChart" },
  { icon: <FcPlanner size={24} />, label: "FcPlanner", value: "FcPlanner" },
  { icon: <FcPlus size={24} />, label: "FcPlus", value: "FcPlus" },
  {
    icon: <FcPodiumWithAudience size={24} />,
    label: "FcPodiumWithAudience",
    value: "FcPodiumWithAudience"
  },
  {
    icon: <FcPodiumWithSpeaker size={24} />,
    label: "FcPodiumWithSpeaker",
    value: "FcPodiumWithSpeaker"
  },
  {
    icon: <FcPodiumWithoutSpeaker size={24} />,
    label: "FcPodiumWithoutSpeaker",
    value: "FcPodiumWithoutSpeaker"
  },
  {
    icon: <FcPortraitMode size={24} />,
    label: "FcPortraitMode",
    value: "FcPortraitMode"
  },
  {
    icon: <FcPositiveDynamic size={24} />,
    label: "FcPositiveDynamic",
    value: "FcPositiveDynamic"
  },
  { icon: <FcPrevious size={24} />, label: "FcPrevious", value: "FcPrevious" },
  { icon: <FcPrint size={24} />, label: "FcPrint", value: "FcPrint" },
  { icon: <FcPrivacy size={24} />, label: "FcPrivacy", value: "FcPrivacy" },
  { icon: <FcProcess size={24} />, label: "FcProcess", value: "FcProcess" },
  { icon: <FcPuzzle size={24} />, label: "FcPuzzle", value: "FcPuzzle" },
  {
    icon: <FcQuestions size={24} />,
    label: "FcQuestions",
    value: "FcQuestions"
  },
  {
    icon: <FcRadarPlot size={24} />,
    label: "FcRadarPlot",
    value: "FcRadarPlot"
  },
  { icon: <FcRating size={24} />, label: "FcRating", value: "FcRating" },
  { icon: <FcRatings size={24} />, label: "FcRatings", value: "FcRatings" },
  { icon: <FcReading size={24} />, label: "FcReading", value: "FcReading" },
  {
    icon: <FcReadingEbook size={24} />,
    label: "FcReadingEbook",
    value: "FcReadingEbook"
  },
  { icon: <FcReddit size={24} />, label: "FcReddit", value: "FcReddit" },
  { icon: <FcRedo size={24} />, label: "FcRedo", value: "FcRedo" },
  { icon: <FcRefresh size={24} />, label: "FcRefresh", value: "FcRefresh" },
  {
    icon: <FcRegisteredTrademark size={24} />,
    label: "FcRegisteredTrademark",
    value: "FcRegisteredTrademark"
  },
  {
    icon: <FcRemoveImage size={24} />,
    label: "FcRemoveImage",
    value: "FcRemoveImage"
  },
  { icon: <FcReuse size={24} />, label: "FcReuse", value: "FcReuse" },
  { icon: <FcRight size={24} />, label: "FcRight", value: "FcRight" },
  {
    icon: <FcRightDown size={24} />,
    label: "FcRightDown",
    value: "FcRightDown"
  },
  {
    icon: <FcRightDown2 size={24} />,
    label: "FcRightDown2",
    value: "FcRightDown2"
  },
  { icon: <FcRightUp size={24} />, label: "FcRightUp", value: "FcRightUp" },
  { icon: <FcRightUp2 size={24} />, label: "FcRightUp2", value: "FcRightUp2" },
  {
    icon: <FcRotateCamera size={24} />,
    label: "FcRotateCamera",
    value: "FcRotateCamera"
  },
  {
    icon: <FcRotateToLandscape size={24} />,
    label: "FcRotateToLandscape",
    value: "FcRotateToLandscape"
  },
  {
    icon: <FcRotateToPortrait size={24} />,
    label: "FcRotateToPortrait",
    value: "FcRotateToPortrait"
  },
  { icon: <FcRuler size={24} />, label: "FcRuler", value: "FcRuler" },
  { icon: <FcRules size={24} />, label: "FcRules", value: "FcRules" },
  { icon: <FcSafe size={24} />, label: "FcSafe", value: "FcSafe" },
  {
    icon: <FcSalesPerformance size={24} />,
    label: "FcSalesPerformance",
    value: "FcSalesPerformance"
  },
  {
    icon: <FcScatterPlot size={24} />,
    label: "FcScatterPlot",
    value: "FcScatterPlot"
  },
  { icon: <FcSearch size={24} />, label: "FcSearch", value: "FcSearch" },
  {
    icon: <FcSelfServiceKiosk size={24} />,
    label: "FcSelfServiceKiosk",
    value: "FcSelfServiceKiosk"
  },
  { icon: <FcSelfie size={24} />, label: "FcSelfie", value: "FcSelfie" },
  {
    icon: <FcSerialTasks size={24} />,
    label: "FcSerialTasks",
    value: "FcSerialTasks"
  },
  {
    icon: <FcServiceMark size={24} />,
    label: "FcServiceMark",
    value: "FcServiceMark"
  },
  { icon: <FcServices size={24} />, label: "FcServices", value: "FcServices" },
  { icon: <FcSettings size={24} />, label: "FcSettings", value: "FcSettings" },
  { icon: <FcShare size={24} />, label: "FcShare", value: "FcShare" },
  { icon: <FcShipped size={24} />, label: "FcShipped", value: "FcShipped" },
  { icon: <FcShop size={24} />, label: "FcShop", value: "FcShop" },
  {
    icon: <FcSignature size={24} />,
    label: "FcSignature",
    value: "FcSignature"
  },
  { icon: <FcSimCard size={24} />, label: "FcSimCard", value: "FcSimCard" },
  {
    icon: <FcSimCardChip size={24} />,
    label: "FcSimCardChip",
    value: "FcSimCardChip"
  },
  {
    icon: <FcSlrBackSide size={24} />,
    label: "FcSlrBackSide",
    value: "FcSlrBackSide"
  },
  {
    icon: <FcSmartphoneTablet size={24} />,
    label: "FcSmartphoneTablet",
    value: "FcSmartphoneTablet"
  },
  { icon: <FcSms size={24} />, label: "FcSms", value: "FcSms" },
  {
    icon: <FcSoundRecordingCopyright size={24} />,
    label: "FcSoundRecordingCopyright",
    value: "FcSoundRecordingCopyright"
  },
  { icon: <FcSpeaker size={24} />, label: "FcSpeaker", value: "FcSpeaker" },
  {
    icon: <FcSportsMode size={24} />,
    label: "FcSportsMode",
    value: "FcSportsMode"
  },
  {
    icon: <FcStackOfPhotos size={24} />,
    label: "FcStackOfPhotos",
    value: "FcStackOfPhotos"
  },
  { icon: <FcStart size={24} />, label: "FcStart", value: "FcStart" },
  {
    icon: <FcStatistics size={24} />,
    label: "FcStatistics",
    value: "FcStatistics"
  },
  { icon: <FcSteam size={24} />, label: "FcSteam", value: "FcSteam" },
  {
    icon: <FcStumbleupon size={24} />,
    label: "FcStumbleupon",
    value: "FcStumbleupon"
  },
  { icon: <FcSupport size={24} />, label: "FcSupport", value: "FcSupport" },
  { icon: <FcSurvey size={24} />, label: "FcSurvey", value: "FcSurvey" },
  {
    icon: <FcSwitchCamera size={24} />,
    label: "FcSwitchCamera",
    value: "FcSwitchCamera"
  },
  {
    icon: <FcSynchronize size={24} />,
    label: "FcSynchronize",
    value: "FcSynchronize"
  },
  {
    icon: <FcTabletAndroid size={24} />,
    label: "FcTabletAndroid",
    value: "FcTabletAndroid"
  },
  { icon: <FcTemplate size={24} />, label: "FcTemplate", value: "FcTemplate" },
  { icon: <FcTimeline size={24} />, label: "FcTimeline", value: "FcTimeline" },
  { icon: <FcTodoList size={24} />, label: "FcTodoList", value: "FcTodoList" },
  {
    icon: <FcTouchscreenSmartphone size={24} />,
    label: "FcTouchscreenSmartphone",
    value: "FcTouchscreenSmartphone"
  },
  {
    icon: <FcTrademark size={24} />,
    label: "FcTrademark",
    value: "FcTrademark"
  },
  {
    icon: <FcTreeStructure size={24} />,
    label: "FcTreeStructure",
    value: "FcTreeStructure"
  },
  {
    icon: <FcTwoSmartphones size={24} />,
    label: "FcTwoSmartphones",
    value: "FcTwoSmartphones"
  },
  { icon: <FcUndo size={24} />, label: "FcUndo", value: "FcUndo" },
  { icon: <FcUnlock size={24} />, label: "FcUnlock", value: "FcUnlock" },
  { icon: <FcUp size={24} />, label: "FcUp", value: "FcUp" },
  { icon: <FcUpLeft size={24} />, label: "FcUpLeft", value: "FcUpLeft" },
  { icon: <FcUpRight size={24} />, label: "FcUpRight", value: "FcUpRight" },
  { icon: <FcUpload size={24} />, label: "FcUpload", value: "FcUpload" },
  { icon: <FcUsb size={24} />, label: "FcUsb", value: "FcUsb" },
  {
    icon: <FcVideoCall size={24} />,
    label: "FcVideoCall",
    value: "FcVideoCall"
  },
  {
    icon: <FcVideoFile size={24} />,
    label: "FcVideoFile",
    value: "FcVideoFile"
  },
  {
    icon: <FcVideoProjector size={24} />,
    label: "FcVideoProjector",
    value: "FcVideoProjector"
  },
  {
    icon: <FcViewDetails size={24} />,
    label: "FcViewDetails",
    value: "FcViewDetails"
  },
  { icon: <FcVip size={24} />, label: "FcVip", value: "FcVip" },
  { icon: <FcVlc size={24} />, label: "FcVlc", value: "FcVlc" },
  {
    icon: <FcVoicePresentation size={24} />,
    label: "FcVoicePresentation",
    value: "FcVoicePresentation"
  },
  {
    icon: <FcVoicemail size={24} />,
    label: "FcVoicemail",
    value: "FcVoicemail"
  },
  { icon: <FcWebcam size={24} />, label: "FcWebcam", value: "FcWebcam" },
  { icon: <FcWiFiLogo size={24} />, label: "FcWiFiLogo", value: "FcWiFiLogo" },
  {
    icon: <FcWikipedia size={24} />,
    label: "FcWikipedia",
    value: "FcWikipedia"
  }
]

const ManageChannels = (props) => {
  const [modal, setOpen] = useStorage("channels-modal", false)

  if (!modal) {
    return null
  }

  return (
    <div className="h-screen flex items-center relative">
      <Dialog open={modal} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex flex-col gap-y-5">
            <DialogHeader>
              <AiOutlineClose
                className="absolute right-4 cursor-pointer"
                size={18}
                onClick={() => setOpen(false)}
              />
              <DialogTitle>Add Group</DialogTitle>
            </DialogHeader>

            <Input placeholder="Group Name" />

            <ComboboxDemo items={icons} />

            <Button
              className="w-full text-primary text-xl bg-transparent hover:bg-accent"
              size="lg">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageChannels
