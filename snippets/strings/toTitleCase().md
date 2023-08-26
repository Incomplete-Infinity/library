# `toTitleCase()`

## Summary

### Code

```js
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(` `)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(` `);
}
```
