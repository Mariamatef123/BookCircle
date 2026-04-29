import { tabsStyles as styles } from "../../styles/tabsStyles";
import { TABS_CONFIG } from "./tabsConfig";
import TabButton from "./TabButton";

export default function Tabs({ role, activeTab, setActiveTab }) {
  const tabs = TABS_CONFIG[role] || TABS_CONFIG.DEFAULT;

  return (
    <div style={styles.tabs}>
      {tabs.map(tab => (
        <TabButton
          key={tab.key}
          isActive={activeTab === tab.key}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  );
}