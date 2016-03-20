var AssetCategory = React.createClass({
    getInitialState: function() {
        return {selectedCategory: 0};
    },
    switchCategory: function(number) {
        this.props.onCategoryClick(this.props.categories[number]);
        this.setState({selectedCategory: number});
    },
    render: function() {
        var categoryButtons = [];
        for (var i = 0; i < this.props.categories.length; i += 1) {
            var cssClasses = 'asset-select-library-category' + (this.state.selectedCategory === i ? ' active' : '');
            categoryButtons.push(
                <div key={'category'+i} className={cssClasses} onClick={this.switchCategory.bind(this,i)}>
                    {GameCreator.helpers.labelize(this.props.categories[i])}
                </div>
            );
        }
        return <div id='asset-select-library-categories'>{categoryButtons}</div>;
    }
});