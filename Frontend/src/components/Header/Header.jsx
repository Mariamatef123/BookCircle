import useUser from "../../hooks/useUser";
import { headerStyles as styles } from "../../styles/headerStyles";
import HeaderActions from "./HeaderActions";
import { SparklesIcon } from "../icons/AppIcons";

export default function Header({ handleCreate, activeTab, role }) {
  const user = useUser();

  return (
    <div style={styles.header}>
      <div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
          My Dashboard
        </h1>

        <p style={{ color: "#6B7280", margin: "4px 0 0" }}>
          Welcome back, {user?.name || "User"} <SparklesIcon size={16} style={{ color: "#4F46E5" }} />
        </p>
      </div>

      <HeaderActions
        role={role}
        activeTab={activeTab}
        handleCreate={handleCreate}
      />
    </div>
  );
}
