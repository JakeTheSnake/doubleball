var TimingParam = React.createClass({
    getInitialState: function() {
        return {
            type: this.props.timing.type,
            time: this.props.timing.time || 0,
            selected: false
        }
    },
    timingSelected: function(event) {
        var node = ReactDOM.findDOMNode(this);
        this.setState({type: event.target.value});
    },
    select: function() {
        var me = this;
        if (!me.state.selected) {
            me.setState({selected: true});
            $(document).on('click.timingParamFocusout', function(){
                var node = ReactDOM.findDOMNode(me);
                var select = $(node).find('select');
                var input = $(node).find('input');
                if(!$(select).is(":focus") && !$(input).is(":focus")) {
                    me.saveValue();
                }
            });
        }
    },
    saveValue: function() {
        var node = ReactDOM.findDOMNode(this);
        var type = $(node).find('select').val();
        var time = Number($(node).find('input').val());
        this.props.onUpdate({type: type, time: time});
        this.setState({selected: false, type: type, time: time});
        $(document).off('click.timingParamFocusout');
    },
    getDisplayText: function() {
        var result = GameCreator.helpers.labelize(this.state.type);
        if (this.state.type !== 'now') {
            result += ' ' + this.state.time;
        }
        return result;
    },
    render: function() {
        var html;
        if (this.state.selected) {
            var typeSelection;
            var valueInput;
            var collection = this.props.selectableTimings;
            var options = [];
            var names = Object.keys(collection);
            options.push(<option key={"now"} value='now'>now</option>);
            for(var i = 0; i < names.length; i += 1) {
                if(collection[names[i]]) {
                    options.push(<option key={i} value={names[i]}>{names[i]}</option>);
                }
            }
            typeSelection = <select key="typeSelection" className="selectorField" onChange={this.timingSelected} defaultValue={this.state.type}>{options}</select>;
            if (this.state.type !== 'now') {
                valueInput = <input key="numberInput" type="text" className="numberField" data-type="number" defaultValue={this.state.time}/>
            }
            html = [typeSelection, valueInput];

        } else {
            html = <span>{this.getDisplayText()}</span>;
        }
        return  (
            <tbody>
                <tr>
                    <td><label>Timing:</label></td>
                    <td onClick={this.select}>{html}</td>
                </tr>
            </tbody>
        );
    }
});
