var AddCounterEventForm = React.createClass({
    getInitialState: function() {
        return {
            formOpen: false
        };
    },
    openForm: function() {
        this.setState({formOpen: true});
    },
    closeForm: function() {
        this.setState({formOpen: false});
    },
    saveEvent: function() {
        var eventType = $('#counter-event-type').val();
        var eventValue = $('#counter-event-value').val();
        if (eventValue !== undefined && eventValue !== '') {
            this.props.onCreate(eventType, eventValue);
        }
        this.closeForm();
    },
    render: function() {
        if (this.state.formOpen) {
            return (
                <div>
                    <select id='counter-event-type' className="selectorField" data-type="string">
                        <option value="atValue">Equals</option>
                        <option value="aboveValue">Larger Than</option>
                        <option value="belowValue">Smaller Than</option>
                    </select>
                    <input id='counter-event-value' type='text' placeholder='Value'/>
                    <div className="btn-group sequenced">
                        <a className="btn success" onClick={this.saveEvent}>Save</a>
                        <a className="btn warning" onClick={this.closeForm}>Cancel</a>
                    </div>
                </div>
            )
        } else {
            return <a className="btn tab success wide" onClick={this.openForm}>Add</a>
        }
    }
});
