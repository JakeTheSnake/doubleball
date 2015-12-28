GameCreator.CommonParamFunctions = {
    getInitialState: function() {
        return {
            selected: false,
            value: this.props.value,
        };
    },
    select: function() {
        this.setState({selected: true});
    },
    saveValue: function(event) {
        var input = event.target;

        try {
            value = GameCreator.helpers.getValue(input);
            this.props.onUpdate(this.props.name, value);
            this.setState({value: value});
        } catch (err) {
            GameCreator.UI.createValidationBox(input, err);
        }

        this.setState({selected: false});

    },
    keyPressed: function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode + '' === '13'){
                this.saveValue(event);
            }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            value: nextProps.value
        });
    },
    componentDidUpdate: function() {
        var node = ReactDOM.findDOMNode(this);
        $(node).find('select, input').focus();
        $(node).find('input').select();
    },
};
