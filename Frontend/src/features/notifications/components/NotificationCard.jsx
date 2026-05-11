import styles from "../styles/notificationStyles";
import {
  getTypeConfig,
  getId, getIsRead, getTitle, getMessage, getCreatedAt,
  formatDate,resolveType
} from "../hooks/useNotifications";
import { BellIcon } from "../../../components/icons/AppIcons";

// Types that show a CTA strip with navigation hint
const CTA_TYPES = {
  BORROW_ACCEPTED: { text: " Complete your payment →" },
  BORROW_REQUEST:  { text: " View in your dashboard →" },
  BOOK_LIKED:{text: " View your book →"        },
  BOOK_DISLIKED:{text: " View your book →"        },
  BOOK_APPROVED:   { text: " View your book →"         },
  OWNER_APPROVED:  { text: " Go to dashboard →"        },
  COMMENT_ADDED:   { text: " Read the comment →"        },
  COMMENT_REPLIED: { text: " See the reply →"           },
  ACCOUNT_REQUEST:  { text: " GO To Dashboard →" },
};

export default function NotificationCard({ notification: n, onClick }) {
  const id       = getId(n);
  const isRead   = getIsRead(n);
  const title    = getTitle(n);
  const message  = getMessage(n);
  const dateStr  = formatDate(getCreatedAt(n));
  const config   = getTypeConfig(n.type);
// NotificationCard.jsx
const cta = CTA_TYPES[resolveType(n?.type ?? n?.Type)];
const isPaymentDone = (bookId) => {
  return localStorage.getItem(`payment_${bookId}`) === "true";
};
const isPaymentDisabled =
  resolveType(n?.type) === "BORROW_ACCEPTED" &&
  isPaymentDone(n?.bookId); return (
    <div
      key={id}
      style={{
        ...styles.card,
        ...(isRead ? styles.cardRead : styles.cardUnread),
      }}
      onClick={() => onClick(n)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform   = "translateY(-2px)";
        e.currentTarget.style.boxShadow   = "0 6px 20px rgba(99,102,241,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform   = "";
        e.currentTarget.style.boxShadow   = "";
      }}
    >

      {!isRead && <div style={styles.unreadDot} />}

      <div style={styles.cardTop}>
        <div style={{ ...styles.iconWrap, background: config.bg }}>
          <BellIcon size={20} />
        </div>

        <div style={styles.cardBody}>
    
          <div style={styles.cardTitleRow}>
            <p style={styles.cardTitle}>{title}</p>
            <span style={styles.cardTime}>{dateStr}</span>
          </div>

      
          {message && <p style={styles.cardMessage}>{message}</p>}

{cta && (
  <div
    style={{
      ...styles.ctaStrip,
      opacity: isPaymentDisabled ? 0.4 : 1,
      pointerEvents: isPaymentDisabled ? "none" : "auto",
      cursor: isPaymentDisabled ? "not-allowed" : "pointer",
    }}
  >
    <span style={styles.ctaText}>
      {isPaymentDisabled ? "Payment completed" : cta.text}
    </span>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
