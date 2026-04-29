import { formatDate } from "./formatters";

export function normalizeAvailabilityOptions(items = []) {
  return items.map((item, index) => {
    const id       = item?.id ?? item?.Id ?? item?.availabilityDateId ?? item?.AvailabilityDateId;
    const duration = item?.duration ?? item?.Duration;
    const startDate = item?.startDate ?? item?.StartDate;
    const endDate   = item?.endDate   ?? item?.EndDate;
    return {
      key: String(id ?? `availability-${index}`),
      id, duration, startDate, endDate,
      label: duration ? `${duration} days` : `Option ${index + 1}`,
      rangeLabel: startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "",
    };
  });
}

export function normalizeReaction(reaction) {
  return {
    id:     reaction?.id     ?? reaction?.Id,
    userId: reaction?.userId ?? reaction?.UserId,
    type:   String(reaction?.type ?? reaction?.Type ?? "").toUpperCase(),
  };
}

export function normalizeComment(comment) {
  return {
    id: comment?.id ?? comment?.Id,
    userId: comment?.userId ?? comment?.UserId,
    content: comment?.content ?? comment?.Content ?? "",
    createdAt: comment?.createdAt ?? comment?.CreatedAt,

    user: comment?.user
      ? {
          id: comment.user.id,
          name: comment.user.name,
          role: comment.user.role
        }
      : null,

    replies: (comment?.replies ?? comment?.Replies ?? []).map((reply) => ({
      id: reply?.id ?? reply?.Id,
      userId: reply?.userId ?? reply?.UserId,
      content: reply?.content ?? reply?.Content ?? "",
      createdAt: reply?.createdAt ?? reply?.CreatedAt,

      user: reply?.user
        ? {
            id: reply.user.id,
            name: reply.user.name,
            role: reply.user.role
          }
        : null
    }))
  };
}
export function getReactionSummary(reactions, currentUserId) {
  const likeCount    = reactions.filter((r) => r.type === "LIKE").length;
  const dislikeCount = reactions.filter((r) => r.type === "DISLIKE").length;
  const currentReaction = reactions.find((r) => String(r.userId) === String(currentUserId))?.type || "";
  return { likeCount, dislikeCount, currentReaction };
}