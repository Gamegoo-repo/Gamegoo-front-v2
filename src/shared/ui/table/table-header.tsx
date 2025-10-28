import { memo } from "react";
import type { Column } from "./table";

function TableHeader<T>({ columns }: { columns: Column<T>[] }) {
	return (
		<thead>
			<tr className=" text-white bold-14 border-collapse-5">
				{columns.map((column) => (
					<th
						scope="col"
						key={column.header}
						className="leading-normal first:rounded-l-lg last:rounded-r-lg bg-gray-800 text-center first:text-left px-[12.5px] last:pr-0 first:pl-4 border-collapse-5 h-[48px]"
					>
						{column.header}
					</th>
				))}
			</tr>
		</thead>
	);
}

export default memo(TableHeader) as typeof TableHeader;
