import { memo } from "react";
import type { Column } from "./table";

function TableHeader<T>({ columns }: { columns: Column<T>[] }) {
	return (
		<thead>
			<tr className="bold-14 border-collapse-5 text-white">
				{columns.map((column) => (
					<th
						scope="col"
						key={column.header}
						className="h-[48px] border-collapse-5 bg-gray-800 px-[12.5px] text-center leading-normal first:rounded-l-lg first:pl-4 first:text-left last:rounded-r-lg last:pr-0"
					>
						{column.header}
					</th>
				))}
			</tr>
		</thead>
	);
}

export default memo(TableHeader) as typeof TableHeader;
