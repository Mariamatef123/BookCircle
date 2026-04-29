import { tabsStyles as styles } from "../../styles/tabsStyles";

export default function TabButton({ isActive, onClick, children }) {
  return (
    <button
      style={isActive ? styles.tabActive : styles.tab}
      onClick={onClick}
    >
      {children}
    </button>
  );
}