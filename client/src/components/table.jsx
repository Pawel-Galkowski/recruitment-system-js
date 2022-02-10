import React from 'react';

const table = ({ classes, headers, body }) => {
  const createColumns = () => (
    <tr>
      {headers.map((head) => (`<th {head.params ? head.params : ''} >${head.value}</th>`))}
    </tr>
  );

  return (
    <table className={classes}>
      <thead>{createColumns()}</thead>
      <tbody>{body}</tbody>
    </table>
  );
};

export default table;
