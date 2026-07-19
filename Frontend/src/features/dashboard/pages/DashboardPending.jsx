// import useUser from "../../../hooks/useUser";
// import useDashboard from "../hooks/useDashboard";

// import List from "../../../components/List/List";

// export default function DashboardPending() {
//   const user = useUser();
//   const dashboard = useDashboard(user?.id, user?.role);

//   return (
//     <List
//       owners={dashboard.owners}
//       borrows={dashboard.borrows}
//       role={user?.role}
//       userId={user?.id}
//       onAcceptOwner={dashboard.handleAcceptOwner}
//       onRejectOwner={dashboard.handleRejectOwner}
//       onAcceptRequest={dashboard.handleAcceptBorrow}
//       onRejectRequest={dashboard.handleRejectBorrow}
//     />
//   );
// }