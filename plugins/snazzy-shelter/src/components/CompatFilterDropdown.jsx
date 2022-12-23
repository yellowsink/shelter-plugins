// TODO
const SingleSelect = (props) => (
  <select
    onChange={e => props.onChange(e.target.value)}
    value={props.value}
    disabled={props.isDisabled}
    class={props.class}
  >
    {props.options.map((opt) => (
      <option value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default (props) => (
	<SingleSelect
		options={[
			{ value: 0, label: "Show All" },
			{ value: 1, label: "CC Only" },
			{ value: 2, label: "BD Only" },
		]}
		value={props.filterMode}
		onChange={props.setFilterMode}
		isDisabled={false}
		class="ysink_stain_dropdown"
	/>
);
