import React from "react";
import StatusBanner from "./renderers/StatusBanner.jsx";
import StatsCardGroup from "./renderers/StatsCardGroup.jsx";
import ActiveTaskCard from "./renderers/ActiveTaskCard.jsx";
import NavActionGrid from "./renderers/NavActionGrid.jsx";
import JobCardRenderer from "./renderers/JobCard.jsx";
import ScreenHeading from "./renderers/ScreenHeading.jsx";
import EarningsHeroRenderer from "./renderers/EarningsHeroRenderer.jsx";
import SectionHeading from "./renderers/SectionHeading.jsx";
import JobHistoryItem from "./renderers/JobHistoryItem.jsx";
import DayScheduleCard from "./renderers/DayScheduleCard.jsx";
import ScreenHeaderWithAction from "./renderers/ScreenHeaderWithAction.jsx";
import AvatarRenderer from "./renderers/AvatarRenderer.jsx";
import EditableFieldGroup from "./renderers/EditableFieldGroup.jsx";
import StatsRow from "./renderers/StatsRow.jsx";
import EmptyStateRenderer from "./renderers/EmptyStateRenderer.jsx";
import StatusText from "./renderers/StatusText.jsx";
import SkillTag from "./renderers/SkillTag.jsx";
import SubtabContainer from "./renderers/SubtabContainer.jsx";
import ServiceTableRenderer from "./renderers/ServiceTableRenderer.jsx";
import MapPlaceholder from "./renderers/MapPlaceholder.jsx";
import OnlineToggleCard from "./renderers/OnlineToggleCard.jsx";
import AnalyticsChart from "./renderers/AnalyticsChart.jsx";
import FilterTabs from "./renderers/FilterTabs.jsx";
import BookingTrackCardRenderer from "./renderers/BookingTrackCardRenderer.jsx";
import DataTableRenderer from "./renderers/DataTableRenderer.jsx";
import WorkerServiceManagerPanel from "./renderers/WorkerServiceManagerPanel.jsx";
import visualIdentityRegistry from "../config/visualIdentityRegistry.js";

const registry = {
  statusBanner: StatusBanner,
  statsCardGroup: StatsCardGroup,
  activeTaskCard: ActiveTaskCard,
  navActionGrid: NavActionGrid,
  jobCard: JobCardRenderer,
  screenHeading: ScreenHeading,
  earningsHero: EarningsHeroRenderer,
  sectionHeading: SectionHeading,
  jobHistoryItem: JobHistoryItem,
  dayScheduleCard: DayScheduleCard,
  screenHeaderWithAction: ScreenHeaderWithAction,
  avatar: AvatarRenderer,
  editableFieldGroup: EditableFieldGroup,
  statsRow: StatsRow,
  emptyState: EmptyStateRenderer,
  statusText: StatusText,
  skillTag: SkillTag,
  subtabContainer: SubtabContainer,
  serviceTable: ServiceTableRenderer,
  mapPlaceholder: MapPlaceholder,
  onlineToggleCard: OnlineToggleCard,
  analyticsChart: AnalyticsChart,
  filterTabs: FilterTabs,
  bookingTrackCard: BookingTrackCardRenderer,
  dataTable: DataTableRenderer,
  workerServiceManager: WorkerServiceManagerPanel,
};

console.log('ELEMENT RENDERER V3 – REGISTRY MODE – ' + new Date().toISOString());

const ElementRenderer = ({ elementId, overrideData = {} }) => {
  const elementConfig = visualIdentityRegistry[elementId];
  if (!elementConfig || elementConfig.visible === false) return null;

  const Component = registry[elementConfig.type];
  if (!Component) {
    console.warn(`[ElementRenderer] Unknown type: "${elementConfig.type}" for element: "${elementId}"`);
    return null;
  }

  return <Component elementConfig={elementConfig} overrideData={overrideData} />;
};

export default ElementRenderer;