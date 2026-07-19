import { NavLink } from "react-router-dom";
import styles from "./styles/bookDetailsStyles";

export default function BookTabsNav({ totalComments }) {
  return (
    <div style={styles.tabs}>

      <NavLink
        to="about"
        end
        style={({ isActive }) => ({
          ...styles.tabButton,
          ...(isActive ? styles.tabButtonActive : {}),
          padding: "0px",textDecoration:"none"
        })}
      >
        About
      </NavLink>

      <NavLink
        to="comments"
        style={({ isActive }) => ({
          ...styles.tabButton,
          ...(isActive ? styles.tabButtonActive : {}), padding: "0px",textDecoration:"none"
        })}
      >
        Comments ({totalComments})
      </NavLink>

    </div>
  );
}