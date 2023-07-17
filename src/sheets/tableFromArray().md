# `tableFromArray()`

## Summary

### Code

```js
function assembleTable(data) {
  let tableHtml = `<!-- Start of assembled table string -->
  <table>
    <thead>
      <tr>`;
  data.shift().forEach((header) => {
    tableHtml += `
        <th>
          ${header}
        </th>`;
  });
  tableHtml += `
      </tr>
    </thead>
    <tbody>`;
  data.forEach((rowData) => {
    tableHtml += `
      <tr>`;
    rowData.forEach((cellData) => {
      tableHtml += `
        <td>
          ${cellData}
        </td>`;
    });
    tableHtml += `
      </tr>`;
  });
  tableHtml += `
    </tbody>
  </table>
<!-- End of assembled table string -->`;

  return tableHtml;
}
function addInnerHtml() {
  const table = document.getElementById(`data-table`);
  table.innerHTML = tableHtml;
}
```
