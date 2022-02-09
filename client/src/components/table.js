import React, { Fragment } from 'react'

export const table = ({ classes, headers, body }) => {
    
    const createColumns = () => {
        return (
        <tr>
            {headers.map(head => { 
                return (`<th {head.params ? head.params : ''} >${head.value}</th>`)
            })}
        </tr>
        )
    }

    return (
        <Fragment>
            <table className={classes}>
                <thead>{createColumns()}</thead>
                <tbody>{body}</tbody>
            </table>
        </Fragment>
    )
}
