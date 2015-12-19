var SceneParam = React.createClass({
    onUpdate: function(name, value) {
        this.props.onUpdate(name, Number(value));
    },
    render: function() {
        var scenes = GameCreator.helpers.getSelectableScenes();
        return (<tbody>
                    <DropdownParam name={this.props.name} 
                        value={this.props.value} onUpdate={this.onUpdate} collection={scenes}
                        label='Scene'/>
                </tbody>);
    }
});
