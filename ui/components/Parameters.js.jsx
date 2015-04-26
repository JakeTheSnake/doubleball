var GlobalObjectParam = React.createClass({
    render: function() {
        return 	<tr>
        			<td><label>Object:</label></td>
					<td data-inputtype="globalObjectInput"><span></span></td>
				</tr>
    }
});

var ComparatorParam = React.createClass({
    render: function() {
        return 	<tr>
        			<td><label>Comparator:</label></td>
					<td data-inputtype="comparatorInput"><span></span></td>
				</tr>
    }
});

var NumberParam = React.createClass({
    render: function() {
        return 	<tr>
        			<td><label>Count:</label></td>
					<td data-inputtype="numberInput"><span></span></td>
				</tr>
    }
});