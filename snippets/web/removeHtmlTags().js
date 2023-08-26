function removeHtmlTags(data) {
  const pattern = /<[^>]*>/g; // Regular expression to match HTML tags
  const newData = data.map(item => {
    // Use replace() to remove HTML tags from each 'shift' property
    const cleanedShift = item.shift.replace(pattern, '');
    return { ...item, shift: cleanedShift };
  });

  return newData;
}