import React, {FC, useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import "./style.css";

export interface IJsonData {
  [title: string]: {
    records: {
      data: {
        [field: string]: string | number | boolean;
      };
      kids?: IJsonData,
      expanded?: boolean;
    }[];
  };
}

export interface IJsonViewerProps {
  data: IJsonData;
  onClear?: () => void;
}

export const JsonViewer: FC<IJsonViewerProps> = ({
  data,
  onClear,
}) => {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const { title, columns } = useMemo(() => {
    const title = Object.keys(data)[0];
    const records = data[title].records || [];
    const columns = Object.keys(records[0]?.data || {});

    return {
      title,
      columns,
    };
  }, [data]);

  const records = useMemo(() => {
    const title = Object.keys(tableData)[0];
    return tableData[title].records || [];
  }, [tableData]);

  const onToggleExpandRow = (index: number) => {
    setTableData({
      [title]: {
        records: records.map((item, i) => (
          i === index ? { ...item, expanded: !item.expanded } : item
        )),
      },
    });
  };

  const onRemoveRow = (index: number) => {
    if (!window.confirm("Are you sure you want to remove this row?")) {
      return;
    }

    const filteredRecords = records.filter((item, i) => i !== index);
    setTableData({
      [title]: {
        records: filteredRecords,
      },
    });
    if (!filteredRecords.length && onClear) {
      onClear();
    }
  };

  const onClearChildren = (index: number) => {
    setTableData({
      [title]: {
        records: records.map((item, i) => (
          i === index ? { ...item, kids: undefined } : item
        )),
      },
    });
  };

  return (
    <div className="json-viewer">
      <div className="title">{title}</div>
      <table>
        <thead>
        <tr>
          <th />
          {columns.map((column, i) => (
            <th key={i}>{column}</th>
          ))}
          <th />
        </tr>
        </thead>
        <tbody>
        {records.map((row, i) => {
          const hasChildren = Boolean(Object.values(row.kids || {}).length);
          const expanded = hasChildren && row.expanded;
          return (
            <>
              <tr key={i}>
                <td>
                  {hasChildren && (
                    <i
                      className={classNames("expand-icon fa fa-angle-right cursor-pointer", { expanded })}
                      onClick={() => onToggleExpandRow(i)}
                    />
                  )}
                </td>
                {columns.map((column, i) => (
                  <td key={i}>{row.data[column]}</td>
                ))}
                <td className="text-right">
                  <i className="fa fa-times cursor-pointer" onClick={() => onRemoveRow(i)} />
                </td>
              </tr>
              {expanded && row.kids && (
                <tr className="sub-row">
                  <td colSpan={columns.length + 2}>
                    <JsonViewer data={row.kids} onClear={() => onClearChildren(i)} />
                  </td>
                </tr>
              )}
            </>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};
