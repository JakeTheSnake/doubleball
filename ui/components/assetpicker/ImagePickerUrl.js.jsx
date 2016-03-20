var ImagePickerUrl = React.createClass({
    setResult: function() {
        this.props.setResult($('#image-select-url-input').val());
    },
    render: function() {
        return (
            <div>
                <input id="image-select-url-input" type="text"/>
                <a className="btn success grow save-selected-image-button" onClick={this.setResult}>Save</a>
            </div>
        );
    }
});
