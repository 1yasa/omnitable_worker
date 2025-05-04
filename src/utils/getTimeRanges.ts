import dayjs from 'dayjs'

export default (timestamp?: string): Array<[number, number]> => {
	const time = timestamp ? Number(timestamp) : dayjs().valueOf()

	const start_time = timestamp
		? dayjs(time).subtract(30, 'minute').startOf('minute')
		: dayjs(time).subtract(24, 'hour').startOf('hour')
	const end_time = dayjs(time)
	const ranges: [number, number][] = []

	let current_time = start_time

	while (current_time.isBefore(end_time)) {
		const range_start = current_time.valueOf()
		const range_end = current_time.add(30, 'minute').valueOf()

		ranges.push([range_start, range_end])

		current_time = current_time.add(30, 'minute')
	}

	return ranges
}
