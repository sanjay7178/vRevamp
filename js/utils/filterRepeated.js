const filterRepeated = (arr) => {
  const seen = new Set();
  return arr.filter((el) => {
    const duplicate = seen.has(el);
    seen.add(el);
    return !duplicate;
  });
}
