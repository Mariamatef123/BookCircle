export function buildBookFormData(form) {
  const fd = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key !== "AvailabilityDates" && key !== "CoverImage") {
      fd.append(key, value);
    }
  });

  form.AvailabilityDates.forEach((d, i) => {
    fd.append(`AvailabilityDates[${i}][duration]`, d.duration);
  });

  if (form.CoverImage) {
    fd.append("CoverImage", form.CoverImage);
  }

  return fd;
}