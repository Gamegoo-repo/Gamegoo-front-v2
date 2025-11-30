import { type ReactNode, useMemo } from "react";
import { Skeleton } from "../skeleton/skeleton-ui";
import TableHeader from "./table-header";

export type RowData = object;

export interface Column<T> {
	accessor: (row: T) => React.ReactNode;
	header: string;
	width?: string;
}

interface TableProps<T extends { id: number }> {
	data?: T[];
	columns: Column<T>[];
	ariaLabel: string;
	isLoading?: boolean;
	onRowClick?: (row: T) => void;
}

export default function Table<T extends { id: number }>({
	data,
	columns,
	ariaLabel,
	isLoading,
	onRowClick,
}: TableProps<T>) {
	const memoizedColumns = useMemo(() => columns, [columns]);

	const handleRowClick = (row: T) => {
		onRowClick?.(row);
	};

	let content: ReactNode;

	if (isLoading) {
		content = Array.from({ length: 8 }).map(() => (
			<tr key={crypto.randomUUID()} className="pt-2 pb-2">
				<td colSpan={10}>
					<Skeleton height={83} variant="rounded" width={"100%"} />
				</td>
			</tr>
		));
	} else if (!data?.length) {
		content = (
			<tr>
				<td
					colSpan={memoizedColumns.length}
					className="regular-16 py-10 text-center text-gray-700"
				>
					게시된 글이 없습니다.
				</td>
			</tr>
		);
	}

	return (
		<table
			className="w-full table-fixed border-collapse"
			aria-label={ariaLabel}
		>
			<caption className="sr-only">게시글 목록</caption>

			<colgroup>
				{memoizedColumns.map((column) => (
					<col
						span={1}
						key={column.header}
						style={column.width ? { width: column.width } : undefined}
					/>
				))}
			</colgroup>

			<TableHeader columns={memoizedColumns} />
			{data?.length ? (
				<tbody>
					{data.map((row) => (
						<tr
							key={row.id}
							onClick={() => handleRowClick(row)}
							className="border-gray-300 border-b pt-2 pb-2"
						>
							{memoizedColumns.map((column) => (
								<td
									key={column.header}
									className="h-[86px] px-3 pt-5 pb-3 first:pl-3 last:p-0"
								>
									{column.accessor(row)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			) : (
				<tbody>{content}</tbody>
			)}
		</table>
	);
}
