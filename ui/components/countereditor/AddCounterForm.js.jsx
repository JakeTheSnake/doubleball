var AddCounterForm = React.createClass({
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
    saveCounter: function() {
        var counterName = $('#create-counter-form input').val();
        if (counterName !== undefined && counterName !== '') {
            this.props.onCreate(counterName);
        }
        this.closeForm();
    },
    render: function() {
        if (this.state.formOpen) {
            return (
                <div id='create-counter-form'>
                    <input type="text" placeholder="Counter name"/>
                    <div className="btn-group sequenced">
                        <a className="btn success" onClick={this.saveCounter}>Save</a>
                        <a className="btn warning" onClick={this.closeForm}>Cancel</a>
                    </div>
                </div>
            )
        } else {
            return <a className="btn tab success wide" onClick={this.openForm}>Add</a>
        }
    }
});

var ColumnButton = React.createClass({
    select: function(ev) {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.text);
        }
    },
    render: function() {
        var classes = 'btn tab';
        if (this.props.active) classes += ' active';
        return (
            <a className={classes} onClick={this.select}>{GameCreator.helpers.labelize(this.props.text)}</a>
        );
    }
});
