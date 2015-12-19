var EventItemSelector = React.createClass({
    
    getInitialState: function(){
        return {
                selectableItems: [],
                callback: undefined
            }
    },

    componentDidMount: function() {
        $(window).on("GC.showItemSelector", function(e, selectableItems, callback) {
            this.setState({
                selectableItems: selectableItems,
                callback: callback
            });
        }.bind(this));

        $(window).on("GC.hideItemSelector", function(e) {
            this.setState({
                selectableItems: [],
                callback: undefined
            });
        }.bind(this));
    },

    onItemSelect: function(itemName) {
        this.state.callback(itemName);
        this.clearSelectableItems();
    },

    clearSelectableItems: function() {
        this.setState({
            selectableItems: [],
            callback: undefined
        });
    },

    componentWillUnmount: function() {
        $(window).off('GC.showItemSelector');
        $(window).off('GC.hideItemSelector');
    },

    render: function() {
        var addNewItemColumn = <div></div>;
        if (this.state.selectableItems.length !== 0) {
            var columnButtons = [];
            for (var i = 0; i < this.state.selectableItems.length; i += 1) {
                columnButtons.push(<ColumnButton key={i} onSelect={this.onItemSelect} text={this.state.selectableItems[i]}/>);
            }
            addNewItemColumn = <Column title="Select Item">{columnButtons}</Column>;
        }

        return addNewItemColumn;
    }
});
