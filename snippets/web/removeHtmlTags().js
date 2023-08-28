const removeHtmlTags = (data) => {
  // Regular expression to match HTML tags
  const pattern = /<[^>]*>/g; 
  const newData = data.map(item => {
    // Use replace() to remove HTML tags
    // from each 'shift' property
    const cleanedShift = item.shift.replace(pattern, '');
    return { ...item, shift: cleanedShift };
  });

  return newData;
}