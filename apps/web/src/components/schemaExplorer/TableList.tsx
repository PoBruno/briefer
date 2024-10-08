import { APIDataSource } from '@/hooks/useDatasources'
import ExplorerTitle from './ExplorerTitle'
import { databaseImages } from '../DataSourcesList'
import clsx from 'clsx'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { Grid3x3Icon } from 'lucide-react'
import { useMemo } from 'react'
import TableDetails from './TableDetails'

interface Props {
  dataSource: APIDataSource
  schema: string
  onBack: () => void
  onSelectTable: (tableName: string | null) => void
  selectedTable: string | null
}
export default function TableList(props: Props) {
  const tables = useMemo(() => {
    const schema = props.dataSource.structure.schemas[props.schema]
    if (!schema) {
      return []
    }

    return Object.entries(schema.tables).map(([tableName, table]) => {
      return {
        name: tableName,
        columns: table.columns,
      }
    })
  }, [props.dataSource.structure.schemas, props.schema])

  const columns = useMemo(() => {
    if (!props.selectedTable) {
      return []
    }

    const schema = props.dataSource.structure.schemas[props.schema]
    if (!schema) {
      return []
    }

    const table = schema.tables[props.selectedTable]
    if (!table) {
      return []
    }

    return table.columns
  }, [props.dataSource.structure.schemas, props.schema, props.selectedTable])

  return (
    <div className="flex flex-col h-full">
      <ExplorerTitle
        title="Schema explorer"
        description="Choose a table to see its columns."
      />

      <div className="flex-1 h-1/3 pt-4 flex flex-col overflow-hidden">
        <button
          className="relative flex px-4 py-2 text-xs font-medium border-y bg-gray-50 text-gray-600 items-center justify-between font-mono hover:bg-gray-100 group w-full"
          onClick={props.onBack}
        >
          <div className="flex gap-x-1.5 items-center">
            <ChevronLeftIcon className="h-3 w-3 text-gray-500 group-hover:text-gray-700" />
            <h4>
              {props.dataSource.dataSource.data.name}.{props.schema}
            </h4>
          </div>

          <img
            src={databaseImages(props.dataSource.dataSource.type)}
            alt=""
            className="h-4 w-4 group-hover:grayscale-[50%]"
          />
        </button>

        <div className="text-xs text-gray-500 font-mono overflow-x-hidden overflow-y-scroll flex-grow">
          <ul className="flex flex-col">
            {tables.map((table) => {
              return (
                <li
                  key={table.name}
                  className="px-4 py-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center justify-between gap-x-1.5"
                  onClick={() => props.onSelectTable(table.name)}
                >
                  <Grid3x3Icon className="text-gray-400 h-4 w-4" />
                  <div className="pr-2 flex-grow overflow-x-hidden">
                    <h4 className="overflow-x-scroll" title={table.name}>
                      {table.name}
                    </h4>
                  </div>
                  <ChevronRightIcon className="h-3 w-3 text-gray-500" />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {props.selectedTable && (
        <TableDetails
          tableName={props.selectedTable}
          onCloseTableDetails={() => props.onSelectTable(null)}
          columns={columns}
        />
      )}
    </div>
  )
}
