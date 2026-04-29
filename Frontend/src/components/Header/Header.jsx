import useUser from "../../hooks/useUser";
import { headerStyles as styles } from "../../styles/headerStyles";
import HeaderActions from "./HeaderActions";

export default function Header({ handleCreate, activeTab, role }) {
  const user = useUser();

  return (
    <div style={styles.header}>
      <div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
          My Dashboard
        </h1>

        <p style={{ color: "#6B7280", margin: "4px 0 0" }}>
          Welcome back, {user?.name || "User"} 👋
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