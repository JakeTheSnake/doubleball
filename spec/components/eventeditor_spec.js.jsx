describe("Event Editor", function() {
    var fixture = document.getElementById('fixture');
    var TestUtils = React.addons.TestUtils;

    it("should contain one when group when given caset without conditions", function() {
        var caSets = [new GameCreator.ConditionActionSet()];
        var eventType = 'collision';

        var eventEditorNode = TestUtils.renderIntoDocument(<EventEditor caSets={caSets} eventType={eventType}/>);
        
        var alwaysSpans = $(ReactDOM.findDOMNode(eventEditorNode)).find('span:contains("Always")');
        expect(alwaysSpans.size()).toBe(2); // One for title, one for content.
    });
});
