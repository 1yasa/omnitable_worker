import dayjs from 'dayjs'

interface Args {
	timestamp: number
	span_value: number
	span_unit: 'minute' | 'hour' | 'day'
	tick_value: number
	tick_unit: 'second' | 'minute' | 'hour' | 'day'
}

export default (args: Args): Array<[number, number]> => {
	const { timestamp, span_value, span_unit, tick_value, tick_unit } = args
	const time = dayjs(timestamp)

	const start_time = dayjs(time).subtract(span_value, span_unit).startOf(span_unit)
	const end_time = dayjs(time)
	const ranges: [number, number][] = []

	let current_time = start_time

	while (current_time.isBefore(end_time)) {
		const range_start = current_time.valueOf()
		const range_end = current_time.add(tick_value, tick_unit).valueOf()

		ranges.push([range_start, range_end])

		current_time = current_time.add(tick_value, tick_unit)
	}

	return ranges
}
