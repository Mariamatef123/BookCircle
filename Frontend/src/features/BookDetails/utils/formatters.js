

export function formatMonthYear(value) {
  try {
    return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch { return "recently"; }
}

export function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch { return value; }
}

export function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return "Just now"; }
}

export function getAvailabilityLabel(options) {
  if (!options.length) return "Not specified";
  return options.map((item) => item.label).join(" | ");
}

export function getOwnerInitials(name) {
  if (!name) return "BC";
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export function getCommentAuthor(comment, currentUserId) {
  console.log("currentUserId:", currentUserId);
console.log("comment:", comment);
  if (!comment) return "Unknown User";

  if (String(comment.userId) === String(currentUserId)) {
    return "You";
  }

  if (!comment.user) {
    console.warn("Missing user for comment:", comment);
    return "Unknown User";
  }

  return comment.user.name;
}